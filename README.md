
# GiftOasis Flask Application

A Flask web application for a gift recommendation website with user authentication and MySQL database integration.

## Setup Instructions

### 1. Set up a virtual environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On macOS and Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the project root with the following contents (replacing placeholders with your actual values):

```
# Flask configuration
SECRET_KEY=your-secret-key-here
FLASK_APP=app.py
FLASK_ENV=development

# Database configuration
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=giftoasis

# Google OAuth configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Set up MySQL database

Create a MySQL database named `giftoasis`:

```sql
CREATE DATABASE giftoasis;
```

### 5. Initialize the database

```bash
python init_db.py
```

This will create all necessary tables and add sample data.

### 6. Run the application

```bash
flask run
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to APIs & Services > OAuth consent screen
4. Configure the OAuth consent screen
5. Go to APIs & Services > Credentials
6. Create OAuth client ID credentials
7. Set the authorized redirect URI to `http://localhost:5000/google-auth`
8. Copy the Client ID and Client Secret to your `.env` file

## Default Admin User

The application comes with a default user:
- Email: rahulsingh60verma@gmail.com
- Password: rahul@123A

## Features

- User authentication (email/password and Google OAuth)
- Password-protected pages
- Responsive design
- Gift browsing and filtering
- Categories and featured gifts
- Wishlist creation and management
- Add/remove items from wishlists

## Application Structure

- `app.py`: Main application file with all routes and configuration
- `models.py`: Database models for User, Gift, Wishlist, and WishlistItem
- `forms.py`: WTForms for login, signup, and wishlist creation
- `templates/`: HTML templates using Jinja2 and Tailwind CSS
- `init_db.py`: Script to initialize the database with default user and sample gifts

## Protected Routes

All routes except the homepage, login, and signup pages require authentication. Users will be redirected to the login page if they try to access these routes without being logged in.
