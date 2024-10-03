from django.urls import path
from . import views

app_name = 'friends'

urlpatterns = [
    path('send_request/', views.send_friend_request, name='send_friend_request'),
    path('accept_request/', views.accept_friend_request, name='accept_friend_request'),
    path('reject_request/', views.reject_friend_request, name='reject_friend_request'),
    path('list/', views.list_friends, name='list_friends'),
    path('remove/', views.remove_friend, name='remove_friend'),
    path('list_received_requests/', views.list_received_requests, name='list_received_requests'),
]
