/**
 * Created by programmer on 2016/6/4.
 */


var productConfig ={
    _productids :["IF","IC", "IH","TF","T"],
    _checkProduct : function(instrumentid , selectProduct) {

        var numb =  instrumentid.substr(selectProduct.length , 4);
        var regInstrument = new RegExp(/^\d{4}$/);    //合约校验
        if (instrumentid.substr(0,selectProduct.length) == selectProduct && regInstrument.test(numb)) {
            return true;
        }
        return false
    },
    ProConfig : {
        "IF" : {isTreasure:false ,
        isShowCheck:true},
        "IC" : {isTreasure:false,
            isShowCheck:false},
        "IH" : {isTreasure:false,
        isShowCheck:false},
        "TF" : {isTreasure:true,
        isShowCheck:false},
        "T"  : {isTreasure:true,
        isShowCheck:false}
    },
    _formatPrice : function(productid, prop ){
        var formatConfig= {
            "IF" : {"price" : 1 , "settlementPrice" :2},
            "IC" : {"price" : 1 , "settlementPrice" :2},
            "IH": {"price" : 1, "settlementPrice" :2},
            "TF" : {"price" : 3 ,"settlementPrice" :3},
            "T" : {"price" : 3 ,"settlementPrice" :3}
        };
        return formatConfig[productid][prop];
    },
    _parseDate : function(date){
        var temp = date.split('-');
        var returnDate = temp[0] + temp[1] +"/" + temp[2];
        return returnDate;
    },
    _positionRankSort : function(a,b) {
        return Number(a.rank) - Number(b.rank)
    },

    _isSupports_canvas:function () {
        return !!document.createElement('canvas').getContext;
    }
}