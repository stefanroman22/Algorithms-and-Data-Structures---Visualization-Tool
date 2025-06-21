from django.urls import path
from . import views

urlpatterns = [
    path('list', views.quiz_list, name='quiz-list'),
    path('<int:quiz_id>', views.quiz_detail, name='quiz-detail'),
]
