from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Quiz
from .serializers import QuizSerializer
from rest_framework import status
from django.http import Http404
from .models import Quiz, QuizQuestion


@api_view(['GET'])
def quiz_list(request):
    quizzes = Quiz.objects.all()
    serializer = QuizSerializer(quizzes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def quiz_detail(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        raise Http404("Quiz not found")

    quiz_questions = QuizQuestion.objects.filter(quiz=quiz).order_by('order')

    quiz_data = {
    "id": quiz.id,
    "title": quiz.title,
    "category": quiz.category,
    "difficulty": quiz.difficulty,
    "questions": [
        {
            "id": q.question.id,
            "question": q.question.text,
            "image": request.build_absolute_uri(q.question.image.url) if q.question.image else None,
            "options": q.question.options,
            "correct_index": q.question.correct_index,
            "explanation": q.question.explanation,
        }
        for q in quiz_questions
    ]
}


    return Response(quiz_data, status=status.HTTP_200_OK)