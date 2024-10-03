from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Class to create both regular and super users
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        user = self.model(
            username=username,
            email=self.normalize_email(email),
            password=password
        )
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(
            username,
            email,
            password=password,
        )
        user.is_admin = True
        user.is_active = True
        user.save(using=self._db)
        return user

# Define the custom user model
class CustomUser(AbstractBaseUser):
    username = models.CharField('Username', max_length=100, unique=True,
                                error_messages={
                                    'unique': ("A user with this username already exists."),
                                })
    email = models.EmailField('Email Address', unique=True)
    age = models.PositiveIntegerField('Age', default=0)
    is_admin = models.BooleanField('Admin', default=False)
    is_active = models.BooleanField('Active', default=True)
    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.username