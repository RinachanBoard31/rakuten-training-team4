from django import forms
from django.contrib.auth.forms import UserCreationForm
from accounts.models import CustomUser  # Import custom user model

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = CustomUser  # Use custom user model
        fields = ['username', 'email', 'password1', 'password2']
