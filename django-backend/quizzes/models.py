from django.db import models

from django.db import models
from django.core.exceptions import ValidationError

class Question(models.Model):
    text = models.TextField()
    explanation = models.TextField(blank=True)
    
    # New field: optional image uploaded with the question
    image = models.ImageField(upload_to='question_images/', blank=True, null=True)

    # Multiple choice fields
    options = models.JSONField(default=list)  # Stores list like ["A", "B", "C", "D"]
    correct_index = models.PositiveIntegerField(default=0)

    def clean(self):
        if len(self.options) != 4:
            raise ValidationError("Each question must have exactly 4 options.")
        if not (0 <= self.correct_index < len(self.options)):
            raise ValidationError("Correct index must be between 0 and 3.")

    def get_correct_option(self):
        try:
            return self.options[self.correct_index]
        except IndexError:
            return None

    def __str__(self):
        return f"Q: {self.text[:60]}..."

    class Meta:
        verbose_name = "Question"
        verbose_name_plural = "Questions"



class QuizQuestion(models.Model):
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.quiz.title} -> Q{self.order}: {self.question.text[:30]}"

class Quiz(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='quiz_images/')  # Requires MEDIA config
    category = models.CharField(max_length=100)  # e.g., "Graph Algorithms", "Stacks"
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    questions = models.ManyToManyField(
        Question,
        through='QuizQuestion',
        related_name='quizzes'
    )

    class Meta:
        verbose_name = "Quiz"
        verbose_name_plural = "Quizzes"

    # Metadata
    question_count = models.PositiveIntegerField(default=10, editable=False)
    time_limit_minutes = models.PositiveIntegerField(default=10, editable=False)

    def __str__(self):
        return f"{self.title} ({self.category})"
    
    def clean(self):
        if self.pk:  # Only validate if the quiz already exists
            if self.questions.count() != 10:
                raise ValidationError("Each quiz must have exactly 10 questions.")


