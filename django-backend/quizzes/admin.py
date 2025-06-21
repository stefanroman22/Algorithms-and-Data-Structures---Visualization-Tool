from django.contrib import admin
from django.utils.html import format_html
from .models import Quiz, Question, QuizQuestion

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "short_text", "used_in_quizzes", "correct_answer_preview", "has_image")
    search_fields = ("text",)
    readonly_fields = ("correct_answer_preview", "image_preview")

    fieldsets = (
        (None, {
            "fields": (
                "text",
                "image",          # Upload field
                "image_preview",  # Read-only preview
                "explanation",
                "options",
                "correct_index",
                "correct_answer_preview",
            )
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

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="200" style="border:1px solid #ccc;" />', obj.image.url)
        return "No image"
    image_preview.short_description = "Image Preview"

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Has Image"

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

   

