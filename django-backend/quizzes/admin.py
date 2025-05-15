from django.contrib import admin

from .models import Quiz, Question, QuizQuestion

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "short_text", "used_in_quizzes", "correct_answer_preview")
    search_fields = ("text",)
    readonly_fields = ("correct_answer_preview",)

    fieldsets = (
        (None, {
            "fields": ("text", "explanation", "options", "correct_index", "correct_answer_preview")
        }),
    )

    def short_text(self, obj):
        return obj.text[:60] + ("..." if len(obj.text) > 60 else "")
    short_text.short_description = "Question"

    def used_in_quizzes(self, obj):
        return obj.quizzes.count()
    used_in_quizzes.short_description = "Used In Quizzes"

    def correct_answer_preview(self, obj):
        return obj.get_correct_option() or "⚠️ Invalid index"
    correct_answer_preview.short_description = "Correct Answer"




class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 10
    min_num = 10
    max_num = 10
    ordering = ("order",)
    verbose_name = "Quiz Question"
    verbose_name_plural = "Quiz Questions"


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "difficulty", "question_count", "created_at")
    list_filter = ("category", "difficulty")
    search_fields = ("title", "category")
    inlines = [QuizQuestionInline]

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        quiz = form.instance
        if quiz.questions.count() != 10:
            from django.core.exceptions import ValidationError
            raise ValidationError("A quiz must have exactly 10 questions.")

