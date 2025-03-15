
from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from models import db, User, Wishlist, Friendship
from forms import ProfileForm, PasswordChangeForm
from datetime import datetime

users_bp = Blueprint('users', __name__)

@users_bp.route('/user/<int:user_id>')
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

@users_bp.route('/profile/edit', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = ProfileForm(obj=current_user)
    
    if form.validate_on_submit():
        current_user.name = form.name.data
        current_user.bio = form.bio.data
        current_user.birthdate = form.birthdate.data
        current_user.facebook_url = form.facebook_url.data
        current_user.twitter_url = form.twitter_url.data
        current_user.instagram_url = form.instagram_url.data
        current_user.pinterest_url = form.pinterest_url.data
        
        # Handle profile image upload here if implemented
        
        db.session.commit()
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('users.user_profile', user_id=current_user.id))
    
    return render_template('edit_profile.html', form=form)

@users_bp.route('/user/<int:user_id>/followers')
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

@users_bp.route('/user/<int:user_id>/following')
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

@users_bp.route('/follow/<int:user_id>', methods=['POST'])
@login_required
def follow(user_id):
    user = User.query.get_or_404(user_id)
    
    if user.id == current_user.id:
        flash('You cannot follow yourself!', 'info')
    else:
        current_user.follow(user)
        db.session.commit()
        flash(f'You are now following {user.name}!', 'success')
    
    return redirect(url_for('users.user_profile', user_id=user_id))

@users_bp.route('/unfollow/<int:user_id>', methods=['POST'])
@login_required
def unfollow(user_id):
    user = User.query.get_or_404(user_id)
    
    if user.id == current_user.id:
        flash('You cannot unfollow yourself!', 'info')
    else:
        current_user.unfollow(user)
        db.session.commit()
        flash(f'You have unfollowed {user.name}.', 'success')
    
    return redirect(url_for('users.user_profile', user_id=user_id))

@users_bp.route('/find-friends')
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

@users_bp.route('/dashboard')
@login_required
def dashboard():
    """User dashboard with activity summary"""
    # Count wishlists
    wishlist_count = Wishlist.query.filter_by(user_id=current_user.id).count()
    
    # Count followers
    follower_count = Friendship.query.filter_by(followed_id=current_user.id).count()
    
    # Count following
    following_count = Friendship.query.filter_by(follower_id=current_user.id).count()
    
    # Get recent activity
    recent_wishlists = Wishlist.query.filter_by(user_id=current_user.id).order_by(Wishlist.created_at.desc()).limit(5).all()
    
    # Get notifications
    notifications = current_user.notifications
    
    return render_template(
        'dashboard.html',
        wishlist_count=wishlist_count,
        follower_count=follower_count,
        following_count=following_count,
        recent_wishlists=recent_wishlists,
        notifications=notifications
    )
