/**
 * onion Common
 */
//常用公共JS工具
var msonionUrl, msPicPath = "http://img.51msyc.com/",
    mspaths, jems = {}, shopUrl = "m.msyc.cc|www.2beauti.com|onion.2beauti.com|m.2beauti.com";
var $Q = function (selector,content) {
    content = content || document;
    return selector.nodeType ? selector : content.querySelector(selector);
},$QS = function (selector,content) {
    content = content || document;
    return selector.nodeType ? selector : content.querySelectorAll(selector);
};
jems.ready = function(callback){
    if (/complete|loaded|interactive/.test(document.readyState) && document.body){
        callback && callback();
    }else{
        document.addEventListener('DOMContentLoaded', function(){callback() }, false);
    }
};

if (new RegExp(shopUrl).test(window.location.host)){
    msonionUrl = "//"+window.location.host+"/";
}else {
    msonionUrl = "//"+window.location.host+"/msonion-web/";
}
var moblieReg =/^((\(\d{3}\))|(\d{3}\-))?1(3|4|5|7|8)\d{9}$/,
    allChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    nameReg= /^[\u4E00-\u9FA5]{1,8}(?:·[\u4E00-\u9FA5]{1,8})*$/,//包括少数民族名字
    expNo = "0063de3bd93e6afb188a78c012c7bbf3";//"218a686e05c8f3506ee642e53355fea7";//快递单号

var groupStatType = ["支付超时","拼团失败","待付款","拼团中","尾款支付中","待发货"];//团购订单状态显示
var cartoedertip = "温馨提示：欲望圣诞活动（12.6-12.12）期间，如发货包裹内有预售商品，则此包裹的延误险计算将以预售商品发货日开始计算，请知悉哦。感谢您对洋葱的支持！";

jems.ready(function () {

});
jems.isMobile = function () {
    var navMatch = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|JUC|WebOS|Windows Phone)/i;
    return navigator.userAgent.match(navMatch) ? true : false;
};
/**
 * 判断是微信APP还是洋葱APP
 * @num {Number} 1表示洋葱APP，0表示微信APP
 * @returns {Boolean}
 */
jems.isWxOnion = function (num) {
    var nav = navigator.userAgent.toLowerCase();
    if (num == 1){
        return (nav.match(/OnionAppClient/i) == "onionappclient") ? true : false;
    }else {
        return (nav.match(/MicroMessenger/i) == "micromessenger") ? true : false;
    }
};
//通用超链接跳转
jems.goUrl = function(url){
    var ParHref = jems.parsURL().params;
    var tmn = ParHref.tmn, urlTmn = url.indexOf('tmn');
    if(tmn != "undefined" || tmn != "") {
        if(urlTmn == -1){
            url = url.indexOf("?") != -1 ? url+"&tmn="+tmn : url+"?tmn="+tmn;
        }else{
            url = url;
        }
    }
    window.location.href = url;
};
//通用跳转商品详情超链接
jems.goShow = function (ycid) {
    jems.goUrl(msonionUrl+"wx/goods-details.html?id="+ycid);
};
//跳转到商城首页
jems.goShop = function(){
    jems.goUrl(msonionUrl+"wx/indexView");
};
//跳转到搜索
jems.goSearch = function () {
    jems.goUrl(msonionUrl+"wx/search-page.html");
};
//跳转到分类
jems.goCategory = function () {
    jems.goUrl(msonionUrl+"wx/search-goods.html");
};
//跳转到杂志首页
jems.goMagazine = function(){
    //jems.goUrl(msonionUrl+"wx/magazineView?type=1&pageNo=1");
    jems.goUrl(msonionUrl+"wx/finds.html");
};
//返回上一页面并涮新
jems.goBack = function(){
    if (window.history.length > 1) {
        window.history.go(-1);
        return true;
    }
    return false;
};
/*
 解析URL地址
 jems.parsURL( url ).file;     // = 'index.html'
 jems.parsURL( url ).hash;     // = 'top'
 jems.parsURL( url ).host;     // = 'www.abc.com'
 jems.parsURL( url ).query;    // = '?id=255&m=hello'
 jems.parsURL( url ).queryURL  // = 'id=255&m=hello'
 jems.parsURL( url ).params;   // = Object = { id: 255, m: hello }
 jems.parsURL( url ).prefix;   // = 'www'
 jems.parsURL( url ).path;     // = '/dir/index.html'
 jems.parsURL( url ).segments; // = Array = ['dir', 'index.html']
 jems.parsURL( url ).port;     // = '8080'
 jems.parsURL( url ).protocol; // = 'http'
 jems.parsURL( url ).source;   // = 'http://www.abc.com:8080/dir/index.html?id=255&m=hello#top'
 */
jems.parsURL = function ( url ) {
    url = arguments[0] == undefined ? window.location.href : url;
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},seg = a.search.replace(/\?/,'').split('&'),len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                var isw = /\?/.test(s[0]) ? s[0].split("?")[1] : s[0];
                ret[isw] = s[1];
            }
            return ret;
        })(),
        prefix: a.hostname.split('.')[0],
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/'),
        queryURL:a.search.replace(/^\?/,''),
    };
};
/**
 * 保留符点数后几位，默认保留一位
 * @param num 要格式化的数字
 * @param pos 要保留的位数,不传默认保留两位
 * @returns
 */
jems.formatNum = function (num,pos){
    // 默认保留一位
    pos = pos ? pos : 2;
    // 四舍五入
    var pnum = Math.round(num*Math.pow(10,pos))/Math.pow(10,pos), snum = pnum.toString(), len = snum.indexOf('.');
    // 如果是整数，小数点位置为-1
    if(len<0){
        len = snum.length;
        snum += '.';
    }
    // 不足位数以零填充
    while(snum.length<=len+pos){
        snum += '0';
    }
    return snum;
};

jems.fixMenu = function () {
    var menuli = "<nav class='leftMenu'>"+
        "<ul class='hide'>"+
        "<li class='imgclass rdu psdimg' onclick='jems.goShop()'></li>"+
        "<li class='imgclass rdu serimg' onclick='jems.goSearch()'></li>" +
        "<li class='imgclass rdu cartimg jepor' onclick='jems.myShopCart()'><span class='cartname fixcartNum f12' style='display:none;'>0</span></li>"+
        "<li class='imgclass rdu clsimg' onclick='jems.goCategory()'></li>" +
        "<li class='imgclass rdu mbimg' onclick='jems.myAccount()'></li>" +
        "</ul><div class='menumores rdu'></div>" +
        "</nav>"+
        "<div class='blackmask hide'></div>";

    document.body.insertAdjacentHTML("beforeend",menuli);
    $Q(".menumores").addEventListener("click", function () {
        var mthat = this,mul = $Q("ul",mthat.parentNode);
        if (mul.classList.contains("hide")){
            mthat.classList.add("mshow");
            mul.classList.add("show");
            mul.classList.remove("hide");
            $Q(".blackmask").style.display = "block";
        }else{
            mthat.classList.remove("mshow");
            mul.classList.remove("show");
            mul.classList.add("hide");
            $Q(".blackmask").style.display = "none";
        }
    });
    jems.showCartNum();
};

