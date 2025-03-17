
from flask import Blueprint, render_template, redirect, url_for, flash, request, jsonify, session
from flask_login import login_required, current_user
from models import db, Wishlist, WishlistItem, WishlistBookmark, Gift, User
from forms import WishlistForm, GiftForm, GiftFromURLForm, WishlistItemForm
from werkzeug.utils import secure_filename
import os
import requests
import re
from datetime import datetime

wishlists_bp = Blueprint('wishlists', __name__)

@wishlists_bp.route('/wishlists')
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

@wishlists_bp.route('/wishlist/new', methods=['GET', 'POST'])
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
        return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist.id))
    
    return render_template('create_wishlist.html', form=form)

@wishlists_bp.route('/wishlist/<int:wishlist_id>')
@login_required
def wishlist_detail(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check if private wishlist belongs to another user
    if not wishlist.is_public and wishlist.user_id != current_user.id:
        flash('You do not have permission to view this wishlist', 'danger')
        return redirect(url_for('wishlists.wishlists'))
    
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

@wishlists_bp.route('/wishlist/<int:wishlist_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_wishlist(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to edit this wishlist', 'danger')
        return redirect(url_for('wishlists.wishlists'))
    
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
        return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist.id))
    
    return render_template('edit_wishlist.html', form=form, wishlist=wishlist)

@wishlists_bp.route('/wishlist/<int:wishlist_id>/delete', methods=['POST'])
@login_required
def delete_wishlist(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to delete this wishlist', 'danger')
        return redirect(url_for('wishlists.wishlists'))
    
    # Delete all items in wishlist
    WishlistItem.query.filter_by(wishlist_id=wishlist_id).delete()
    
    # Delete all bookmarks for this wishlist
    WishlistBookmark.query.filter_by(wishlist_id=wishlist_id).delete()
    
    # Delete the wishlist
    db.session.delete(wishlist)
    db.session.commit()
    
    flash('Wishlist deleted successfully!', 'success')
    return redirect(url_for('wishlists.wishlists'))

@wishlists_bp.route('/wishlist/<int:wishlist_id>/add-gift', methods=['GET', 'POST'])
@login_required
def add_gift(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to add gifts to this wishlist', 'danger')
        return redirect(url_for('wishlists.wishlists'))
    
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
        return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))
    
    return render_template(
        'add_gift.html', 
        form=form, 
        url_form=url_form, 
        wishlist=wishlist,
        from_url=from_url
    )

@wishlists_bp.route('/wishlist/<int:wishlist_id>/add-gift-from-url', methods=['POST'])
@login_required
def add_gift_from_url(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to add gifts to this wishlist', 'danger')
        return redirect(url_for('wishlists.wishlists'))
    
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
        return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))
    
    flash('Invalid form submission', 'danger')
    return redirect(url_for('wishlists.add_gift', wishlist_id=wishlist_id, from_url='true'))

@wishlists_bp.route('/wishlist/<int:wishlist_id>/add/<int:gift_id>', methods=['POST'])
@login_required
def add_to_wishlist(wishlist_id, gift_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to modify this wishlist', 'danger')
        return redirect(url_for('wishlists.wishlists'))
    
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
    
    return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))

@wishlists_bp.route('/wishlist/<int:wishlist_id>/remove/<int:gift_id>', methods=['POST'])
@login_required
def remove_from_wishlist(wishlist_id, gift_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Check ownership
    if wishlist.user_id != current_user.id:
        flash('You do not have permission to modify this wishlist', 'danger')
        return redirect(url_for('wishlists.wishlists'))
    
    # Find and remove the item
    item = WishlistItem.query.filter_by(wishlist_id=wishlist_id, gift_id=gift_id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
        flash('Item removed from wishlist successfully!', 'success')
    
    return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))

@wishlists_bp.route('/wishlist/<int:wishlist_id>/bookmark', methods=['POST'])
@login_required
def add_bookmark(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Can't bookmark your own wishlist
    if wishlist.user_id == current_user.id:
        flash('You cannot bookmark your own wishlist', 'info')
        return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))
    
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
    
    return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))

@wishlists_bp.route('/wishlist/<int:wishlist_id>/remove-bookmark', methods=['POST'])
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
    
    return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))

@wishlists_bp.route('/wishlist/<int:wishlist_id>/reserve/<int:gift_id>', methods=['POST'])
@login_required
def reserve_gift(wishlist_id, gift_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Can't reserve from your own wishlist
    if wishlist.user_id == current_user.id:
        flash('You cannot reserve gifts from your own wishlist', 'info')
        return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))
    
    # Find the item
    item = WishlistItem.query.filter_by(wishlist_id=wishlist_id, gift_id=gift_id).first_or_404()
    
    # Only reserve if available
    if item.status == 'available':
        item.status = 'reserved'
        item.reserved_by = current_user.id
        item.reserved_at = datetime.utcnow()
        db.session.commit()
        flash('Gift reserved successfully!', 'success')
    else:
        flash('This gift is no longer available', 'info')
    
    return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))

@wishlists_bp.route('/wishlist/<int:wishlist_id>/unreserve/<int:gift_id>', methods=['POST'])
@login_required
def unreserve_gift(wishlist_id, gift_id):
    # Find the item
    item = WishlistItem.query.filter_by(wishlist_id=wishlist_id, gift_id=gift_id).first_or_404()
    
    # Only unreserve if reserved by current user
    if item.status == 'reserved' and item.reserved_by == current_user.id:
        item.status = 'available'
        item.reserved_by = None
        item.reserved_at = None
        db.session.commit()
        flash('Reservation cancelled successfully!', 'success')
    
    return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))

@wishlists_bp.route('/wishlist/<int:wishlist_id>/mark-purchased/<int:gift_id>', methods=['POST'])
@login_required
def mark_purchased(wishlist_id, gift_id):
    # Find the item
    item = WishlistItem.query.filter_by(wishlist_id=wishlist_id, gift_id=gift_id).first_or_404()
    
    # Only mark as purchased if reserved by current user
    if item.status == 'reserved' and item.reserved_by == current_user.id:
        item.status = 'purchased'
        item.purchased_at = datetime.utcnow()
        db.session.commit()
        flash('Gift marked as purchased!', 'success')
    
    return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))

@wishlists_bp.route('/wishlist/<int:wishlist_id>/spoiler', methods=['GET', 'POST'])
@login_required
def spoiler_alert(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    if request.method == 'POST':
        if 'show_confirmed' in request.form:
            session[f'show_spoilers_{wishlist_id}'] = True
            return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))
        else:
            return redirect(url_for('wishlists.wishlists'))
    
    return render_template('spoiler_alert.html', wishlist=wishlist)

@wishlists_bp.route('/wishlist/<int:wishlist_id>/toggle-spoilers', methods=['POST'])
@login_required
def toggle_spoilers(wishlist_id):
    # Toggle the spoiler setting for this wishlist
    if f'show_spoilers_{wishlist_id}' in session:
        session.pop(f'show_spoilers_{wishlist_id}')
        flash('Spoilers are now hidden', 'info')
    else:
        session[f'show_spoilers_{wishlist_id}'] = True
        flash('Spoilers are now visible', 'info')
    
    return redirect(url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id))

@wishlists_bp.route('/wishlist/<int:wishlist_id>/share')
@login_required
def share_wishlist(wishlist_id):
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Generate share URL
    share_url = url_for('wishlists.wishlist_detail', wishlist_id=wishlist_id, _external=True)
    
    return render_template('share_wishlist.html', wishlist=wishlist, share_url=share_url)
