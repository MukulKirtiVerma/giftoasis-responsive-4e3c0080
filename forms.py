
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField, FloatField, FileField, DateField, SelectField, HiddenField, URLField
from wtforms.validators import DataRequired, Email, Length, EqualTo, Optional, URL

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

class SignupForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(min=2, max=100)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[
        DataRequired(),
        Length(min=8, message='Password must be at least 8 characters long')
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(),
        EqualTo('password', message='Passwords must match')
    ])
    submit = SubmitField('Sign Up')

class WishlistForm(FlaskForm):
    name = StringField('Wishlist Name', validators=[DataRequired(), Length(min=1, max=100)])
    description = TextAreaField('Description', validators=[Optional(), Length(max=500)])
    is_public = BooleanField('Public Wishlist', default=True)
    is_expert_list = BooleanField('Expert List', default=False)
    header_image = FileField('Header Image', validators=[Optional()])
    submit = SubmitField('Create Wishlist')

class ProfileForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(min=2, max=100)])
    bio = TextAreaField('Bio', validators=[Optional(), Length(max=500)])
    birthdate = DateField('Birthdate', format='%Y-%m-%d', validators=[Optional()])
    profile_image = FileField('Profile Image', validators=[Optional()])
    submit = SubmitField('Update Profile')

class GiftForm(FlaskForm):
    name = StringField('Gift Name', validators=[DataRequired(), Length(min=1, max=100)])
    description = TextAreaField('Description', validators=[Optional()])
    price = FloatField('Price ($)', validators=[DataRequired()])
    image_url = StringField('Image URL', validators=[Optional(), URL()])
    category = SelectField('Category', choices=[
        ('Electronics', 'Electronics'),
        ('Clothing', 'Clothing'),
        ('Home Decor', 'Home Decor'),
        ('Books', 'Books'),
        ('Toys', 'Toys'),
        ('Food & Beverages', 'Food & Beverages'),
        ('Fitness', 'Fitness'),
        ('Accessories', 'Accessories'),
        ('Other', 'Other')
    ], validators=[DataRequired()])
    source_url = URLField('Product URL', validators=[Optional(), URL()])
    submit = SubmitField('Add Gift')

class GiftFromURLForm(FlaskForm):
    url = URLField('Product URL', validators=[DataRequired(), URL()])
    wishlist_id = HiddenField('Wishlist ID', validators=[DataRequired()])
    submit = SubmitField('Add to Wishlist')

class SearchForm(FlaskForm):
    query = StringField('Search', validators=[DataRequired()])
    search_type = SelectField('Search By', choices=[
        ('name', 'Name'),
        ('email', 'Email'),
        ('organization', 'Organization')
    ], default='name')
    submit = SubmitField('Search')

