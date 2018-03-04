from django.shortcuts import render, HttpResponse
from django.http import Http404
from webapp import models
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from Websub import settings


def home(request):

    # a = 1
    # while a < 500:
    #     print('News' + '(''title=' + '"新闻标题:{}"'.format(a), ',' 'content=' + '"新闻内容:{}"'.format(a) + '),')
    #
    #     models.News.objects.bulk_create([
    #         News(title="新闻标题:{}".format(a),content="新闻内容:{}".format(a))
    #     ])
    #
    #     a += 1

    news_obj = models.News.objects.all().order_by("-id")
    comment_obj = models.Comment.objects.all()

    paginator = Paginator(news_obj, settings.PER_PAGE)
    page = request.GET.get('page')
    try:
        contacts = paginator.page(page)
    except PageNotAnInteger:
        contacts = paginator.page(1)
    except EmptyPage:
        contacts = paginator.page(paginator.num_pages)

    return render(request, 'home.html', {'news_obj':news_obj,
                                       'comment_obj':comment_obj,
                                         'queryset':contacts})

def news_detail(request,newsId):
    news_detail_obj = models.News.objects.filter(id=newsId)

    news_id_after = models.News.objects.filter(id=int(newsId)+1)
    news_id_before = models.News.objects.filter(id=int(newsId)-1)

    if request.method == "POST":
        comm_content = request.POST.get("comments")
        models.Comment.objects.create(news_id=newsId,content=comm_content)

    comment_list=models.Comment.objects.filter(news_id=newsId).values('id','content','parent','username')
    comment_tree = []
    comment_list_dict = {}
    for row in comment_list:
        row.update({'children': []})
        comment_list_dict[row['id']] = row
    for item in comment_list:
        parent_row = comment_list_dict.get(item['parent'])
        if not parent_row:
            comment_tree.append(item)
        else:
            parent_row['children'].append(item)

    return render(request,'news_detail.html',{"news_detail_obj":news_detail_obj,
                                              'news_id_after':news_id_after,
                                              'news_id_before':news_id_before,
                                              'comment_tree': comment_tree
                                              })

def news(request):
    news_obj = models.News.objects.all().order_by("-id")
    comment_obj = models.Comment.objects.all()

    paginator = Paginator(news_obj, settings.PER_PAGE)
    page = request.GET.get('page')
    try:
        contacts = paginator.page(page)
    except PageNotAnInteger:
        contacts = paginator.page(1)
    except EmptyPage:
        contacts = paginator.page(paginator.num_pages)

    return render(request, 'news.html', {'news_obj':news_obj,
                                       'comment_obj':comment_obj,
                                         'queryset':contacts})



