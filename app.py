
from flask import Flask
from flask_login import LoginManager
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
import os
from models import db, User

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
login_manager.login_view = 'auth.login'

# Initialize OAuth
oauth = OAuth(app)
oauth.register(
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

# Import and register blueprints
from routes.auth import auth_bp
from routes.gifts import gifts_bp
from routes.wishlists import wishlists_bp
from routes.users import users_bp
from routes.main import main_bp
from routes.notifications import notifications_bp
from routes.api import api_bp

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(gifts_bp)
app.register_blueprint(wishlists_bp)
app.register_blueprint(users_bp)
app.register_blueprint(main_bp)
app.register_blueprint(notifications_bp)
app.register_blueprint(api_bp)

# Let auth blueprint access the oauth object
from routes.auth import auth_bp
auth_bp.google = oauth.google

if __name__ == '__main__':
    app.run(debug=True)
