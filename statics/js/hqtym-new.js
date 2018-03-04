/**
 * Created by zhangyw on 2016-5-25.
 */
var productChartConfig = {
    "IF":{
        "timeLineAm1" :"10:30:00",
        "timeLinePm1" :"14:00:00",
        "timeLineAm2" :"9:30:00",
        "timeLinePm2" :"15:00:00",
        "timeStartShow" :"09:30",
        "timeEndShow" :"15:00",
        "timeStart": "9:30:00",
        "timeNoonClose" : "11:30:00",
        "timeEnd" : "15:00:00",
        "dataFormat" : 2,
        "durationNoonClose" : 5400*1000,
        "dataTable" : "quote_IF.txt",
        "isShowSpot": true
    },
    "TF":{
        "timeLineAm1" :"10:30:00",
        "timeLinePm1" :"14:00:00",
        "timeLineAm2" :"9:30:00",
        "timeLinePm2" :"15:00:00",
        "timeStartShow" :"09:15",
        "timeEndShow" :"15:15",
        "timeStart": "9:15:00",
        "timeNoonClose" : "11:30:00",
        "timeEnd" : "15:15:00",
        "dataFormat" : 3,
        "durationNoonClose" : 5400*1000,
        "dataTable" : "quote_TF.txt",
        "isShowSpot" : false
    },
    "T":{
        "timeLineAm1" :"10:30:00",
        "timeLinePm1" :"14:00:00",
        "timeLineAm2" :"9:30:00",
        "timeLinePm2" :"15:00:00",
        "timeStartShow" :"09:15",
        "timeEndShow" :"15:15",
        "timeStart": "9:15:00",
        "timeNoonClose" : "11:30:00",
        "timeEnd" : "15:15:00",
        "dataFormat" : 3,
        "durationNoonClose" : 5400*1000,
        "dataTable" : "quote_T.txt",
        "isShowSpot" : false
    },
    "IC":{
        "timeLineAm1" :"10:30:00",
        "timeLinePm1" :"14:00:00",
        "timeLineAm2" :"9:30:00",
        "timeLinePm2" :"15:00:00",
        "timeStartShow" :"09:30",
        "timeEndShow" :"15:00",
        "timeStart": "9:30:00",
        "timeNoonClose" : "11:30:00",
        "timeEnd" : "15:00:00",
        "dataFormat" : 2,
        "durationNoonClose" : 5400*1000,
        "dataTable" : "quote_IC.txt",
         "isShowSpot" : false
    },
    "IH":{
        "timeLineAm1" :"10:30:00",
        "timeLinePm1" :"14:00:00",
        "timeLineAm2" :"9:30:00",
        "timeLinePm2" :"15:00:00",
        "timeStartShow" :"09:30",
        "timeEndShow" :"15:00",
        "timeStart": "9:30:00",
        "timeNoonClose" : "11:30:00",
        "timeEnd" : "15:00:00",
        "dataFormat" : 2,
        "durationNoonClose" : 5400*1000,
        "dataTable" : "quote_IH.txt",
        "isShowSpot" : false
    }
}

var thisInstrumentTime={
    "timeLineAm1" :"",
    "timeLinePm1" :"",
    "timeLineAm2" :"",
    "timeLinePm2" :"",
    "timeStartShow" :"",
    "timeEndShow" :"",
    "timeStart" :"",
    "timeEnd" :"",
    "timeNoonClose" :"",
    "durationNoonClose" : "",
    "dataFormat" : ""
}

