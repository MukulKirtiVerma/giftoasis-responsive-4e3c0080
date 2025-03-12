from flask import Flask, render_template, redirect, url_for, flash, request, session, jsonify, abort
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
import os
from datetime import datetime
import requests
from werkzeug.utils import secure_filename
from models import db, User, Gift, Wishlist, WishlistItem, WishlistBookmark, Friendship, Notification
from forms import (
    LoginForm, SignupForm, WishlistForm, ProfileForm, 
    GiftForm, GiftFromURLForm, SearchForm
)

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
def how_it_works():
    return render_template('how_it_works.html')

# Wishlist routes
@app.route('/wishlists')
@login_required
def wishlists():
    my_wishlists = Wishlist.query.filter_by(user_id=current_user.id).all()
    
    # Get bookmarked wishlists
    bookmarked_ids = db.session.query(WishlistBookmark.wishlist_id).filter_by(user_id=current_user.id).all()
    bookmarked_ids = [id[0] for id in bookmarked_ids]
    bookmarked_wishlists = Wishlist.query.filter(Wishlist.id.in_(bookmarked_ids)).all()
    
    # Get reserved and purchased gifts
    reserved_items = WishlistItem.query.filter_by(reserved_by=current_user.id, status='reserved').all()
    purchased_items = WishlistItem.query.filter_by(reserved_by=current_user.id, status='purchased').all()
    
    # Get the gifts and wishlists for these items
    reserved_gifts = []
    purchased_gifts = []
    
    for item in reserved_items:
        gift = Gift.query.get(item.gift_id)
        wishlist = Wishlist.query.get(item.wishlist_id)
        if gift and wishlist:
            reserved_gifts.append({
                'gift': gift, 
                'wishlist': wishlist,
                'item': item
            })
    
    for item in purchased_items:
        gift = Gift.query.get(item.gift_id)
        wishlist = Wishlist.query.get(item.wishlist_id)
        if gift and wishlist:
            purchased_gifts.append({
                'gift': gift, 
                'wishlist': wishlist,
                'item': item
            })
    
    return render_template(
        'wishlists.html', 
        my_wishlists=my_wishlists, 
        bookmarked_wishlists=bookmarked_wishlists,
        reserved_gifts=reserved_gifts,
        purchased_gifts=purchased_gifts
    )

@app.route('/wishlist/new', methods=['GET', 'POST'])
@login_required
def create_wishlist():
    form = WishlistForm()
    if form.validate_on_submit():
        # Process form data
        is_expert_list = 'list_type' in request.form and request.form['list_type'] == 'expert_list'
        is_public = 'visibility' in request.form and request.form['visibility'] == 'public'
        
        wishlist = Wishlist(
            name=form.name.data,
            description=form.description.data,
            is_public=is_public,
            is_expert_list=is_expert_list,
            user_id=current_user.id,
            show_confirmed_gifts=form.show_confirmed_gifts.data
        )
        
        # Handle header image upload
        if form.header_image.data:
            filename = secure_filename(form.header_image.data.filename)
            if filename:
                # Create directory if it doesn't exist
                upload_dir = os.path.join('static', 'uploads', 'headers')
                os.makedirs(upload_dir, exist_ok=True)
                
                # Save the file
                file_path = os.path.join(upload_dir, filename)
                form.header_image.data.save(file_path)
                
                # Store the relative path in the database
                wishlist.header_image = os.path.join('/static/uploads/headers', filename)
        
        db.session.add(wishlist)
        db.session.commit()
        flash('Wishlist created successfully!', 'success')
        return redirect(url_for('wishlist_detail', wishlist_id=wishlist.id))
    
    return render_template('create_wishlist.html', form=form)

