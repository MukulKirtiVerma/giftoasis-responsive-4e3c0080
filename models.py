
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))
    is_google = db.Column(db.Boolean, default=False)
    profile_image = db.Column(db.String(200), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    birthdate = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    wishlists = db.relationship('Wishlist', backref='user', lazy=True)
    following = db.relationship('Friendship', 
                              foreign_keys='Friendship.follower_id',
                              backref=db.backref('follower', lazy='joined'),
                              lazy='dynamic',
                              cascade='all, delete-orphan')
    followers = db.relationship('Friendship',
                              foreign_keys='Friendship.followed_id',
                              backref=db.backref('followed', lazy='joined'),
                              lazy='dynamic',
                              cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        if self.is_google:
            return False
        return check_password_hash(self.password_hash, password)
    
    def follow(self, user):
        if not self.is_following(user):
            friendship = Friendship(follower_id=self.id, followed_id=user.id)
            db.session.add(friendship)
            
    def unfollow(self, user):
        friendship = self.following.filter_by(followed_id=user.id).first()
        if friendship:
            db.session.delete(friendship)
            
    def is_following(self, user):
        return self.following.filter_by(followed_id=user.id).first() is not None
    
    def followed_users(self):
        return User.query.join(Friendship, 
                              (Friendship.followed_id == User.id)).filter(
                                  Friendship.follower_id == self.id)

class Friendship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Gift(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200), nullable=True)
    category = db.Column(db.String(50), nullable=False)
    is_featured = db.Column(db.Boolean, default=False)
    source_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    wishlist_items = db.relationship('WishlistItem', backref='gift', lazy=True)

class Wishlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text, nullable=True)
    is_public = db.Column(db.Boolean, default=True)
    is_expert_list = db.Column(db.Boolean, default=False)
    header_image = db.Column(db.String(200), nullable=True)
    
    # Relationships
    items = db.relationship('WishlistItem', backref='wishlist', lazy=True)
    bookmarks = db.relationship('WishlistBookmark', backref='wishlist', lazy=True)

class WishlistItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    wishlist_id = db.Column(db.Integer, db.ForeignKey('wishlist.id'), nullable=False)
    gift_id = db.Column(db.Integer, db.ForeignKey('gift.id'), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='available') # available, reserved, purchased
    reserved_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    note = db.Column(db.Text, nullable=True)

class WishlistBookmark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    wishlist_id = db.Column(db.Integer, db.ForeignKey('wishlist.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

