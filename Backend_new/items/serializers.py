from rest_framework import serializers
from .models import FavouriteItem

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'
