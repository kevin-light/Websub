/**
 * Created by zhangyw on 2016/6/27.
 */

var homePageViewModel = function() {
    var self = this;
    self.isOldBrower = ko.observable(false);
    if(!productConfig._isSupports_canvas()){
    
        self.isOldBrower(true);
    }


    self.addOptionsView = function(data){
        return "—" + "\t" + data +"\t" + "—";
    };
        self.parseOptionsView = function(data){
            var redata;
            if(typeof(data) === "string"){
               redata=  data.split("—");
            }else{
                redata=  data[0].split("—");
            }

            return $.trim(redata[1]);
        };

    var products = []
    for(var i=0; i<productConfig._productids.length; i++) {
       products.push(self.addOptionsView( productConfig._productids[i] ));
    }
    self.selectProduct = ko.observable(self.addOptionsView("IF"));
    self.productid = ko.observableArray(products);

    self.selectInstrument = ko.observable();
    self.instrumentids = ko.observableArray();


    self.delayProData = ko.observableArray();
    self.chart ={};


    self.delayDate = ko.observable();
    calMainDelayDatas = function(response, product){
        var getdatas = response.split('\n');
        var datas = [];
        for(var i=1; i<getdatas.length; i++){
            var rowsdatas = getdatas[i].split(',');
            if(rowsdatas.length ==12){
                var instrData = {};
                instrData["productid"] =  product;
                instrData["instrumentid"] = $.trim(rowsdatas[0]);
                 instrData["openprice"] = Number($.trim(rowsdatas[1]))<=0 ? "--": $.trim(rowsdatas[1]);
                 instrData["highestprice"] = Number($.trim(rowsdatas[2]))<=0 ? "--":$.trim(rowsdatas[2]);
                 instrData["lowestprice"] = Number($.trim(rowsdatas[3]))<=0 ? "--":$.trim(rowsdatas[3]);
                 instrData["lastprice"] = Number($.trim(rowsdatas[4]))<=0 ? "--":$.trim(rowsdatas[4]);
                 instrData["updown"] = $.trim(rowsdatas[5]);
                 instrData["bprice"] = Number($.trim(rowsdatas[6]))<=0 ? "--":$.trim(rowsdatas[6]);
                 instrData["bamount"] = $.trim(rowsdatas[7]);
                 instrData["sprice"] = Number($.trim(rowsdatas[8]))<=0? "--":$.trim(rowsdatas[8]);
                instrData["samount"] = $.trim(rowsdatas[9]);
                instrData["volumn"] = $.trim(rowsdatas[10]);
                instrData["oi"] = $.trim(rowsdatas[11]);

                if(Number(instrData["updown"]) <0){
                    instrData["updown"] = "↓" + Math.abs(instrData["updown"]);
                    instrData["color"] = "color_green";
                }else{
                    instrData["updown"] = "↑" + instrData["updown"];
                    instrData["color"] = "color_red";
                }
                datas.push(instrData);
            }
        }
        datas.sort(function(a,b){
            var oi = Number(a["oi"]) - Number(b["oi"]);
            var volumn = Number(a["volumn"]) - Number(b["volumn"]);
            if(oi >0 ){
                return -1;
            }else if(oi < 0){
                return 1;
            }else {
                if(volumn >0 ){
                    return -1;
                }else if(volumn < 0){
                    return 1;
                }else {
                         if(a["instrumentid"] >b["instrumentid"] ){
                             return 1;
                         }else{
                             return -1;
                         }
                }
            }
        });
        return datas[0];
    },



    self.getMainData = function($entity, $event){
       var promise = [];
        self.delayProData([]);
       for(var i=0; i<productConfig._productids.length; i++){
         //  promise.push($.ajax("../data/quote_"+ productConfig._productids[i] +".txt"))
		   promise.push($.ajax("/quote_"+ productConfig._productids[i] +".txt"));
       }
        if(typeof $event == "object"){
            $($event.currentTarget).addClass("action").siblings("li").removeClass("action");
            selectproduct =  $.trim($($event.currentTarget).attr("name"));
        }

        $.when.apply(this, promise).then(function(response){
            var numb =0;
            var maindatas= [];
            for(var i=0; i<productConfig._productids.length; i++){
                if(arguments[numb][1] == "success"){
                  maindatas.push(calMainDelayDatas( arguments[numb][0], productConfig._productids[i]));
                   self.delayProData().push(maindatas);
                }
                numb++;
            }
            self.delayProData(maindatas);
				if( productConfig._isSupports_canvas() == false){
					 $(".jriea").css("width","80px");
					 $(".jrieb").css("width","105px");
                     $(".jriec").css("width","98px");
                     $(".jried").css("width","90px");
       
				}
        }).fail(function(){console.log("request main datas error")});


    },



    self.getDelayProData = function($entity, $event){
        selectproduct= $.trim( $($event.target).attr("name") );



        $.ajax({
            async: true,
            dataType: "text",
                 url: "/quote_"+ selectproduct +".txt",
        //    url: "../data/quote_"+ selectproduct +".txt",
            method: 'GET',

            success: function (response) {
                var getdatas = response.split('\n');
                var datas = [];
                for(var i=1; i<getdatas.length; i++){
                    var rowsdatas = getdatas[i].split(',');
                    if(rowsdatas.length ==12){
                        var instrData = {};
                        instrData["productid"] =  selectproduct;
                        instrData["instrumentid"] = $.trim(rowsdatas[0]);
                        instrData["openprice"] = Number($.trim(rowsdatas[1]))<=0 ? "--": $.trim(rowsdatas[1]);
						instrData["highestprice"] = Number($.trim(rowsdatas[2]))<=0 ? "--":$.trim(rowsdatas[2]);
						instrData["lowestprice"] = Number($.trim(rowsdatas[3]))<=0 ? "--":$.trim(rowsdatas[3]);
						instrData["lastprice"] = Number($.trim(rowsdatas[4]))<=0 ? "--":$.trim(rowsdatas[4]);
						instrData["updown"] = $.trim(rowsdatas[5]);
						instrData["bprice"] = Number($.trim(rowsdatas[6]))<=0 ? "--":$.trim(rowsdatas[6]);
						instrData["bamount"] = $.trim(rowsdatas[7]);
						instrData["sprice"] = Number($.trim(rowsdatas[8]))<=0? "--":$.trim(rowsdatas[8]);
                        instrData["samount"] = $.trim(rowsdatas[9]);
                        instrData["volumn"] = $.trim(rowsdatas[10]);
                        instrData["oi"] = $.trim(rowsdatas[11]);

                        if(Number(instrData["updown"]) <0){
                            instrData["updown"] = "↓" + Math.abs(instrData["updown"]);
                            instrData["color"] = "color_green";
                        }else{
                            instrData["updown"] = "↑" + instrData["updown"];
                            instrData["color"] = "color_red";
                        }
                        datas.push(instrData);
                    }

                }
                self.delayProData(datas);
            },
            complete: function (response) {
                $("#delayTableBody").find("tr:first").find(".last_td").click();
				if( productConfig._isSupports_canvas() == false){
					 $(".jriea").css("width","80px");
					 $(".jrieb").css("width","105px");
                     $(".jriec").css("width","98px");
                     $(".jried").css("width","90px");
       
				}
            }
        });
    };

    self.productChange= function($entity, $event){

        $.ajax({
            async: true,
            dataType: "text",
                url: "/quote_"+  self.parseOptionsView( self.selectProduct()) +".txt",
         //   url: "../data/quote_"+ self.parseOptionsView( self.selectProduct()) +".txt",
            method: 'GET',

            success: function (response) {
                var getdatas = response.split('\n');
                var datas = [];
                for(var i=1; i<getdatas.length; i++){
                    var rowsdatas = getdatas[i].split(',');
                    if(rowsdatas.length ==12){
                        var instrData = {};

                        instrData["instrumentid"] = $.trim(rowsdatas[0]);

                        datas.push( self.addOptionsView(instrData["instrumentid"]));
                    }

                }
                self.instrumentids(datas);
            },
            complete: function (response) {

            }
        });
    };

    self.instrumentChange = function(){
        var priceChartId = "priceChart";
        if(!self.isOldBrower()){
            self.chart = new BaseGraphs(productChartConfig[self.parseOptionsView(self.selectProduct())],
                self.parseOptionsView(self.selectInstrument()), priceChartId);
            var promise = self.chart.showGraphs({ "withVolumn":false });
			promise.done(function(response){
			   self.delayDate( self.chart.tradingday.substr(0,4) + "年"
                + self.chart.tradingday.substr(5,2) + "月"
                + self.chart.tradingday.substr(8,2) + "日");
			})
         
        }
    }
}

if($(window).width() < 767){
    Dygraph.prototype.createDragInterface_ =  function(){};
}



var main = new homePageViewModel()
ko.applyBindings(main);
main.getMainData();
main.productChange();
$(".time_delay").find(".select1").find("option")[0].selected= true;