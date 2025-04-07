from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = models.CharField(unique=True, max_length=150, db_index=True)
    points = models.IntegerField(default=0)
    profile_photo = models.ImageField(
        upload_to='profile_photos/',
        default='profile_photos/defaultProfileImage.jpg'  # Relative to MEDIA_ROOT
    )
    completed_quizzes = models.JSONField(default=list)
    rank = models.CharField(max_length=10, default="Bronze")  # Store rank

    def save(self, *args, **kwargs):
        self.rank = self.calculate_rank()
        super().save(*args, **kwargs)

    def calculate_rank(self):
        if self.points >= 3000:
            return "Gold"
        elif self.points >= 1000:
            return "Silver"
        return "Bronze"

    def __str__(self):
        return self.username
