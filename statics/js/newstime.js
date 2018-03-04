/**
 * Created by wangwei3 on 2016/6/24.
 */

$(document).ready( function () {
    var isNew = function (timetext) {
        var comparetime = new Date(timetext.replace(/-/g,"/"));
        var nowtime = new Date();

        var dayconfig = 3;

        var difference = nowtime.getTime() - comparetime.getTime();
        var differenceDay = parseInt(difference/(1000*60*60*24));
        if (differenceDay < dayconfig) {
            return true;
        }
        return false;
    };

    var timeSpans =  $(this).find(".comparetime");
    for(var i=0; i<timeSpans.length; i++) {
        var timea = timeSpans[i];
        var timetext = timea.innerText;
        if (isNew(timetext)) {
            $(timea).before("<img src='/images/index-trends-bg2.png'>");
        }
    }

    //移除收条展开中的不必要换行。
    var topContent =  $(this).find(".jysdt-listnr");
    topContent.find("br").remove();
});
