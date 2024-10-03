from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import FriendRequest, Friendship  # Import your defined models
from accounts.models import CustomUser  # Import CustomUser if not already imported

@api_view(['POST'])
def send_friend_request(request):
    sender_username = request.data.get('sender')
    receiver_username = request.data.get('receiver')

    sender = get_object_or_404(CustomUser, username=sender_username)
    receiver = get_object_or_404(CustomUser, username=receiver_username)

    # Check if the friend request has already been sent
    if FriendRequest.objects.filter(sender=sender, receiver=receiver).exists():
        return Response({'message': 'Friend request already sent!'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if they are already friends
    if Friendship.objects.filter(user=sender, friend=receiver).exists():
        return Response({'message': 'You are already friends!'}, status=status.HTTP_400_BAD_REQUEST)

    # Create a friend request
    FriendRequest.objects.create(sender=sender, receiver=receiver)
    return Response({'message': 'Friend request sent!'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def list_received_requests(request):
    username = request.query_params.get('username')
    user = get_object_or_404(CustomUser, username=username)
    received_requests = FriendRequest.objects.filter(receiver=user, is_accepted=False)
    request_data = [{'id': req.id, 'sender': req.sender.username} for req in received_requests]
    return Response({'received_requests': request_data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def accept_friend_request(request):
    request_id = request.data.get('request_id')
    friend_request = get_object_or_404(FriendRequest, id=request_id)

    # Verify that the current user is the receiver of the friend request
    if request.user != friend_request.receiver:
        return Response({'message': 'You do not have permission to accept this friend request!'}, 
                        status=status.HTTP_403_FORBIDDEN)

    if friend_request.is_accepted:
        return Response({'message': 'Friend request already accepted!'}, status=status.HTTP_400_BAD_REQUEST)

    # Mark the request as accepted
    friend_request.is_accepted = True
    friend_request.save()

    # Create a two-way friendship
    Friendship.objects.create(user=friend_request.sender, friend=friend_request.receiver)
    Friendship.objects.create(user=friend_request.receiver, friend=friend_request.sender)

    return Response({'message': 'Friend request accepted!'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def reject_friend_request(request):
    request_id = request.data.get('request_id')
    friend_request = get_object_or_404(FriendRequest, id=request_id)

    # Delete the friend request
    friend_request.delete()

    return Response({'message': 'Friend request rejected!'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def list_friends(request):
    username = request.query_params.get('username')
    user = get_object_or_404(CustomUser, username=username)
    
    friends = user.friends.all().values_list('friend__username', flat=True)
    return Response({'friends': list(friends)}, status=status.HTTP_200_OK)

@api_view(['POST'])
def remove_friend(request):
    user_username = request.data.get('user')
    friend_username = request.data.get('friend')

    user = get_object_or_404(CustomUser, username=user_username)
    friend = get_object_or_404(CustomUser, username=friend_username)

    # Delete the two-way friendship
    Friendship.objects.filter(user=user, friend=friend).delete()
    Friendship.objects.filter(user=friend, friend=user).delete()

    return Response({'message': 'Friend removed!'}, status=status.HTTP_200_OK)
