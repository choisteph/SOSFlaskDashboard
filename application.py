from flask import Flask, render_template, request, redirect, url_for
from opioid_dict import src_dict, center_dict, special_dict, counties, names, MEcounties, cities
from flask_login import LoginManager, login_required, login_user, logout_user, UserMixin, current_user
from flask_bcrypt import Bcrypt
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from itertools import chain
import os

application = Flask(__name__)
application.secret_key = b'whatisacsrf#$^@&^@#!&^:{>}'
login_manager = LoginManager()
login_manager.init_app(application)
login_manager.login_view = '/login'
bcrypt = Bcrypt(application)

class User(UserMixin):

    def __init__(self, email, username, pw_raw, authenticated):
        self.email = email
        self.username = username
        self.password = bcrypt.generate_password_hash(pw_raw).decode('UTF-8')  # 'UTF-8' needed for Python 3.X
        self.authenticated = authenticated

    def get_id(self):
        return self.email

    def is_authenticated(self):
        return self.authenticated

    @staticmethod
    def authenticate(username, pw_raw):
        fetched_user = user1 #hardcoded user1
        if fetched_user:
            authenticated_user = bcrypt.check_password_hash(fetched_user.password, pw_raw)
            fetched_user.authenticated = True
        else:
            authenticated_user = False
        return fetched_user, authenticated_user

class LoginForm(FlaskForm):
    username = StringField('Username')
    password = PasswordField('Password')
    submit = SubmitField('Submit')

user1 = User('flask@login', os.getenv('User'), os.getenv('Pwd'), False)

@login_manager.user_loader
def load_user(user_id):
    user1.email = user_id
    return user1
    
# Route for handling the login page logic
@application.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('searchpage'))
    error = None
    form = LoginForm()
    if form.validate_on_submit():
        fetched_user, authenticated_user = User.authenticate(form.username.data, form.password.data)
        if fetched_user and authenticated_user:
            login_user(fetched_user, remember=True)
            return fetched_user and redirect(url_for('searchpage'))
        else:
            error = 'Invalid Credentials.'
    return render_template('login.html', form=form, error=error)

@application.route("/logout")
@login_required
def logout():
    user = current_user
    user.authenticated = False
    logout_user()
    return redirect(url_for('login'))

@login_manager.unauthorized_handler
def unauthorized():
    form = LoginForm()
    redirerror = 'You must login first.'
    return render_template('login.html', form=form, redirerror=redirerror)

@application.route('/')
def landing():
    data = {'MEcounties': MEcounties}
    return render_template('landing.html', data=data)

@application.route('/about')
def about():
    return render_template('about.html')

@application.route('/contact')
def contact():

    return render_template('contact.html')

@application.route('/howtouse')
def howtouse():

    return render_template('howtouse.html')

@application.route('/search', methods=['GET'])
@login_required
def searchpage():
    data = {'placenames': list(chain.from_iterable(names.values()))}
    citylst = cities
    return render_template("search.html", data=data, citylst = citylst)

@application.route('/dashboard', methods=['GET'])
@login_required
def navtocorrect():
    source = request.args.get('src', default = "EMS", type = str).upper()
    city = request.args.get('city')
    county = request.args.get('county')
    city_flag = True if city else False

    if city_flag:
        placename = city.title()
        titlename = special_dict.get(placename, placename)
        folder = 'cities'
    else:
        placename = county.title()
        titlename = f'{placename} County'
        folder = 'counties'

    data = {
      'placename': placename,
      'titlename': titlename,
      'src': source,
      'f_geojson': f'geojson/{folder}/{placename}.geojson',
      'center': center_dict[folder][placename]['center'],
      'zoom': center_dict[folder][placename].get('zoom', 11),
      'names': names,
      'counties': counties,
      'placetype': folder.replace('ies','y'),
    }

    return render_template("dashboard.html", data=data)

#%% Run Flask app
# python application.py
if __name__ == '__main__':
    application.run(debug=True)