@app.route('/wishlist/<int:wishlist_id>')
@login_required
def wishlist_detail(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check if private wishlist belongs to another user
    if not wishlist.is_public and wishlist.user_id != current_user.id:
        flash('You do not have permission to view this wishlist', 'danger')
        return redirect(url_for('wishlists'))
    
    # Get all wishlist items
    items = WishlistItem.query.filter_by(wishlist_id=wishlist_id).all()
    
    # Create a dictionary to map gift_id to item for easy lookup
    gift_items = {}
    gift_ids = [item.gift_id for item in items]
    
    for item in items:
        gift_items[item.gift_id] = item
    
    # Get all gifts in the wishlist
    gifts = Gift.query.filter(Gift.id.in_(gift_ids)).all()
    
    # Check if user has bookmarked this wishlist
    is_bookmarked = WishlistBookmark.query.filter_by(
        user_id=current_user.id, 
        wishlist_id=wishlist_id
    ).first() is not None
    
    return render_template(
        'wishlist_detail.html', 
        wishlist=wishlist, 
        gifts=gifts, 
        gift_items=gift_items,
        is_bookmarked=is_bookmarked
    )

@app.route('/wishlist/<int:wishlist_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_wishlist(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to edit this wishlist', 'danger')
        return redirect(url_for('wishlists'))
    
    form = WishlistForm(obj=wishlist)
    
    if form.validate_on_submit():
        wishlist.name = form.name.data
        wishlist.description = form.description.data
        
        is_expert_list = 'list_type' in request.form and request.form['list_type'] == 'expert_list'
        is_public = 'visibility' in request.form and request.form['visibility'] == 'public'
        
        wishlist.is_public = is_public
        wishlist.is_expert_list = is_expert_list
        wishlist.show_confirmed_gifts = form.show_confirmed_gifts.data
        
        # Handle header image update
        if form.header_image.data:
            filename = secure_filename(form.header_image.data.filename)
            if filename:
                # Create directory if it doesn't exist
                upload_dir = os.path.join('static', 'uploads', 'headers')
                os.makedirs(upload_dir, exist_ok=True)
                
                # Save the file
                file_path = os.path.join(upload_dir, filename)
                form.header_image.data.save(file_path)
                
                # Store the relative path in the database
                wishlist.header_image = os.path.join('/static/uploads/headers', filename)
        
        db.session.commit()
        flash('Wishlist updated successfully!', 'success')
        return redirect(url_for('wishlist_detail', wishlist_id=wishlist.id))
    
    return render_template('edit_wishlist.html', form=form, wishlist=wishlist)

@app.route('/wishlist/<int:wishlist_id>/delete', methods=['POST'])
@login_required
def delete_wishlist(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to delete this wishlist', 'danger')
        return redirect(url_for('wishlists'))
    
    # Delete all items in wishlist
    WishlistItem.query.filter_by(wishlist_id=wishlist_id).delete()
    
    # Delete all bookmarks for this wishlist
    WishlistBookmark.query.filter_by(wishlist_id=wishlist_id).delete()
    
    # Delete the wishlist
    db.session.delete(wishlist)
    db.session.commit()
    
    flash('Wishlist deleted successfully!', 'success')
    return redirect(url_for('wishlists'))

@app.route('/wishlist/<int:wishlist_id>/add-gift', methods=['GET', 'POST'])
@login_required
def add_gift(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to add gifts to this wishlist', 'danger')
        return redirect(url_for('wishlists'))
    
    form = GiftForm()
    url_form = GiftFromURLForm()
    url_form.wishlist_id.data = wishlist_id
    
    from_url = request.args.get('from_url', 'false') == 'true'
    
    if form.validate_on_submit():
        # Handle image upload if present
        image_url = form.image_url.data
        if 'gift_image' in request.files and request.files['gift_image'].filename:
            image_file = request.files['gift_image']
            if image_file:
                # Create directory if it doesn't exist
                upload_dir = os.path.join('static', 'uploads', 'gifts')
                os.makedirs(upload_dir, exist_ok=True)
                
                # Save the file
                filename = secure_filename(image_file.filename)
                file_path = os.path.join(upload_dir, filename)
                image_file.save(file_path)
                
                # Store the relative path
                image_url = os.path.join('/static/uploads/gifts', filename)
        
        gift = Gift(
            name=form.name.data,
            description=form.description.data,
            price=form.price.data,
            image_url=image_url,
            category=form.category.data,
            source_url=form.source_url.data
        )
        
        db.session.add(gift)
        db.session.flush()  # Get the gift ID without committing
        
        # Add to wishlist
        wishlist_item = WishlistItem(
            wishlist_id=wishlist_id,
            gift_id=gift.id,
            priority=form.priority.data,
            note=form.note.data
        )
        
        db.session.add(wishlist_item)
        db.session.commit()
        
        flash('Gift added to wishlist successfully!', 'success')
        return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))
    
    return render_template(
        'add_gift.html', 
        form=form, 
        url_form=url_form, 
        wishlist=wishlist,
        from_url=from_url
    )

@app.route('/wishlist/<int:wishlist_id>/add-gift-from-url', methods=['POST'])
@login_required
def add_gift_from_url(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to add gifts to this wishlist', 'danger')
        return redirect(url_for('wishlists'))
    
    url_form = GiftFromURLForm()
    
    if url_form.validate_on_submit():
        url = url_form.url.data
        priority = url_form.priority.data
        note = url_form.note.data
        
        # Basic information for the gift
        gift_info = {
            'name': 'Gift from URL',
            'description': '',
            'price': 0.00,
            'image_url': None,
            'category': 'Other'
        }
        
        try:
            # Get website content
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                # This is a very basic implementation
                # In a real application, you would use BeautifulSoup or another library
                # to parse the HTML and extract specific information
                
                # Extract title from HTML
                import re
                title_match = re.search('<title>(.*?)</title>', response.text, re.IGNORECASE)
                if title_match:
                    gift_info['name'] = title_match.group(1).strip()
                
                # Look for a price
                price_patterns = [
                    r'\$\s*(\d+(?:\.\d{2})?)',  # $XX.XX format
                    r'price["\']?\s*:\s*["\']?(\d+(?:\.\d{2})?)',  # price: XX.XX format
                ]
                
                for pattern in price_patterns:
                    price_match = re.search(pattern, response.text, re.IGNORECASE)
                    if price_match:
                        try:
                            gift_info['price'] = float(price_match.group(1))
                            break
                        except (ValueError, IndexError):
                            pass
                
                # Look for an image
                img_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', response.text)
                if img_match:
                    gift_info['image_url'] = img_match.group(1)
                
                # Look for a description
                desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']', response.text)
                if desc_match:
                    gift_info['description'] = desc_match.group(1)
        
        except Exception as e:
            flash(f'Error fetching information from URL: {str(e)}', 'warning')
        
        # Create the gift with the extracted or default information
        gift = Gift(
            name=gift_info['name'],
            description=gift_info['description'],
            price=gift_info['price'],
            image_url=gift_info['image_url'],
            category=gift_info['category'],
            source_url=url
        )
        
        db.session.add(gift)
        db.session.flush()
        
        # Add to wishlist
        wishlist_item = WishlistItem(
            wishlist_id=wishlist_id,
            gift_id=gift.id,
            priority=priority,
            note=note
        )
        
        db.session.add(wishlist_item)
        db.session.commit()
        
        flash('Gift added from URL! You may want to edit its details.', 'success')
        return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))
    
    flash('Invalid form submission', 'danger')
    return redirect(url_for('add_gift', wishlist_id=wishlist_id, from_url='true'))

