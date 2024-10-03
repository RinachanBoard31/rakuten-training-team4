from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
# from .views.login_views import login_view


app_name = 'items'
urlpatterns = [
    path('', views.search_items, name='search_items'),
    path('favorite/', views.favorite_item, name='favorite_item'),
    # path('favorites/', views.favorites_list, name='favorites_list'),
    path('favorites/delete/<str:item_code>/', views.delete_favorite, name='delete_favorite'),
    # path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='items:search_items'), name='logout'),
    # path('register/', views.register, name='register'),
    path("test/", views.test, name="test"), # for login test
    path('login/', views.login_view, name='login'), # for login on frontend
    path('register/', views.register_view, name='register'),
    path('chatai/', views.chat_ai, name='chat_ai'),
    path('favorites/', views.get_favorite_items, name='favorites_list'),
    path('favorites/delete/', views.delete_favorite_item, name='delete_favorite_item'),
]

