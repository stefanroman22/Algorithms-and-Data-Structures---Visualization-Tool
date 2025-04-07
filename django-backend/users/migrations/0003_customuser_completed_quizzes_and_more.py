# Generated by Django 5.1.7 on 2025-03-30 09:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_customuser_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='completed_quizzes',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='customuser',
            name='profile_photo',
            field=models.ImageField(default='profile_photos/defaultProfileImage.jpg', upload_to='profile_photos/'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='rank',
            field=models.CharField(default='Bronze', max_length=10),
        ),
    ]