@app.route('/wishlist/<int:wishlist_id>/add/<int:gift_id>', methods=['POST'])
@login_required
def add_to_wishlist(wishlist_id, gift_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to modify this wishlist', 'danger')
        return redirect(url_for('wishlists'))
    
    # Check if gift exists
    gift = Gift.query.get_or_404(gift_id)
    
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
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to modify this wishlist', 'danger')
        return redirect(url_for('wishlists'))
    
    # Find and remove the item
    item = WishlistItem.query.filter_by(wishlist_id=wishlist_id, gift_id=gift_id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
        flash('Item removed from wishlist successfully!', 'success')
    
    return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))

@app.route('/wishlist/<int:wishlist_id>/bookmark', methods=['POST'])
@login_required
def add_bookmark(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Can't bookmark your own wishlist
    if wishlist.user_id == current_user.id:
        flash('You cannot bookmark your own wishlist', 'info')
        return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))
    
    # Check if already bookmarked
    existing = WishlistBookmark.query.filter_by(
        user_id=current_user.id, 
        wishlist_id=wishlist_id
    ).first()
    
    if not existing:
        bookmark = WishlistBookmark(
            user_id=current_user.id,
            wishlist_id=wishlist_id
        )
        db.session.add(bookmark)
        db.session.commit()
        flash('Wishlist bookmarked successfully!', 'success')
    
    return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))

@app.route('/wishlist/<int:wishlist_id>/remove-bookmark', methods=['POST'])
@login_required
def remove_bookmark(wishlist_id):
    bookmark = WishlistBookmark.query.filter_by(
        user_id=current_user.id, 
        wishlist_id=wishlist_id
    ).first()
    
    if bookmark:
        db.session.delete(bookmark)
        db.session.commit()
        flash('Bookmark removed successfully!', 'success')
    
    return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))

@app.route('/wishlist/<int:wishlist_id>/reserve/<int:gift_id>', methods=['POST'])
@login_required
def reserve_gift(wishlist_id, gift_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Can't reserve from your own wishlist
    if wishlist.user_id == current_user.id:
        flash('You cannot reserve gifts from your own wishlist', 'info')
        return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))
    
    # Find the item
    item = WishlistItem.query.filter_by(wishlist_id=wishlist_id, gift_id=gift_id).first_or_404()
    
    # Only reserve if available
    if item.status == 'available':
        item.status = 'reserved'
        item.reserved_by = current_user.id
        db.session.commit()
        flash('Gift reserved successfully!', 'success')
    else:
        flash('This gift is no longer available', 'info')
    
    return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))

