
from flask import Blueprint, render_template, redirect, url_for, flash, jsonify, request, g
from flask_login import login_required, current_user
from models import db, Notification
from datetime import datetime

notifications_bp = Blueprint('notifications', __name__)

# Context processor to make unread_notifications_count available to all templates
@notifications_bp.app_context_processor
def inject_notification_count():
    unread_count = 0
    if hasattr(g, 'user') and g.user.is_authenticated:
        unread_count = Notification.query.filter_by(user_id=g.user.id, is_read=False).count()
    elif current_user.is_authenticated:
        unread_count = Notification.query.filter_by(user_id=current_user.id, is_read=False).count()
    return {'unread_notifications_count': unread_count}

@notifications_bp.route('/notifications')
@login_required
def notifications():
    """View all notifications"""
    user_notifications = Notification.query.filter_by(user_id=current_user.id).order_by(Notification.created_at.desc()).all()
    
    # Mark all as read
    for notification in user_notifications:
        if not notification.is_read:
            notification.is_read = True
    
    db.session.commit()
    
    return render_template('notifications.html', notifications=user_notifications)

@notifications_bp.route('/notifications/count')
@login_required
def notification_count():
    """Get count of unread notifications for AJAX requests"""
    count = Notification.query.filter_by(user_id=current_user.id, is_read=False).count()
    return jsonify({'count': count})

@notifications_bp.route('/notifications/clear', methods=['POST'])
@login_required
def clear_notifications():
    """Delete all notifications"""
    Notification.query.filter_by(user_id=current_user.id).delete()
    db.session.commit()
    flash('All notifications cleared', 'success')
    return redirect(url_for('notifications.notifications'))

@notifications_bp.route('/notifications/<int:notification_id>/delete', methods=['POST'])
@login_required
def delete_notification(notification_id):
    """Delete a specific notification"""
    notification = Notification.query.filter_by(id=notification_id, user_id=current_user.id).first_or_404()
    db.session.delete(notification)
    db.session.commit()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': True})
    
    flash('Notification deleted', 'success')
    return redirect(url_for('notifications.notifications'))

@notifications_bp.route('/notifications/mark-read', methods=['POST'])
@login_required
def mark_all_read():
    """Mark all notifications as read"""
    notifications = Notification.query.filter_by(user_id=current_user.id, is_read=False).all()
    for notification in notifications:
        notification.is_read = True
    
    db.session.commit()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': True})
    
    flash('All notifications marked as read', 'success')
    return redirect(url_for('notifications.notifications'))
