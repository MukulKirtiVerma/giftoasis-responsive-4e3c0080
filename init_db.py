
from app import app, db
from models import User, Gift, Wishlist, WishlistItem, Notification
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Function to initialize the database with a default admin user and sample gifts
def init_db():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if default user exists
        admin_user = User.query.filter_by(email="rahulsingh60verma@gmail.com").first()
        
        # If default user doesn't exist, create it
        if not admin_user:
            admin_user = User(
                name="Rahul Singh",
                email="rahulsingh60verma@gmail.com",
                is_google=False,
                bio="GiftHero admin and gift enthusiast",
                facebook_url="https://facebook.com/gifthero",
                twitter_url="https://twitter.com/gifthero",
                instagram_url="https://instagram.com/gifthero"
            )
            admin_user.set_password("rahul@123A")
            db.session.add(admin_user)
            db.session.commit()
            print("Default admin user created successfully.")
        else:
            print("Default admin user already exists.")
        
        # Add sample gifts if they don't exist
        if Gift.query.count() == 0:
            sample_gifts = [
                {
                    "name": "Smart Watch",
                    "description": "A stylish smartwatch with health monitoring features",
                    "price": 199.99,
                    "image_url": "https://placehold.co/600x400?text=Smart+Watch",
                    "category": "Electronics",
                    "is_featured": True,
                    "source_url": "https://example.com/smartwatch"
                },
                {
                    "name": "Leather Wallet",
                    "description": "Premium leather wallet with RFID protection",
                    "price": 49.99,
                    "image_url": "https://placehold.co/600x400?text=Leather+Wallet",
                    "category": "Accessories",
                    "is_featured": True,
                    "source_url": "https://example.com/wallet"
                },
                {
                    "name": "Scented Candle Set",
                    "description": "Set of 3 vanilla scented candles in decorative glass jars",
                    "price": 29.99,
                    "image_url": "https://placehold.co/600x400?text=Candle+Set",
                    "category": "Home Decor",
                    "is_featured": True,
                    "source_url": "https://example.com/candles"
                },
                {
                    "name": "Wireless Earbuds",
                    "description": "Noise cancelling wireless earbuds with charging case",
                    "price": 129.99,
                    "image_url": "https://placehold.co/600x400?text=Wireless+Earbuds",
                    "category": "Electronics",
                    "is_featured": True,
                    "source_url": "https://example.com/earbuds"
                },
                {
                    "name": "Gourmet Chocolate Box",
                    "description": "Assorted gourmet chocolates in an elegant gift box",
                    "price": 34.99,
                    "image_url": "https://placehold.co/600x400?text=Chocolate+Box",
                    "category": "Food & Beverages",
                    "is_featured": False,
                    "source_url": "https://example.com/chocolates"
                },
                {
                    "name": "Yoga Mat",
                    "description": "Eco-friendly non-slip yoga mat with carrying strap",
                    "price": 24.99,
                    "image_url": "https://placehold.co/600x400?text=Yoga+Mat",
                    "category": "Fitness",
                    "is_featured": False,
                    "source_url": "https://example.com/yogamat"
                },
                {
                    "name": "Coffee Subscription",
                    "description": "Monthly delivery of premium coffee beans",
                    "price": 19.99,
                    "image_url": "https://placehold.co/600x400?text=Coffee+Subscription",
                    "category": "Food & Beverages",
                    "is_featured": True,
                    "source_url": "https://example.com/coffee"
                },
                {
                    "name": "Bluetooth Speaker",
                    "description": "Portable waterproof bluetooth speaker with amazing sound",
                    "price": 79.99,
                    "image_url": "https://placehold.co/600x400?text=Bluetooth+Speaker",
                    "category": "Electronics",
                    "is_featured": False,
                    "source_url": "https://example.com/speaker"
                },
                {
                    "name": "Bestselling Novel",
                    "description": "Latest bestselling fiction novel by a popular author",
                    "price": 14.99,
                    "image_url": "https://placehold.co/600x400?text=Bestselling+Novel",
                    "category": "Books",
                    "is_featured": False,
                    "source_url": "https://example.com/book"
                },
                {
                    "name": "Fitness Tracker",
                    "description": "Advanced fitness tracker with heart rate monitor",
                    "price": 89.99,
                    "image_url": "https://placehold.co/600x400?text=Fitness+Tracker",
                    "category": "Fitness",
                    "is_featured": True,
                    "source_url": "https://example.com/fitnesstracker"
                }
            ]
            
            for gift_data in sample_gifts:
                gift = Gift(**gift_data)
                db.session.add(gift)
            
            db.session.commit()
            print("Sample gifts added successfully.")
        else:
            print("Gifts already exist in the database.")
            
        # Create a default wishlist for admin if none exists
        if Wishlist.query.filter_by(user_id=admin_user.id).count() == 0:
            default_wishlist = Wishlist(
                name="My Wishlist",
                description="A collection of things I'd like to receive",
                is_public=True,
                is_expert_list=False,
                user_id=admin_user.id
            )
            db.session.add(default_wishlist)
            db.session.commit()
            
            # Add some gifts to the wishlist
            featured_gifts = Gift.query.filter_by(is_featured=True).limit(3).all()
            for gift in featured_gifts:
                item = WishlistItem(
                    wishlist_id=default_wishlist.id,
                    gift_id=gift.id,
                    priority=2  # Medium priority
                )
                db.session.add(item)
            
            db.session.commit()
            print("Default wishlist created for admin user.")

if __name__ == "__main__":
    init_db()