@app.route('/wishlist/<int:wishlist_id>/unreserve/<int:gift_id>', methods=['POST'])
@login_required
def unreserve_gift(wishlist_id, gift_id):
    # Find the item
    item = WishlistItem.query.filter_by(wishlist_id=wishlist_id, gift_id=gift_id).first_or_404()
    
    # Only unreserve if reserved by current user
    if item.status == 'reserved' and item.reserved_by == current_user.id:
        item.status = 'available'
        item.reserved_by = None
        db.session.commit()
        flash('Reservation cancelled successfully!', 'success')
    
    return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))

@app.route('/wishlist/<int:wishlist_id>/mark-purchased/<int:gift_id>', methods=['POST'])
@login_required
def mark_purchased(wishlist_id, gift_id):
    # Find the item
    item = WishlistItem.query.filter_by(wishlist_id=wishlist_id, gift_id=gift_id).first_or_404()
    
    # Only mark as purchased if reserved by current user
    if item.status == 'reserved' and item.reserved_by == current_user.id:
        item.status = 'purchased'
        db.session.commit()
        flash('Gift marked as purchased!', 'success')
    
    return redirect(url_for('wishlist_detail', wishlist_id=wishlist_id))

# User and profile routes
@app.route('/user/<int:user_id>')
@login_required
def user_profile(user_id):
    user = User.query.get_or_404(user_id)
    
    # Get public wishlists for this user
    if user.id == current_user.id:
        wishlists = Wishlist.query.filter_by(user_id=user.id).all()
    else:
        wishlists = Wishlist.query.filter_by(user_id=user.id, is_public=True).all()
    
    followers = user.followers.all()
    following = user.following.all()
    
    is_following = current_user.is_following(user) if user.id != current_user.id else None
    
    return render_template(
        'profile.html', 
        user=user, 
        wishlists=wishlists, 
        followers=followers,
        following=following,
        is_following=is_following
    )

@app.route('/profile/edit', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = ProfileForm(obj=current_user)
    
    if form.validate_on_submit():
        current_user.name = form.name.data
        current_user.bio = form.bio.data
        current_user.birthdate = form.birthdate.data
        
        # Handle profile image upload here if implemented
        
        db.session.commit()
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('user_profile', user_id=current_user.id))
    
    return render_template('edit_profile.html', form=form)

@app.route('/user/<int:user_id>/followers')
@login_required
def user_followers(user_id):
    user = User.query.get_or_404(user_id)
    followers = [friendship.follower for friendship in user.followers.all()]
    
    return render_template(
        'followers.html', 
        user=user, 
        users=followers, 
        title='Followers'
    )

@app.route('/user/<int:user_id>/following')
@login_required
def user_following(user_id):
    user = User.query.get_or_404(user_id)
    following = [friendship.followed for friendship in user.following.all()]
    
    return render_template(
        'followers.html', 
        user=user, 
        users=following, 
        title='Following'
    )

@app.route('/follow/<int:user_id>', methods=['POST'])
@login_required
def follow(user_id):
    user = User.query.get_or_404(user_id)
    
    if user.id == current_user.id:
        flash('You cannot follow yourself!', 'info')
    else:
        current_user.follow(user)
        db.session.commit()
        flash(f'You are now following {user.name}!', 'success')
    
    return redirect(url_for('user_profile', user_id=user_id))

@app.route('/unfollow/<int:user_id>', methods=['POST'])
@login_required
def unfollow(user_id):
    user = User.query.get_or_404(user_id)
    
    if user.id == current_user.id:
        flash('You cannot unfollow yourself!', 'info')
    else:
        current_user.unfollow(user)
        db.session.commit()
        flash(f'You have unfollowed {user.name}.', 'success')
    
    return redirect(url_for('user_profile', user_id=user_id))

@app.route('/find-friends')
@login_required
def find_friends():
    search_type = request.args.get('search_type', 'name')
    query = request.args.get('query', '')
    users = []
    
    if query:
        if search_type == 'name':
            users = User.query.filter(User.name.like(f'%{query}%')).all()
        elif search_type == 'email':
            users = User.query.filter(User.email.like(f'%{query}%')).all()
        # Add support for organization search when implemented
    
    # Get suggested users (users not currently followed)
    followed_ids = [f.followed_id for f in current_user.following.all()]
    followed_ids.append(current_user.id)  # Don't suggest self
    
    suggested_users = User.query.filter(~User.id.in_(followed_ids)).limit(6).all()
    
    return render_template(
        'find_friends.html', 
        users=users, 
        suggested_users=suggested_users,
        search_type=search_type,
        query=query
    )

# Add routes for spoiler alert functionality
@app.route('/wishlist/<int:
