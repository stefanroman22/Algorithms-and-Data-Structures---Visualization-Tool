from django.contrib import admin
from django.db.models import Sum
from django.template.response import TemplateResponse
from .models import ContactFeedback

@admin.register(ContactFeedback)
class ContactFeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'likes', 'dislikes')

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(request, extra_context=extra_context)

        try:
            queryset = response.context_data['cl'].queryset
            totals = queryset.aggregate(
                total_likes=Sum('likes'),
                total_dislikes=Sum('dislikes'),
            )
            response.context_data['total_likes'] = totals['total_likes'] or 0
            response.context_data['total_dislikes'] = totals['total_dislikes'] or 0
        except (AttributeError, KeyError):
            pass

        return response
