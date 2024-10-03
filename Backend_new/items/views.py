import requests
from django.shortcuts import render, get_object_or_404
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import FavoriteItem
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


APPLICATION_ID = '1078924502039744887' # Rakuten id of Jiawei

def search_items(request):
    if request.method == "GET":
        keyword = request.GET.get('keyword', '')  # Keyword input
        if keyword:
            # Use Rakuten API
            url = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601'
            params = {
                'applicationId': APPLICATION_ID,
                'keyword': keyword,
                'format': 'json',
                'hits': 10,  # Show 10 items
            }
            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                items = data.get('Items', [])
                return render(request, 'items/homepage.html', {'items': items, 'keyword': keyword})
        return render(request, 'items/homepage.html')



@login_required
def favorite_item(request):
    if request.method == 'POST':
        item_code = request.POST.get('item_code')
        item_name = request.POST.get('item_name')
        item_price = request.POST.get('item_price')
        item_url = request.POST.get('item_url')
        item_image_url = request.POST.get('item_image_url')

        # Check if item is starred
        if not FavoriteItem.objects.filter(item_code=item_code, user=request.user).exists():
            # Create and save favorite products, and associate them with the currently logged in user
            FavoriteItem.objects.create(
                user=request.user,
                item_code=item_code,
                item_name=item_name,
                item_price=item_price,
                item_url=item_url,
                item_image_url=item_image_url
            )
        return redirect('items:favorites_list')

@login_required
def favorites_list(request):
    # Retrieve the current user's favorites
    favorites = FavoriteItem.objects.filter(user=request.user)
    return render(request, 'items/favorites_list.html', {'favorites': favorites})

@login_required
def delete_favorite(request, item_code):
    # Delete the current user's favorites
    favorite = FavoriteItem.objects.filter(item_code=item_code, user=request.user).first()
    if favorite:
        favorite.delete()
    return redirect('items:favorites_list')

from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import CustomUserCreationForm


# def register(request):
#     if request.method == 'POST':
#         form = CustomUserCreationForm(request.POST)
#         if form.is_valid():
#             user = form.save()  # Save user
#             login(request, user)  # Automatically login users
#             return redirect('items:search_items')  # Redirects to the Homepage
#     else:
#         form = CustomUserCreationForm()
#     return render(request, 'registration/register.html', {'form': form})

@csrf_exempt
def test(request):
  test = [
    {
      "id": 1,
      "date": "2022-10-01",
      "content": "Test"
    },
    # {
    #   "id": 2,
    #   "date": "2022-10-02",
    #   "content": "[プロジェクト]「プロジェクト名2」デプロイされました。"
    # },
    # {
    #   "id": 3,
    #   "date": "2022-10-03",
    #   "content": "[プロジェクト]「プロジェクト名3」デプロイされました。"
    # },
    # {
    #   "id": 4,
    #   "date": "2022-10-04",
    #   "content": "[プロジェクト]「プロジェクト名4」デプロイされました。"
    # },
      
  ]

  return JsonResponse(test, safe=False)

from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser  # Import your custom user model
from accounts.serializer import CustomUserSerializer, CustomUserRegistrationSerializer  # Import the serializer



@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        # ユーザーが存在する場合の処理
        user_data = CustomUserSerializer(user).data
        return Response(user_data)
    else:
        # ユーザーが存在しない場合の処理
        return Response({'message': 'Invalid credentials'}, status=400)


@api_view(['POST'])
def register_view(request):
    serializer = CustomUserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()  # Save user
        login(request, user)  # Automatically log the user in
        return Response({
            'message': 'User registered successfully',
            'user': CustomUserSerializer(user).data  # Serialize and return user data
        }, status=201)
    else:
        return Response(serializer.errors, status=400)