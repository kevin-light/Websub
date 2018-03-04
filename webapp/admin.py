from django.contrib import admin
from webapp import models

class CommentAdmin(admin.ModelAdmin):
    list_display = ("id",'content','username','news','create_time','parent')
    list_filter = ("id",'content','username')

admin.site.register(models.Comment,CommentAdmin)
admin.site.register(models.News)
admin.site.register(models.User)