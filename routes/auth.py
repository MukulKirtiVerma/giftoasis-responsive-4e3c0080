
from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User
from forms import LoginForm, SignupForm
import os

auth_bp = Blueprint('auth', __name__)

# OAuth will be imported from the app
google = None

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('main.index'))
        else:
            flash('Invalid email or password', 'danger')
    
    return render_template('login.html', form=form)

@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    
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
            return redirect(url_for('main.index'))
    
    return render_template('signup.html', form=form)

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@auth_bp.route('/google-login')
def google_login():
    global google
    if not google:
        from app import oauth
        google = oauth.google
    
    redirect_uri = url_for('auth.google_auth', _external=True)
    return google.authorize_redirect(redirect_uri)

@auth_bp.route('/auth/google/callback')
def google_auth():
    global google
    if not google:
        from app import oauth
        google = oauth.google
    
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
    return redirect(url_for('main.index'))
