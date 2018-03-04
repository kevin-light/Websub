from django.db import models

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length=32,verbose_name='用户名')
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    class Meta:
        verbose_name_plural='用户表'

class News(models.Model):
    title = models.CharField(max_length=32,verbose_name='新闻标题')
    content = models.TextField(verbose_name='新闻内容')
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    class Meta:
        verbose_name_plural='新闻表'

class Comment(models.Model):
    content = models.TextField(verbose_name='评论内容')
    username = models.ForeignKey('User',default=1,null=True,blank=True)
    news = models.ForeignKey('News')
    parent = models.ForeignKey("self",related_name='o',null=True,blank=True)
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content
    class Meta:
        verbose_name_plural='评论表'