var BaseGraphs=function(setData, instrumentid, chartid, volumnid){
    if(setData){
        this._$setConfig(setData);
    }
    this.instrumentid = instrumentid;
    this.chartid = chartid;
    this.volumnid =volumnid;
}
BaseGraphs.prototype = {
    _$config:{},
    _$setConfig: function(setData){
       $.extend(true, this._$config, setData);
    },
    "datas":"",
    "tradingday" :"",
    "instrumentid":"",
    "chartid" :"",
    "volumnid" :"",


    showGraphs: function(options){
      var mythis = this;
     var dataUrl =  "/yshqtz/hqtym/quoteDatas/" + this.instrumentid + "_price.txt" + "?t=" + new Date().getTime();                 //价格图数据获取地址
     //    var dataUrl =  "/sjfw-knockout/data/quoteDatas/" + this.instrumentid + "_price.txt" + "?t=" + new Date().getTime();
     return    $.ajax({
        async: true,
        dataType:"text",
        url: dataUrl ,
        success: function(data) {

            datas =data.split("\n");
            mythis.tradingday =  $.trim( datas[1].substr(0,10));
            thisInstrumentTime.timeStartShow = mythis._$config.timeStartShow;
            thisInstrumentTime.timeEndShow = mythis._$config.timeEndShow;
            thisInstrumentTime.timeLineAm1 = new Date( mythis.tradingday +" "+ mythis._$config.timeLineAm1);
            thisInstrumentTime.timeLinePm1 = new Date( mythis.tradingday +" "+ mythis._$config.timeLinePm1);
            thisInstrumentTime.timeLineAm2 = new Date( mythis.tradingday +" "+ mythis._$config.timeLineAm2);
            thisInstrumentTime.timeLinePm2 = new Date( mythis.tradingday +" "+ mythis._$config.timeLinePm2);
            thisInstrumentTime.timeStart = new Date( mythis.tradingday +" "+ mythis._$config.timeStart);   //当前交易日交易开始时间
            thisInstrumentTime.timeNoonClose = new Date( mythis.tradingday +" "+  mythis._$config.timeNoonClose);  //当前交易日交易中午休市时间
            thisInstrumentTime.timeEnd = new Date( mythis.tradingday +" "+ mythis._$config.timeEnd);    //当前交易日交易结束时间
            thisInstrumentTime.durationNoonClose = mythis._$config.durationNoonClose;
            thisInstrumentTime.dataFormat =mythis._$config.dataFormat;
            datas = mythis.filterDatas(datas);
            mythis.datas =datas.join('\n');
            if(options.withVolumn == false){
                mythis.createPriceGraphs();
            }else{
                mythis.createGraphs();
            }

        }
      });


    },
    filterDatas:function(datas){
        var rowdatas = datas;
        var finalDatas = [];
        var prevdatas =["", "", "", ""];
	//	finalDatas.push(rowdatas[0]);
        for(var idx = 1; idx<rowdatas.length; idx++){
            var processdatas = rowdatas[idx].split(',');
            if( new Date(processdatas[0]).getTime() >= thisInstrumentTime.timeStart.getTime() && new Date(processdatas[0]).getTime() <= thisInstrumentTime.timeEnd.getTime()){
                for( jdx = 1; jdx<processdatas.length; jdx++){
                    if(Number(processdatas[jdx]) < 0){
                        processdatas[jdx]=prevdatas[jdx];
                    }

                    prevdatas[jdx]= processdatas[jdx];
                }
                finalDatas.push(processdatas);

            }
        }

        while(finalDatas.length <2){   // 使用最后一个时间数据

            var tempData = rowdatas[1].split(',');
            tempData[0] = this.tradingday+"\t"+ this._$config.timeStart;
            tempData = tempData.toString();
            finalDatas.push(tempData );	
        }
        return finalDatas;
    },
    createGraphs: function ()     //创建dygraphs
    {

        $("#showSeries").html("");
        var self = this;
         this.priceGraphs = new Dygraph(                       //生成价格图
            document.getElementById(this.chartid),
            this.datas,
            {
                dateWindow: [thisInstrumentTime.timeStart.getTime(), thisInstrumentTime.timeEnd.getTime() - thisInstrumentTime.durationNoonClose],
                labels: this.showLabels(this._$config.isShowSpot),
                //  rollPeriod: 1,
                //	showRoller : true,
              legend: "always",
                colors: this.showColors(this._$config.isShowSpot),
                visibility: [true, false, true],
               xValueParser: this.dataRemoveAfternoon,
                labelsSeparateLines: true,
                labelsDiv : document.getElementById( this.instrumentid + "showPriceData"),
                   highlightCallback: function (e, x, pts, row) {
                    if (x != null) {
                        self.volumGraph.mouseMoveHandler_(e);
                    }
                },
                unhighlightCallback: function (e) {
                    if (e != null) {
                        self.volumGraph.mouseOut_();
                    }
                },
                gridLineColor:"#CCCCCC",
                axes: {
                    x: {

                        gridLineColor:"#CCCCCC",
                        axisLabelFormatter: this.axisLableRemoveAfternoon,
                        valueFormatter: this.valueFormatterRemoveAfternoon,
                        ticker: function(min, max, pixels) {
                            return [
                        //       { v: thisInstrumentTime.timeStart.getTime() },
                                { v: thisInstrumentTime.timeNoonClose.getTime() },
                                { v: thisInstrumentTime.timeEnd.getTime() - thisInstrumentTime.durationNoonClose - 60 * 1000},
                                { v: thisInstrumentTime.timeLineAm1.getTime() },
                                { v: thisInstrumentTime.timeLinePm1.getTime() - thisInstrumentTime.durationNoonClose },
                                { v: thisInstrumentTime.timeLineAm2.getTime() },
                                { v: thisInstrumentTime.timeLinePm2.getTime() - thisInstrumentTime.durationNoonClose },
                                {label_v:thisInstrumentTime.timeStart.getTime(),label:thisInstrumentTime.timeStartShow},
                                {label_v:thisInstrumentTime.timeNoonClose.getTime() - 3600*1000,label: '10:30'},
                                {label_v:thisInstrumentTime.timeNoonClose.getTime(),label: '11:30/13:00'},
                                {label_v:thisInstrumentTime.timeNoonClose.getTime() + 3600*1000,label: '14:00'},
                                {label_v:thisInstrumentTime.timeEnd.getTime() - thisInstrumentTime.durationNoonClose - 60 * 1000 ,label: thisInstrumentTime.timeEndShow}
                            ]
                        }
                    },
                    y: {

                        gridLineColor:"#CCCCCC",
                        valueFormatter: this.valueFormatterY
                    }
                }
            }
        );

         this.volumGraph = new Dygraph(                     //生成成交量图
            document.getElementById(this.volumnid),
            this.datas,
            {
                labels: this.showLabels(this._$config.isShowSpot),
                xValueParser: this.dataRemoveAfternoon,
       //         showRangeSelector: true,
                dateWindow: [thisInstrumentTime.timeStart.getTime(), thisInstrumentTime.timeEnd.getTime() - thisInstrumentTime.durationNoonClose],
                visibility: [false, true, false],
                colors: this.showColors(this._$config.isShowSpot),
                legend: "always",
                labelsSeparateLines: true,
                labelsDiv : document.getElementById( this.instrumentid + "showVolumnData"),
      /*          drawCallback: function (me, initial) {
                    if (initial) return;
                    var range = me.xAxisRange();
                    priceGraphs.updateOptions({
                        dateWindow: range
                    });
                },*/
                highlightCallback: function (e, x, pts, row) {
                    if (x != null) {
                        self.priceGraphs.mouseMoveHandler_(e);
                    }
                },
                unhighlightCallback: function (e) {
                    if (e != null) {
                        self.priceGraphs.mouseOut_();
                    }
                },
                gridLineColor:"#CCCCCC",
                axes: {
                    x: {
                        gridLineColor:"#CCCCCC",
                        axisLabelFormatter: this.axisLableRemoveAfternoon,
                        valueFormatter: this.valueFormatterRemoveAfternoon,
                        ticker: function(min, max, pixels) {
                        return [
                        //    { v: thisInstrumentTime.timeStart.getTime() },
                            { v: thisInstrumentTime.timeNoonClose.getTime() },
                            { v: thisInstrumentTime.timeEnd.getTime() - thisInstrumentTime.durationNoonClose - 60 * 1000 },
                            { v: thisInstrumentTime.timeLineAm1.getTime() },
                            { v: thisInstrumentTime.timeLinePm1.getTime() - thisInstrumentTime.durationNoonClose },
                            { v: thisInstrumentTime.timeLineAm2.getTime() },
                            { v: thisInstrumentTime.timeLinePm2.getTime() - thisInstrumentTime.durationNoonClose },
                            {label_v:thisInstrumentTime.timeStart.getTime(),label:thisInstrumentTime.timeStartShow},
                            {label_v:thisInstrumentTime.timeNoonClose.getTime() - 3600*1000,label: '10:30'},
                            {label_v:thisInstrumentTime.timeNoonClose.getTime(),label: '11:30/13:00'},
                            {label_v:thisInstrumentTime.timeNoonClose.getTime() + 3600*1000,label: '14:00'},
                            {label_v:thisInstrumentTime.timeEnd.getTime() - thisInstrumentTime.durationNoonClose - 60 * 1000,label: thisInstrumentTime.timeEndShow}

                        ]
                    }
                    }
                },

                plotter: this.barChartPlotter

            }
        );


    //    $("#legend").html($(".dygraph-legend"));
        var content = "<p><input type=checkbox id='0' checked onClick='change(this)'> <label for='0' style='color: rgb(0,128,0)'> 期货价格</label><br/><input type=checkbox id='2' checked onClick='change(this)'><label for='2' style='font-weight; bold;color: rgb(0,0,128)'>现货价格</label><br/></p>"
        $("#showSeries").append(content);      //现货加上checkRadio
        $("#showSeries").show();
    },

    createPriceGraphs:function ()     //创建dygraphs
    {
        $("#showSeries").html("");
        var self = this;
        this.priceGraphs = new Dygraph(                       //生成价格图
            document.getElementById(this.chartid),
            this.datas,
            {
                dateWindow: [thisInstrumentTime.timeStart.getTime(), thisInstrumentTime.timeEnd.getTime() - thisInstrumentTime.durationNoonClose],
                labels: this.showLabels(this._$config.isShowSpot),
                //  rollPeriod: 1,
                //	showRoller : true,
                legend: "always",
                labelsDiv : document.getElementById("legend"),
                colors: this.showColors(this._$config.isShowSpot),
                visibility: [true, false, true],
                xValueParser: this.dataRemoveAfternoon,
                labelsSeparateLines: false,
                gridLineColor:"#CCCCCC",
                axes: {
                    x: {
                        gridLineColor:"#CCCCCC",
                        axisLabelFormatter: this.axisLableRemoveAfternoon,
                        valueFormatter: this.valueFormatterRemoveAfternoon,
                        ticker: function(min, max, pixels) {
                            return [
                             //   { v: thisInstrumentTime.timeStart.getTime() },
                                { v: thisInstrumentTime.timeNoonClose.getTime() },
                                { v: thisInstrumentTime.timeEnd.getTime() - thisInstrumentTime.durationNoonClose - 60 * 1000 },
                                { v: thisInstrumentTime.timeLineAm1.getTime() },
                                { v: thisInstrumentTime.timeLinePm1.getTime()  - thisInstrumentTime.durationNoonClose},
                                { v: thisInstrumentTime.timeLineAm2.getTime() },
                                { v: thisInstrumentTime.timeLinePm2.getTime() - thisInstrumentTime.durationNoonClose },
                                {label_v:thisInstrumentTime.timeStart.getTime(),label:thisInstrumentTime.timeStartShow},
                                {label_v:thisInstrumentTime.timeNoonClose.getTime(),label: '11:30/13:00'},
                                {label_v:thisInstrumentTime.timeEnd.getTime() - thisInstrumentTime.durationNoonClose - 60 * 1000,label: thisInstrumentTime.timeEndShow}

                            ]
                        }
                    },
                    y: {
                        gridLineColor:"#CCCCCC",
                        valueFormatter: this.valueFormatterY
                    }
                }
            }
        );

    },
    axisLableRemoveAfternoon : function(d ,gran, opt)  //图像坐标轴去除中午休市数据
    {
        if(d.getTime() <= thisInstrumentTime.timeNoonClose.getTime())    //若数据时间是上午则正常返回
        {
            return Dygraph.dateAxisFormatter(new Date(d.getTime()) ,gran, opt);
        }
        else                                     //若数据时间是下午则减去中午休市时间
        {

            return Dygraph.dateAxisFormatter(new Date(d.getTime() + thisInstrumentTime.durationNoonClose) ,gran, opt);
        }
    },
    dataRemoveAfternoon:function(x){
        var time = new Date(x);     // 当前数据时间
        if (time.getTime() <= thisInstrumentTime.timeNoonClose.getTime() )    //若数据时间是上午则正常返回
        {
            return time .getTime() ;
        }
        else                             //若数据时间是下午则减去中午休市时间
        {
            var modifyTime =new Date(time .getTime() - thisInstrumentTime.durationNoonClose );
            return  modifyTime.getTime()  ;

        }
    },
    valueFormatterRemoveAfternoon: function(ms,gran, opt)     //图像显示数据去除中午休市数据
    {

    if( ms <=thisInstrumentTime.timeNoonClose.getTime() )               //若数据时间是上午则正常返回
    {
        var date = new Date(ms);
        var hour = date.getHours().toString() +"";
        var minute =date.getMinutes()+ "";
        return (hour[1]? hour:"0"+hour)+ ":" + (minute[1] ? minute: "0"+minute);
       // return Dygraph.dateAxisFormatter(new Date(ms),gran, opt);
    }
    else                                         //若数据时间是下午则减去中午休市时间
    {
        var date = new Date(ms + thisInstrumentTime.durationNoonClose);
        var hour = date.getHours().toString() +"";
        var minute =date.getMinutes()+ "";
        return (hour[1]? hour: "0"+hour)+ ":" + (minute[1] ? minute: "0"+minute);
       // return Dygraph.dateAxisFormatter(new Date(ms + thisInstrumentTime.durationNoonClose),gran, opt);
    }
   },
    valueFormatterY: function (y)     //FORMAT位数
   {
      return Number(y).toFixed(thisInstrumentTime.dataFormat);
   },
    barChartPlotter:function(e)      //生成柱状图
    {
        var  darkenColor=function(colorStr)
        {
        // Defined in dygraph-utils.js
            var color = Dygraph.toRGB_(colorStr);
            color.r = Math.floor((255 + color.r) / 2);
            color.g = Math.floor((255 + color.g) / 2);
            color.b = Math.floor((255 + color.b) / 2);
           return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
        };

        var ctx = e.drawingContext;
        var points = e.points;
        var y_bottom = e.dygraph.toDomYCoord(0);

        ctx.fillStyle =  darkenColor(e.color);

        // Find the minimum separation between x-values.
        // This determines the bar width.
        var min_sep = Infinity;

        for (var i = 1; i < points.length; i++)
        {
            var sep = points[i].canvasx - points[i - 1].canvasx;
            if (sep < min_sep) min_sep = sep;
        }

        var bar_width = Math.floor(2.0 / 3 * min_sep);
        if(bar_width<0)  //chrome bug
        {
            bar_width=0;
        }


        // Do the actual plotting.
        for (var i = 0; i < points.length; i++)
        {

            var p = points[i];
            var center_x = p.canvasx;

            if(p.canvasy > y_bottom){    //volume 校验
                p.canvasy = y_bottom;
                p.yval=0 ;
            }
            ctx.fillRect(center_x - bar_width / 2, p.canvasy,
                bar_width, y_bottom - p.canvasy);

            ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
                bar_width, y_bottom - p.canvasy);
        }
      },
    showLabels: function(isShowSpot){
        if(isShowSpot){
            return ["Date", "期货", "成交量", "现货"];
        }else{
            return ["Date", "期货", "成交量"];
        }
    },
    showColors: function(isShowSpot){
        if(isShowSpot){
            return ["#3f983f", "#3f983f", "#4191e6"];
        }else{
            return ["#3f983f", "#3f983f"];
        }
    }

};


