/**
 @Js-name:goods-details.js
 @Zh-name:产品详情页JS函数
 @Author:chen guojun
 */
var ParHref = jems.parsURL(), menuId = 0, messageFlag = 0, tmn = "", gid = "";
$(function(){
    tmn=ParHref.params.tmn, gid = ParHref.params.id;
    var qrcode = new QRCode($("#qrCodebox")[0], {
        text : window.location.href,
        width : 160,
        height : 160
    });
    $('#erwmbox').on('click',function(){
        mBox.open({
            content:mBox.cell("#qrCodebox")
        });
    });
    //$("#goodsdetail").tabView();
    //获取当前详细页面的数据
    $.ajax({
        type : "get",
        url : msonionUrl+"product/goodsinfo?tmn="+tmn+"&gid="+gid,
        dataType : "json",
        success:function(data){
            // 存放分类id,供限购功能使用
            menuId = data.category.id;
            var picCell = $("#detailpic"), sale = data.saleState;
            if(data.qty <= 0){
                if (sale == 2||sale == 9){
                    picCell.addClass("soldout2");
                }else if (sale == 3||sale == 6||sale == 8){
                    picCell.addClass("soldout3");
                }else if (sale == 5||sale == 10){
                    picCell.addClass("soldout5");
                }else if (sale == 4){
                    picCell.addClass("soldout4");
                }else if (sale == 7){
                    picCell.addClass("soldout7");
                }else {
                    picCell.addClass("soldout1");
                }
            }else{
                if (sale == 6||sale == 8){
                    picCell.addClass("soldout3");
                }else if (sale == 5||sale == 10){
                    picCell.addClass("soldout5");
                }else if (sale == 7){
                    picCell.addClass("soldout7");
                }else if (sale == 4){
                    picCell.addClass("soldout4");
                }   
            }
            $('#detailtopPic').attr('src',msPicPath+data.goodsPics[0].picUrl+"?x-oss-process=image/resize,w_640");
            $("#godsAdv").html(data.salePoint);
            $("#godsenName").html(data.enName);
            $("#godsTit").html(data.name);
            $("#countryico").addClass(data.country.code);
            $("#countryname").html(data.country.name);
            $("#godcbTxt").html(data.saleGuide);
            if (data.saleRule != undefined){
                $("#saleRule").show().children().html(data.saleRule);
            }
            $("#freePrice").html("&yen;"+ jems.formatNum(data.freePrice));
            $("#marketPrice").html("&yen;"+ jems.formatNum(data.marketPrice));
            $("#le_editor").attr('src',msPicPath+'file/'+data.leEditor+'.jpg');
            $("#leedit").html(data.leEditor);
            
            if(data.videoUrl == undefined || data.videoUrl == ""){
                $("#movie").remove();
            }else{
                var videos = $("<video/>",{"webkit-playsinline":"true","playsinline":"true","x5-video-player-type":"h5","x5-video-player-fullscreen":"true","preload":"none","width":"100%","controls":"controls","poster":""});
                var source = $("<source/>",{"src":data.videoUrl,"type":"video/mp4"});
                $("#movie").append(videos.append(source));
            }
            
            var rets = data.proInfos;
            //抢货列表
            if(rets != "" && data.qty > 0 ) {
                var reHtml = '', relen = rets.length >= 3 ? 3 : rets.length;
                for (var i=0; i<relen; i++) {
                    reHtml += '<img class="mr8" src="'+msPicPath+rets[i].mainPicUrl+'?x-oss-process=image/resize,w_120">';
                }
                $("#magshuoluo").prepend(reHtml);
                jetpl("#godsrecomData").render(data, function(html){
                    $('#godsrecom').append(html);
                });
            }else{
                $("#showMore").parent().css({'display':'none'});
            }
            
            relatedProducts(data.proInfos.length);
            //商品介绍
            jetpl('#godsContextData').render(data, function(html){
                var fixtext = $('#godsConTxt').find(".fixtext");
                fixtext.append(html);
                if ($(".conmore").length>0) {
                    $(".conmore").on("click", function () {
                        if (fixtext.find("p.hide").css("display") == "none") {
                            fixtext.find("p.hide").css({"display": "block"});
                            $(this).addClass("open").find("span").text("收起");
                        } else {
                            fixtext.find("p.hide").css({"display": ""});
                            $(this).removeClass("open").find("span").text("展开");
                        }
                    })
                }
            });
            jetpl("#paramlistData").render(data, function(html){
                $('#godsConTxt').append(html);
            });
            //插入详情图片
            $('#godsConImg').append(data.goodsDesc.replace(/\.jpg/g,".jpg?x-oss-process=image/resize,w_640").replace(/\.png/g,".png?x-oss-process=image/resize,w_640"));

            //相似商品
            if (data.qty <= 0 && sale == 1) {
                if (data.proInfos1 != undefined && data.proInfos1.length > 0) {
                    jetpl("#godslistData").render(data, function (html) {
                        $('#godslist').append(html);
                        var parCell = $('#similar h3');
                        parCell.parent().css({width: IsPC() ? 640 : "100%", display: "block"}).addClass("openfix");
                        parCell.on("click", function () {
                            var thisCell = $(this).parent();
                            if (thisCell.hasClass("openfix")) {
                                thisCell.removeClass("openfix");
                            } else {
                                thisCell.addClass("openfix");
                            }
                        })
                    });
                }
            }
            var gobrand = $("#gobrand");
            gobrand.on("click",function () {
                jems.goUrl('goods-brandinfor.html?bid='+ data.brand.id);
            });
            gobrand.find(".brandpic").css({"background-image":"url("+msPicPath+data.brand.url+")"});
            gobrand.find(".brandname").text(data.brand.name);
            
            // 是否收藏效果判断
            var isAtten = data.isAtten;
            if(isAtten==0){
                $("#isAtten").find("em").removeClass("msfavorgray").addClass("msfavorpurple");
                $("#isAtten").find("span").text("已关注");
            }else{
                $("#isAtten").find("span").text("关注");
            }
            //点击收藏商品
            $("#isAtten").on('click', function(){
                addAtten(ParHref.params.tmn,ParHref.params.id);
            });
            //判断商品是否有货
            messageFlag = data.messageFlag;
            var addCartid = $("#godsaddCart");
            if(data.qty <= 0){
                if (sale != undefined && (sale == 2 || sale == 3|| sale == 6||sale == 7||sale == 8||sale == 9)){
                    addCartid.css("background","#aaa").text("暂时下架");
                }else {
                    if (messageFlag == 1) {
                        addCartid.css("background","#aaa").text("到货提醒").on('click', arrivalNotice);
                    } else if(messageFlag == 2){
                        addCartid.css("background","#4b0d65").text("取消提醒").on('click',arrivalNotice);
                    }
                }
            }else {
                if (data.leStat == 2){
                    addCartid.css("background","#aaa").text("暂时下架");
                }else {
                    if(data.isSingleOrder != undefined && data.isSingleOrder == 1){
                        addCartid.text("一键下单").on('click',function(){
                            if(sale == 5 || sale == 10){
                                jems.tipMsg("预热商品暂不可下单");
                                return;
                            }else {
                                buyNow(data.id,data.freePrice);
                            }
                        });
                    }else {
                        var goname = (sale == 5 || sale == 10) ? "提前加入购物车" : "加入购物车";
                        addCartid.text(goname).on('click',addCart);
                    }
                }
            }
            //判断是否显示团购入口
            if(data.isGroup){
            	if(0 == data.groupFlag){
            		$("#groupPrice").html("&yen;"+ jems.formatNum(data.productGroup.groupPrice));
            		$("#groupInlet").show().on("click",function(){
            			jems.goUrl("group-details.html?id="+data.productGroup.groupId);
            		});
            	}
            }

            /*****微信分享*****/
        	var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == "micromessenger"){
				wxShare(data);
			}
            //获取详情页中内容的图片元素
            //ImagesZoom.init({
            //	"elem": "#godsConImg"
            //});
        }
    });
    // 显示购物车数量
    jems.showCartNum();
    jems.fixMenu();
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 55});
});
//抢货产品切换显示
function relatedProducts(len){
    $("#showMore").on('click',function(){
        $(this).hide().parent().addClass("fixrecom");
        $("#godsrecom").show();
        $("#recommask").show();
        $(this).parent().css('bottom',0);
        if(len > 3){
            var showHeight = $('#godsrecom li').height(), diffHeight = len >= 4 ? 30 : 0;
            $("#godsrecom").css({height:showHeight*4+diffHeight,overflow:'auto'});
        }
    });
    $("#recommask").on('click',function(){
        $(this).hide();
        $(this).parent().removeClass("fixrecom");
        $("#godsrecom").hide();
        $("#recommask").hide();
        $("#showMore").show().parent().css('bottom','');
    });
}
//判断是否为手机端
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
//微信分享函数
function wxShare(data){
    /***************微信分享************************/
        //alert(data.goodsPics[0].picUrl);
    var store_name = data.name;
    //alert(store_name);
    if (store_name =="" || store_name == "undefined"){
        store_name = "洋葱海外仓";
    }
    var photo_url = data.goodsPics[0].picUrl
    if (photo_url =="" || photo_url == "undefined"){
        photo_url = "wx/nimages/share_logo.png";
    }
    $.ajax({
        type:"get",
        url : msonionUrl+"getWeChatSign",
        data: {"url": window.location.href},
        dataType : "json",
        success:function(data){
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appid, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.noncestr, // 必填，生成签名的随机串
                signature: data.finalsign,// 必填，签名，见附录1
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: store_name, // 分享标题
                    link: window.location.href, // 分享链接
                    imgUrl: msPicPath+photo_url, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        //alert("3q");
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        //alert(" no 3q");
                    }
                });
                wx.onMenuShareAppMessage({
                    title: store_name, // 分享标题
                    desc: '全球研选 日用之美', // 分享描述
                    link: window.location.href,//'http://m.msyc.cc/wx/index.html?tmn='+tmn, // 分享链接
                    imgUrl: msPicPath+photo_url, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
            wx.onMenuShareQZone({
                title: store_name, // 分享标题
                desc: '全球研选 日用之美', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl:msPicPath+photo_url, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: store_name, // 分享标题
                desc: '全球研选 日用之美', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl:msPicPath+photo_url, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        }
    });
}
//添加收藏
function addAtten(tmn,goodsId){
    var ele = event.target;
    $.ajax({
        type: "get",
        url: msonionUrl+"myatten/add?tmn="+tmn+"&goodsId="+goodsId,
        dataType : "json",
        //jsonp:"callback",
        success: function(data){
            var msg = "";
            if(data.state == -1){  //帐户未登录或无权限
                jems.goUrl("login.html?"+window.location.href);
            }else{
                if(data.state == 0){
                    msg = "此商品关注失败！";
                }else if(data.state == 1){
                    msg = "此商品已在关注中！";
                }else if(data.state == 2){
                    $("#isAtten").find("em").removeClass("msfavorgray").addClass("msfavorpurple");
                    $("#isAtten").find("span").text("已关注");
                    msg = "商品关注成功！";
                }else if(data.state == 3){
                    msg = "洋葱商家不能使用此功能！";
                }
                jems.mboxMsg(msg);
            }
        }
    });
}

/**
 * 商品限购规则
 * @param gid	购买商品的id
 * @param mid	购买商品的分类id，如果是按指定商品限购，则分类id可以不用传
 * @param num	购买数量
 *
 */
function limitrule(gid,num,mid){
    var limit = true;
    var params = {"gid":gid,"buynum":num,"menuid":mid,"t":new Date().getTime()};
    var url = msonionUrl+"sodrest/sodlimit1";
    $.ajax({
        type:'get',
        url:url,
        data:params,
        dataType:'json',
        async:false,
        success:function(msg){
            var info = "该商品是限购商品";
            //info += "<br />限购日期："+msg.sdate+"~"+msg.edate;
            info += "<br />每人限购"+msg.limitNum+"件";
            msg.islimit&&jems.mboxMsg(info);
            limit = msg.islimit;
        }
    });
    return limit;
}
//添加购物车
var timer = null;
function addCart(){
    clearTimeout(timer);
    timer = setTimeout(function(){
        var parid = ParHref.params;
        if(!limitrule(parid.id, 1,menuId)){	// 添加限购规则 2015-11-30

            $.ajax({
                type: "get",
                url: msonionUrl+"cart/add?tmnId="+parid.tmn+"&goodsId="+parid.id+"&menuId="+menuId,
                dataType : "json",
                //jsonp:"callback",
                success: function(data){
                    var msg = "";
                    if(data.state == 5){
                        jems.goUrl("login.html?"+window.location.href);
                    }else{
                        if(data.state == -2){
                            msg = "商品已达到限购数量";
                        }else if (data.state == -1){
                            msg = "对不起，洋葱商家无法使用本功能";
                        }else  if(data.state == 0){
                            msg = "此商品加入购物车失败！";
                        }else if(data.state == 1){
                            msg = "此商品在商城中不存在！";
                        }else if(data.state == 2){
                            msg = "数量不能为空！";
                        }else if(data.state == 3){
                            jems.showCartNum();  // 重新计算购物车数量
                            msg = "恭喜加入购物车成功！";
                        }else if(data.state == 4){
                            msg = "终端不存在！";
                        }else if(data.state == 6){
                            msg = "此终端不存在！";
                        }else if(data.state == 7){
                            msg = "洋葱商家不能使用此功能！";
                        }
                        jems.tipMsg(msg);
                    }
                }
            });
        }
    },500);
}

//到货提醒
var firstClick = true;
function arrivalNotice(){
    if (!firstClick)	return "";
    firstClick = false;
    $.ajax({
        type: "post",
        data:{"gid":gid,"messageFlag":messageFlag},
        url: msonionUrl+"message/createArrivalNotice?v_="+new Date().getTime(),
        dataType : "json",
        success: function(data){
            if(data.errCode == 0){
                jems.goUrl("login.html?"+window.location.href);
            } else {
                window.location.reload();
            }
        }
    });
}
function buyNow(productId,price){
    var type = jems.memberType();
    if(type == 3 || type == 4){
    	jems.akeyOrder(productId,price);
    }else{
        jems.tipMsg("对不起，洋葱商家无法使用本功能");
    }
}