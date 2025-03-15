
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from models import db, Gift, Wishlist, WishlistItem, User
import json

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/gifts/search')
@login_required
def search_gifts():
    """API endpoint to search gifts"""
    query = request.args.get('q', '')
    category = request.args.get('category', None)
    limit = request.args.get('limit', 10, type=int)
    
    # Build query
    gift_query = Gift.query
    
    if query:
        gift_query = gift_query.filter(Gift.name.like(f'%{query}%'))
    
    if category:
        gift_query = gift_query.filter(Gift.category == category)
    
    gifts = gift_query.limit(limit).all()
    
    # Convert to JSON
    result = []
    for gift in gifts:
        result.append({
            'id': gift.id,
            'name': gift.name,
            'price': gift.price,
            'category': gift.category,
            'image_url': gift.image_url,
            'description': gift.description[:100] + '...' if gift.description and len(gift.description) > 100 else gift.description
        })
    
    return jsonify(result)

@api_bp.route('/api/wishlists/<int:wishlist_id>/items')
@login_required
def get_wishlist_items(wishlist_id):
    """API endpoint to get items in a wishlist"""
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Verify permission
    if not wishlist.is_public and wishlist.user_id != current_user.id:
        return jsonify({'error': 'You do not have permission to view this wishlist'}), 403
    
    # Get items with gifts
    items = WishlistItem.query.filter_by(wishlist_id=wishlist_id).all()
    
    result = []
    for item in items:
        gift = Gift.query.get(item.gift_id)
        if gift:
            result.append({
                'id': item.id,
                'gift_id': gift.id,
                'name': gift.name,
                'price': gift.price,
                'image_url': gift.image_url,
                'status': item.status,
                'priority': item.priority,
                'note': item.note
            })
    
    return jsonify(result)

@api_bp.route('/api/wishlists/<int:wishlist_id>/items/<int:item_id>', methods=['PATCH'])
@login_required
def update_wishlist_item(wishlist_id, item_id):
    """API endpoint to update a wishlist item"""
    wishlist = Wishlist.query.get_or_404(wishlist_id)
    
    # Verify ownership
    if wishlist.user_id != current_user.id:
        return jsonify({'error': 'You do not have permission to update this item'}), 403
    
    item = WishlistItem.query.filter_by(id=item_id, wishlist_id=wishlist_id).first_or_404()
    
    data = request.json
    if 'priority' in data:
        item.priority = data['priority']
    if 'note' in data:
        item.note = data['note']
    
    db.session.commit()
    return jsonify({'success': True, 'item': {'id': item.id, 'priority': item.priority, 'note': item.note}})

@api_bp.route('/api/users/search')
@login_required
def search_users():
    """API endpoint to search users"""
    query = request.args.get('q', '')
    limit = request.args.get('limit', 10, type=int)
    
    if not query:
        return jsonify([])
    
    users = User.query.filter(User.name.like(f'%{query}%')).limit(limit).all()
    
    result = []
    for user in users:
        result.append({
            'id': user.id,
            'name': user.name,
            'profile_image': user.profile_image,
            'is_following': current_user.is_following(user) if user.id != current_user.id else None,
            'profile_url': f'/user/{user.id}'
        })
    
    return jsonify(result)

@api_bp.route('/api/gifts/categories')
def get_categories():
    """API endpoint to get all gift categories"""
    categories = db.session.query(Gift.category).distinct().all()
    category_list = [category[0] for category in categories]
    return jsonify(category_list)
