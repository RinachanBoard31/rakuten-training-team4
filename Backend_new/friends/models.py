from django.db import models
from accounts.models import CustomUser

class FriendRequest(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_requests')
    is_accepted = models.BooleanField(default=False)  # If accepted
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp of request creation

    def __str__(self):
        return f'{self.sender.username} -> {self.receiver.username}'


class Friendship(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='friends')
    friend = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.username} is friends with {self.friend.username}'
