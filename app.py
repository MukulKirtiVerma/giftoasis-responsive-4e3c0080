
from flask import Flask, render_template, redirect, url_for, flash, request, session, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
import os
from models import db, User, Gift, Wishlist, WishlistItem
from forms import LoginForm, SignupForm, WishlistForm

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

# Initialize login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Initialize OAuth
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid email profile'},
)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    featured_gifts = Gift.query.filter_by(is_featured=True).limit(4).all()
    return render_template('index.html', featured_gifts=featured_gifts)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('index'))
        else:
            flash('Invalid email or password', 'danger')
    
    return render_template('login.html', form=form)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = SignupForm()
    if form.validate_on_submit():
        if User.query.filter_by(email=form.email.data).first():
            flash('Email already registered', 'danger')
        else:
            user = User(
                name=form.name.data,
                email=form.email.data
            )
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            login_user(user)
            flash('Account created successfully!', 'success')
            return redirect(url_for('index'))
    
    return render_template('signup.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/google-login')
def google_login():
    redirect_uri = url_for('google_auth', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/google-auth')
def google_auth():
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    
    # Check if user exists
    user = User.query.filter_by(email=user_info['email']).first()
    
    if not user:
        # Create user if not exists
        user = User(
            name=user_info['name'],
            email=user_info['email'],
            is_google=True
        )
        db.session.add(user)
        db.session.commit()
    
    login_user(user)
    return redirect(url_for('index'))

@app.route('/categories')
@login_required
def categories():
    gift_categories = db.session.query(Gift.category).distinct().all()
    categories_list = [cat[0] for cat in gift_categories]
    return render_template('categories.html', categories=categories_list)

@app.route('/featured')
@login_required
def featured():
    featured_gifts = Gift.query.filter_by(is_featured=True).all()
    return render_template('featured.html', gifts=featured_gifts)

@app.route('/category/<category>')
@login_required
def category_gifts(category):
    gifts = Gift.query.filter_by(category=category).all()
    return render_template('category_gifts.html', category=category, gifts=gifts)

@app.route('/gift/<int:gift_id>')
@login_required
def gift_detail(gift_id):
    gift = Gift.query.get_or_404(gift_id)
    user_wishlists = Wishlist.query.filter_by(user_id=current_user.id).all()
    return render_template('gift_detail.html', gift=gift, wishlists=user_wishlists)

@app.route('/how-it-works')
@login_required
def how_it_works():
    return render_template('how_it_works.html')

# Wishlist routes
@app.route('/wishlists')
@login_required
def wishlists():
    user_wishlists = Wishlist.query.filter_by(user_id=current_user.id).all()
    return render_template('wishlists.html', wishlists=user_wishlists)

@app.route('/wishlist/new', methods=['GET', 'POST'])
@login_required
def create_wishlist():
    form = WishlistForm()
    if form.validate_on_submit():
        wishlist = Wishlist(
            name=form.name.data,
            user_id=current_user.id
        )
        db.session.add(wishlist)
        db.session.commit()
        flash('Wishlist created successfully!', 'success')
        return redirect(url_for('wishlists'))
    return render_template('create_wishlist.html', form=form)

@app.route('/wishlist/<int:wishlist_id>')
@login_required
def wishlist_detail(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to view this wishlist', 'danger')
        return redirect(url_for('wishlists'))
    
    items = WishlistItem.query.filter_by(wishlist_id=wishlist_id).all()
    gifts = [Gift.query.get(item.gift_id) for item in items]
    return render_template('wishlist_detail.html', wishlist=wishlist, gifts=gifts)

@app.route('/wishlist/<int:wishlist_id>/add/<int:gift_id>', methods=['POST'])
@login_required
def add_to_wishlist(wishlist_id, gift_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to modify this wishlist', 'danger')
        return redirect(url_for('wishlists'))
    
    # Check if item already in wishlist
    existing_item = WishlistItem.query.filter_by(wishlist_id=wishlist_id, gift_id=gift_id).first()
    if existing_item:
        flash('This item is already in your wishlist', 'info')
    else:
        item = WishlistItem(wishlist_id=wishlist_id, gift_id=gift_id)
        db.session.add(item)
        db.session.commit()
        flash('Item added to wishlist successfully!', 'success')
    
    return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))

@app.route('/wishlist/<int:wishlist_id>/remove/<int:gift_id>', methods=['POST'])
@login_required
def remove_from_wishlist(wishlist_id, gift_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to modify this wishlist', 'danger')
        return redirect(url_for('wishlists'))
    
    item = WishlistItem.query.filter_by(wishlist_id=wishlist_id, gift_id=gift_id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
        flash('Item removed from wishlist successfully!', 'success')
    
    return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))

# Create tables within application context
with app.app_context():
    db.create_all()

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
