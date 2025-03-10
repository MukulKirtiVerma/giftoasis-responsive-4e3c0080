
from app import app, db
from models import User, Gift, Wishlist, WishlistItem
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
                is_google=False
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
                    "is_featured": True
                },
                {
                    "name": "Leather Wallet",
                    "description": "Premium leather wallet with RFID protection",
                    "price": 49.99,
                    "image_url": "https://placehold.co/600x400?text=Leather+Wallet",
                    "category": "Accessories",
                    "is_featured": True
                },
                {
                    "name": "Scented Candle Set",
                    "description": "Set of 3 vanilla scented candles in decorative glass jars",
                    "price": 29.99,
                    "image_url": "https://placehold.co/600x400?text=Candle+Set",
                    "category": "Home Decor",
                    "is_featured": True
                },
                {
                    "name": "Wireless Earbuds",
                    "description": "Noise cancelling wireless earbuds with charging case",
                    "price": 129.99,
                    "image_url": "https://placehold.co/600x400?text=Wireless+Earbuds",
                    "category": "Electronics",
                    "is_featured": True
                },
                {
                    "name": "Gourmet Chocolate Box",
                    "description": "Assorted gourmet chocolates in an elegant gift box",
                    "price": 34.99,
                    "image_url": "https://placehold.co/600x400?text=Chocolate+Box",
                    "category": "Food & Beverages",
                    "is_featured": False
                },
                {
                    "name": "Yoga Mat",
                    "description": "Eco-friendly non-slip yoga mat with carrying strap",
                    "price": 24.99,
                    "image_url": "https://placehold.co/600x400?text=Yoga+Mat",
                    "category": "Fitness",
                    "is_featured": False
                }
            ]
            
            for gift_data in sample_gifts:
                gift = Gift(**gift_data)
                db.session.add(gift)
            
            db.session.commit()
            print("Sample gifts added successfully.")
        else:
            print("Gifts already exist in the database.")

if __name__ == "__main__":
    init_db()
