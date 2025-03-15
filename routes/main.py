
from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required
from models import Gift

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    featured_gifts = Gift.query.filter_by(is_featured=True).limit(4).all()
    return render_template('index.html', featured_gifts=featured_gifts)

@main_bp.route('/how-it-works')
def how_it_works():
    return render_template('how_it_works.html')

@main_bp.route('/categories')
@login_required
def categories():
    gift_categories = Gift.query.with_entities(Gift.category).distinct().all()
    categories_list = [cat[0] for cat in gift_categories]
    return render_template('categories.html', categories=categories_list)
