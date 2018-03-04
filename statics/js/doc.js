/**
 * Created by zhangyw on 2016/6/7.
 */

$(document).ready( function () {
    var PageSort = function() {
        var self = this;
        self.page = ko.observableArray();
        self.preHref=ko.observable("#");
        self.nextHref=ko.observable("#");
        self.setPage = function(){
            var recordCount = Number($("#page").attr("record_count"));
            var pageCount = Number($("#page").attr("page_count"));
            var pageIndex = Number($("#page").attr("page_index")) +1;
            var pageName = $("#page").attr("page_name");
            var pageExt = $("#page").attr("page_ext");

            var flag = 0;
            var isShowPre = false;
            var isShowNext = false;

            if(pageCount<8){
                flag = 0;
            }
            else{
                isShowPre = pageIndex-2 >2 ? true:false;
                isShowNext = pageIndex+2<pageCount-1? true:false;
                if(isShowPre && !isShowNext ){   //当前页不靠近第一页
                    flag =1;
                }else if(!isShowPre && isShowNext){  //当前页不靠近最后一页
                    flag =2;
                }else if(isShowPre && isShowNext){   //两头都不靠近
                    flag =3;
                }
            }


            var pageArray = []
            switch(flag){
                case 0:
                    for(var i=1; i<=pageCount; i++){
                        var nameNumb = i==1  ? "" : "_"+(i-1);
                        var pageData ={
                            "href": "./" + pageName  +nameNumb + "." +pageExt,
                            "numb" : i
                        }
                        pageArray.push(pageData)
                    }
                    break;
                case 1:
                    //第一页
                    pageArray.push({
                        "href": "./" + pageName + "." +pageExt,
                        "numb" : 1,
                        "class" : 0==pageIndex? "action": ""
                    });
                    for(var i=pageCount-6; i<= pageCount; i++){
                        var nameNumb =  i-1;
                        var pageData ={
                            "href": "./" + pageName +"_" +nameNumb + "." +pageExt,
                            "numb" : i,
                            "class" : i==pageIndex? "action": ""
                        }
                        pageArray.push(pageData)
                    }
                    break;
                case 2:
                    //第一页
                    pageArray.push({
                        "href": "./" + pageName + "." +pageExt,
                        "numb" : 1,
                        "class" : 0==pageIndex? "action": ""
                    });
                    for(var i=2; i<=6 ; i++){
                        var nameNumb =  i-1;
                        var pageData ={
                            "href": "./" + pageName +"_" +nameNumb + "." +pageExt,
                            "numb" : i,
                            "class" : i==pageIndex? "action": ""
                        }
                        pageArray.push(pageData)
                    }
                    //最后一页
                    pageArray.push({
                        "href": "./" + pageName + "_"+ (pageCount-1) + "." +pageExt,
                        "numb" : pageCount,
                        "class" : pageCount==pageIndex? "action": ""
                    })
                    break;
                case 3:

                    //第一页
                    pageArray.push({
                        "href": "./" + pageName + "." +pageExt,
                        "numb" : 1,
                        "class" : 0==pageIndex? "action": ""
                    });
                    for(var i=pageIndex-2; i<=pageIndex+2 ; i++){
                        var nameNumb =  i-1;
                        var pageData ={
                            "href": "./" + pageName +"_" +nameNumb + "." +pageExt,
                            "numb" : i,
                            "class" : i==pageIndex? "action": ""
                        }
                        pageArray.push(pageData)
                    }
                    //最后一页
                    pageArray.push({
                        "href": "./" + pageName + "_"+ (pageCount-1) + "." +pageExt,
                        "numb" : pageCount,
                        "class" : pageCount==pageIndex? "action": ""
                    })
                    break;
            }

            self.page(pageArray);

            if(isShowNext){
                $("#page").find("a").eq(6).after("<span>...</span>");
            }
            if(isShowPre){
                $("#page").find("a").eq(1).after("<span>...</span>");
                $("#page").find("a").each(function(){
                    if(this.innerText ==pageIndex+""){
                        $(this).attr("class", "action");
                    } ;

                });
            }else{
                $("#page").find("a").eq(pageIndex).attr("class", "action");
            }

            if(pageIndex<=1){
                self.preHref("#");
            }else if(pageIndex ==2){
                self.preHref( "./"+pageName+"."+pageExt);
            }else{
                self.preHref("./" + pageName +"_" + (pageIndex-2) + "." +pageExt);
            }

            if( (pageCount==1) || (pageCount==pageIndex)){
                self.nextHref("#");
            }else{
                self.nextHref("./" + pageName +"_" + (pageIndex) + "." +pageExt);
            }
        };

        self.beforeDetailTitle = ko.observable();
        self.beforeDetailHref = ko.observable();
        self.afterDetailTitle = ko.observable();
        self.afterDetailHref = ko.observable();
        self.setDetailPageSort = function () {
            var beforeDocTitle = "";
            var afterDocTitle = "";
            var beforeDocHref= "#";
            var afterDocHref = "#";
            var docID = $("#docdetailid").attr("name");
            $.ajax({
                dataType: "xml",
                url: "../index_6745.xml",
                success: function (xml) {
                    var _count = 0;
                    $(xml).find("DOCUMENTS").each(function () {
                        var $doc = $(this);
                        if (_count == 1) {
                            //当为1的时候表示上次找到了对应的DOCID
                            _count++;
                            afterDocTitle = $doc.find("DOCTITLE").text();
                            afterDocHref = $doc.find("DOCHREF").text();
                        } else if (_count == 0) {
                            var _docID = $doc.find("DOCID").text();
                            if (docID == _docID) {
                                _count++;
                            } else {
                                beforeDocTitle = $doc.find("DOCTITLE").text();
                                beforeDocHref = $doc.find("DOCHREF").text();
                            }
                        }
                    });
                    if (beforeDocTitle == "") {
                        beforeDocTitle = "当前文章为第一篇";
                    }
                    if (afterDocTitle == "") {
                        afterDocTitle = "当前文章为最后一篇";
                    }

                    self.beforeDetailTitle(beforeDocTitle);
                    self.beforeDetailHref(beforeDocHref);
                    self.afterDetailTitle(afterDocTitle);
                    self.afterDetailHref(afterDocHref);
                }
            });
        };


        self.clearHtml=function(){
            var  formatSrc = $.htmlClean($("#doccontent").html(), {
                removeTags: ["basefont", "center", "dir", "font", "frame", "frameset",
                    "iframe", "isindex", "menu", "noframes", "s", "strike", "u", "div", "span"],
                format: false
            });
            $("#doccontent").html(formatSrc);
        }
    }




    var main = new PageSort();

    ko.applyBindings(main);

    if($("#page").length>0){
        main.setPage();
    }

    if($("#docdetailid").length>0){
        main.setDetailPageSort();
    }
    if($("#doccontent").length>0){
//    main.clearHtml();
    }
});


