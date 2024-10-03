from django.shortcuts import render

# Create your views here.
from django.views import generic
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic.base import TemplateView
from .forms import CustomUserCreationForm
from .models import CustomUser


# Create your views here.
class AccountCreateView(generic.CreateView):
    model = User
    form_class = UserCreationForm
    template_name = 'accounts/accounts_create.html'
    success_url = "/accounts/accounts_create"

class CustomAccountCreationView(generic.CreateView):
    model = CustomUser
    form_class = CustomUserCreationForm
    template_name = 'accounts/accounts_create.html'
    success_url = ''

class Login(LoginView):
    template_name = 'accounts/login.html'

class Logout(LogoutView):
    next_page = '/accounts/login'