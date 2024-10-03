from django.db import models
from django.conf import settings  # Import settings to obtain the Auth.USER.Model
from accounts.models import CustomUser  # Import CustomUser from the accounts app


class FavoriteItem(models.Model):
    # user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Associate custom user models
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Associate custom user models
    item_code = models.CharField(max_length=100)  # Unique identifier of the product
    item_name = models.CharField(max_length=255)
    item_price = models.DecimalField(max_digits=10, decimal_places=2)
    item_url = models.URLField()
    item_image_url = models.URLField()  # URL of product image

    def __str__(self):
        return self.item_name
