
from app import app, db
from models import User
from flask_sqlalchemy import SQLAlchemy

# Function to initialize the database with a default admin user
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

if __name__ == "__main__":
    init_db()
