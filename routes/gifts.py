
from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from models import db, Gift, Wishlist
from forms import GiftForm
from werkzeug.utils import secure_filename
import os

gifts_bp = Blueprint('gifts', __name__)

@gifts_bp.route('/featured')
@login_required
def featured():
    featured_gifts = Gift.query.filter_by(is_featured=True).all()
    return render_template('featured.html', gifts=featured_gifts)

@gifts_bp.route('/category/<category>')
@login_required
def category_gifts(category):
    gifts = Gift.query.filter_by(category=category).all()
    return render_template('category_gifts.html', category=category, gifts=gifts)

@gifts_bp.route('/gift/<int:gift_id>')
@login_required
def gift_detail(gift_id):
    gift = Gift.query.get_or_404(gift_id)
    user_wishlists = Wishlist.query.filter_by(user_id=current_user.id).all()
    return render_template('gift_detail.html', gift=gift, wishlists=user_wishlists)

@gifts_bp.route('/gift/<int:gift_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_gift(gift_id):
    gift = Gift.query.get_or_404(gift_id)
    form = GiftForm(obj=gift)
    
    if form.validate_on_submit():
        gift.name = form.name.data
        gift.description = form.description.data
        gift.price = form.price.data
        gift.category = form.category.data
        gift.source_url = form.source_url.data
        
        # Handle image upload if present
        if form.image_url.data and form.image_url.data != gift.image_url:
            gift.image_url = form.image_url.data
            
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
                gift.image_url = os.path.join('/static/uploads/gifts', filename)
        
        db.session.commit()
        flash('Gift updated successfully!', 'success')
        return redirect(url_for('gifts.gift_detail', gift_id=gift.id))
    
    return render_template('edit_gift.html', form=form, gift=gift)
