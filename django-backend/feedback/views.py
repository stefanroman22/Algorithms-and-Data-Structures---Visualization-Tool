from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ContactFeedback
import json

@csrf_exempt
def contact_feedback_view(request):
    feedback, _ = ContactFeedback.objects.get_or_create(id=1)

    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("vote") == "like":
            feedback.likes += 1
        elif data.get("vote") == "dislike":
            feedback.dislikes += 1
        feedback.save()
        return JsonResponse({"status": "vote recorded"})
