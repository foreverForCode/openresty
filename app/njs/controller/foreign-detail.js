// JavaScript Document
var ParHref = jems.parsURL(window.location.href);
var params = ParHref.params;
var tmn = params.tmn;
//var tmn = params.tmn,uid=params.uid,client=params.client,msToken=params.msToken;
var flag = true;
var id = params.id;
var isLogin= false;//是否登录
var colorarray = [];
var siezearray = [];
var stylearray = [];
var colorval = '';//颜色值
var sizeval = '';//尺寸值
var styleval = '';//款式值
var checkColorId = '';//颜色id
var checkSizeId = '';//尺寸id
var checkStyleId = '';//款式id
var carnumber = '';//购物车数量
var goodsId = '';
var cartNum = 0;
var priceary = [];//最高价最低价
$(function () {
    //返回顶部插件引用
    $(window).goTops({toBtnCell: "#gotop", posBottom: 100});

    requestDeail(id);
    //加
    $(".cartadd").on("tap", function () {
        var carnum = $(this).prev();
        carnum.val(parseInt(carnum.val()) + 1);
        checkColorSize(null, null, null);
    })

    //减
    $(".cartmin").on("tap", function () {
        var carnum = $(this).next();
        var num = parseInt(carnum.val());
        if (num == 1) {
            jems.tipMsg("至少购买一件!");
            return;
        }
        carnum.val(num - 1);
        checkColorSize(null, null, null);
    })

    //确定
    $(".editSumit").on("tap", function () {
        if (checkColorId == '') {
            jems.tipMsg("请选择颜色!");
            return;
        }
        if (checkSizeId == '') {
            jems.tipMsg("请选择尺寸!");
            return;
        }
        //没有登录
//	    if(!isLogin){
//	    	saveCookie();
//	    	jems.goUrl("../wx/login.html?" + window.location.href);
//	    	return;
//	    }
//	    clearCookie();
        $(".edit").html("已选择：&nbsp;" + colorval + "   " + sizeval + "     " + styleval + "     " + carnumber.val() + "件  ");
        $(this).parents(".editSize").hide();
        $(".editMask").hide();
        addCart();
    })

    /**
     * 加入购物车
     */
    $("#godsaddCart").on("tap", function () {
//        if(!isLogin){
//            jems.goUrl("../wx/login.html?" + window.location.href);
//            return;
//        }
    	console.log(1);
        $(".editMask ").show();
        $(".editSize").show();
    });

    //修改尺寸弹窗
    $(".editMask ").bind("touchmove", function (e) {
        e.preventDefault();
    });
    $(".edit").on("click", function () {
        $(".editMask ").show();
        $(".editSize").show();
    })
    $(".editMask ").on("click", function () {
        $(".editSize").hide();
        $(this).hide();
    })
    $(".editClose").on("click", function () {
        $(this).parents(".editSize").hide();
        $(".editMask").hide();
    })
    $(".onSelect span").on("click", function () {
        $(this).addClass("on").siblings().removeClass("on");
    })
    $(".cartboxBtn").on("click", function () {
        var _this = $(this);
        var _sibling = $(this).parent().siblings();
        if (_sibling.is(":hidden")) {
            _this.addClass("btndown").removeClass("btnup");
            _sibling.show();
        } else {
            _sibling.hide();
            _this.addClass("btnup").removeClass("btndown");
        }
    })

    //跳转至购物车
    $("#myShopCart").on("tap", function () {
        jems.goUrl("../wx/ucenter/cart.html")
        return;
    });

    //关注
    $("#isAtten").on("tap", function () {
    	if(!isLogin){
            jems.goUrl("../wx/login.html?" + window.location.href);
            return;
        }
        if ($(this).find("em").hasClass("msfavorgray")) {
            attenChange($(this), 0);
        } else {
            attenChange($(this), 1);
        }
    });
});

/**
 * 最高价最低价排序显示
 * @returns
 */
function priceRange(){
    var minN = priceary[0];//最低价
    var maxN = priceary[priceary.length-1];//最高价	                
    if(minN != maxN){
    	$("#freeprice").html("&yen"+minN+"~&yen"+maxN+"");
    }else{
    	$("#freeprice").html("&yen"+minN+"");
    }
}

function saveCookie(){
	localStorage.colorId = checkColorId;
	localStorage.sizeId = checkSizeId;
	localStorage.goodId = id;
}
function clearCookie(){
	localStorage.colorId = "";
	localStorage.sizeId = "";
	localStorage.goodId = "";
}

//关注状态切换
function attenChange(obj, status) {
    $.ajax({
        type: "post",
        url: msonionUrl + "myatten/add",
        data: {"goodsId": id, "tmn": tmn},
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            if (result.state == 2) {
                obj.find("em").addClass("msfavorpurple");
                $("#isAtten span").text("已关注");
            }
            else {
                jems.tipMsg("此商品已在关注中!");
                return;
            }
        }
    });
}

//选择颜色和尺寸
function checkColorSize(item, status, sublist) {//对应颜色
    carnumber = $("input[name='cartname']");
    var colorblock = $("#colorBlock span");//颜色快
    var sizeblock = $("#sizeBlock span");//尺寸块
    var styleblock = $("#styleBlock span");//款式块
    var itemarray = [];
    var temparray = [];
    if (item == "color") {  
        if (status == "on") {
            sublist.forEach(function (v) {
                if (checkColorId == v.spec1.id && v.qty != 0 && v.leStat ==1) {
                    itemarray.push(v.spec2.id.toString());
                }
            });
            sizeblock.each(function () {
                if ($.inArray($(this).attr("data-id"), itemarray) == -1 || $(this).attr("data-qty") == 0 ||  $(this).attr("data-leStat") !=1) {
                    $(this).removeClass("on").addClass("notSe");
                }
                else {
                    $(this).removeClass("notSe");
                }
            })
            styleblock.each(function () {

            })
        }else {
        	sizeblock.each(function () {
                if ($(this).attr("data-default") == 'true') {
                    $(this).removeClass("on").addClass("notSe");
                } else{
                	$(this).removeClass("notSe");
                }
            })
        }
    }
    if (item == 'size') {
        if (status == "on") {
            sublist.forEach(function (v) {
                if (checkSizeId == v.spec2.id && v.qty != 0 && v.leStat ==1) {
                	temparray.push(v.spec1.id.toString());
                }
            });
            colorblock.each(function () {
                if ($.inArray($(this).attr("data-id"), temparray) == -1 || $(this).attr("data-qty") == 0 ||  $(this).attr("data-leStat") !=1) {
                    $(this).removeClass("on").addClass("notSe");
                }
                else {
                    $(this).removeClass("notSe");
                }
            })
            styleblock.each(function () {

            })
        } else{
        	colorblock.each(function () {
                if ($(this).attr("data-default") == 'true') {
                    $(this).removeClass("on").addClass("notSe");
                } else{
                	$(this).removeClass("notSe");
                }
            })
        }
    }
    if (item == 'style') {
        if (status == "on") {
            colorblock.each(function () {
            	
            })
            sizeblock.each(function () {
            	
            })
        }
    }

    var carcheck = $("#ischeck");//已经选择对象
    carcheck.html(colorval + "   " + sizeval + "     " + styleval + "     " + carnumber.val() + "件  ");
    if(sublist != null){
	    	if (checkColorId != '' && checkSizeId != '') {
	        sublist.forEach(function (v) {
	            if (v.spec1.id == checkColorId && v.spec2.id == checkSizeId) {
	                goodsId = v.id;
	                $(".photo span img").attr("src", "" + msPicPath + "" + v.mainPicUrl + "?x-oss-process=image/resize,w_200");
	                $("#freeprice").html("&yen" + v.freePrice);
	            }
	        });
	    }
    }
    
    if (checkColorId == '' && checkSizeId == ''){
        priceRange();
    }
}


//请求详情数据
function requestDeail() {
    if (id == "" || id == null) {
        jems.tipMsg("不合理的请求!")
        return;
    }
    $.ajax({
        type: "post",
        url: msonionUrl + "subProduct/getDetailItem",
        data: {
            "id": id
        },
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            var parahtml = ''//商品参数html
            var pichtml = '';
            var hdhtml='';
            var productParaHtml = '';
            var youLikeHtml = '';//猜你喜欢
            var iskeyArray = [];//关键属性数组
            var notkeyArray = [];//非关键属性
            if (10000 == result.errCode) {
                var data = result.data.realData;
                isLogin = result.data.isLogin;
                jems.wxShare(data.name,msPicPath+data.mainPicUrl,undefined);
                if (result.data.cartNum != undefined && result.data.cartNum > 0) {
                    cartNum += result.data.cartNum;
                    $("#cartNum").show();
                    $("#cartNum").html(cartNum);//购物车数量
                }
                //猜你喜欢
                if(data.proInfos.length > 0){
                	$("#guessLike").prev().css("display","");
                	$("#guessLike").css("display","-webkit-box!important");
                	data.proInfos.forEach(function(v){
                		youLikeHtml+='<li data-type='+ v.type +' data-id = '+v.id+'>';
                    	youLikeHtml+='<p class="imgs"><img src="'+msPicPath+''+v.mainPicUrl+'"></p>';
                    	youLikeHtml+='<p class="txtells pl5 pr5 f12">'+v.name+'</p>';
                    	youLikeHtml+='<p class="pl5 pr5 tl"><span class="purple mr15 f14">&yen;'+v.freePrice+'</span></p>';
                    	youLikeHtml+='</li>';
                	})
//                	youLikeHtml+='<li class="btnMone" onclick="jems.goUrl()"><img src="nimages/btn_more.png"></li>';
                	$("#guessLike ul").html(youLikeHtml);
                } else{
                	$("#guessLike").prev().css("display","none");
                	$("#guessLike").css("display","none !important");
                }
                
                $("#guessLike ul li").on("tap",function(){
                	if($(this).attr("data-type")==1){
                		jems.goUrl("foreign-detail.html?id="+$(this).attr("data-id"));
                	} else {
                		jems.goUrl("goods-details.html?id="+$(this).attr("data-id"));
                	}
                })

                //商品属性
                data.goodsProps.forEach(function (v, index, array) {
                	if(v.isKey == 1){
                		iskeyArray.push(v);
                	} else{
                		notkeyArray.push(v);
                	}
                });
                //非主要属性
                notkeyArray.forEach(function(v){
                	if(v.propValue!=""){
                        parahtml += '<p class="g9">' + v.propName + '：<span class="g3">' + v.propValue.replace(/#/g, '</br>') + '</span></p>';
                	} else if(v.picUrl!=""){
                		parahtml += '<p class="g9">' + v.propName + '：<span class="g3"></span></p><img src="'+msPicPath+''+v.picUrl+'" />';
                	}
                });
                $("#Param").html(parahtml);
                //主要属性
                iskeyArray.forEach(function(v){
                	if(v.picUrl!=""){
                		productParaHtml+='<h3 class="f15 mb15 mt10">' + v.propName + ' <span class="f13 g9">' + v.enName + '</span></h3><img src="'+msPicPath+''+v.picUrl+'" />';
                	}else{
                		productParaHtml+='<h3 class="f15 mb15 mt10">' + v.propName + ' <span class="f13 g9">' + v.enName + '</br >'+v.propValue.replace(/#/g, '</br>')+'</span></h3>';
                	}
                })
                $("#productParam").append(productParaHtml);
                
                data.goodsPics.forEach(function (v, index, array) {
                    pichtml += '<li>';
                    pichtml += '<div class="conpic">'
                    pichtml += '<span class="" style="background-image: url(' + msPicPath + '' + v.picUrl + ');"></span>'
                    pichtml += '</div>'
                    pichtml += '</li>'
                    hdhtml+='<li></li>';
                });
                $("#foreignSilder .bd ul").html(pichtml);
                $("#foreignSilder .hd ul").html(hdhtml);
                $("h3[data-name=\"name\"]").html(data.name);//名称
                $("p[data-price=\"price\"] span").html("&yen"+data.freePrice);//售价
                $("p[data-price=\"price\"] del").html("&yen"+data.marketPrice);//标价
                $(".photo span img").attr("src", "" + msPicPath + "" + data.mainPicUrl + "?x-oss-process=image/resize,w_200");
                //产品详情(轮播图)
                if ($('#foreignSilder .bd li').length > 0) {
                    jeSlide({
                        mainCell: "#foreignSilder",
                        navCell: ".hd ul",
                        conCell: ".bd ul",
                        effect: "leftLoop",
                        duration: 4,
                        pageStateCell: ".pageState",
                        switchCell: ".datapic",
                        sLoad: "data-pic",
                        isTouch:true,
                        showNav: true,//自动分页
                        autoPlay: $('#foreignSilder .bd li').length > 1 ? true : false  //自动播放
                    });
                }
                var colorhtml = '';
                var sizehtml = '';
                var existsArray = [];//有效
                var notExistsArray = [];//无效
                if(data.leSpecs!=undefined){
	                //颜色.尺寸
	                data.leSpecs.forEach(function (v, index, array) {//
	                	if(v.qty == 0 || v.leStat != 1){
	                		notExistsArray.push(v);
	                	} else {
	                		existsArray.push(v);
	                	}
	                });

	                //去重
	                for(key in existsArray){
	                	var stra = notExistsArray[key];
	                	for(var j= 0; j < notExistsArray.length; j++){  
	                        var strb = notExistsArray[j];  
	                        if(stra == strb) { 
	                        	notExistsArray.splice(j,1);
	                        }  
	                    }  
	                }
	                var newarray = existsArray.concat(notExistsArray);//合并两个数组
	                existsArray = notExistsArray = null;
	                
	                newarray.forEach(function(v){
	                	 if ($.inArray(v.spec1.name, colorarray) == -1) {
	                         colorarray.push(v.spec1.name);
	                         if(v.qty == 0 || v.leStat != 1){
	                         	 colorhtml += "<span data-leStat='"+v.leStat+"' data-default='true' data-qty='" + v.qty + "' class='select rdu3 notSe' data-id='" + v.spec1.id + "'>" + v.spec1.name + "</span>";
	                         } else {
	                             colorhtml += "<span data-leStat='"+v.leStat+"' data-qty='" + v.qty + "' class='select rdu3' data-id='" + v.spec1.id + "'>" + v.spec1.name + "</span>";
	                         }
	                     }
	                     if ($.inArray(v.spec2.name, siezearray) == -1) {
	                         siezearray.push(v.spec2.name);
	                         if(v.qty == 0 || v.leStat != 1){
	                             sizehtml += "<span data-leStat='"+v.leStat+"' data-default='true' data-qty='" + v.qty + "' class=\"select rdu3 notSe\" data-id='" + v.spec2.id + "'>" + v.spec2.name + "</span>";
	                         } else {
	                             sizehtml += "<span data-leStat='"+v.leStat+"' data-qty='" + v.qty + "' class=\"select rdu3\" data-id='" + v.spec2.id + "'>" + v.spec2.name + "</span>";
	                         }
	                     }
	                     priceary.push(v.freePrice);
	                 	priceary.sort(function(a,b){return a-b;});
	                    $("#colorBlock").html(colorhtml);
	                    $("#sizeBlock").html(sizehtml);
	                    priceRange();
	                });
                }
                $("#detaildesc").html(data.goodsDesc);
                result.data.isAtten == 1 ? $("#isAtten em").addClass("msfavorgray") : $("#isAtten em").addClass("msfavorpurple");
                result.data.isAtten == 1 ? $("#isAtten span").text("关注") : $("#isAtten span").text("已关注");
                //详情页视频
                if(result.data.realData.videoUrl == undefined || result.data.realData.videoUrl == ""){
                    $("#movie").remove();
                }else{
                    var videos = $("<video/>",{"webkit-playsinline":"true","playsinline":"true","x5-video-player-type":"h5","x5-video-player-fullscreen":"true","preload":"none","width":"100%","controls":"controls","poster":""});
                    var source = $("<source/>",{"src":result.data.realData.videoUrl,"type":"video/mp4"});
                    $("#movie").append(videos.append(source));
                }
                $("#colorBlock span").on("tap", function () {//颜色选择事件
                    if (!$(this).hasClass("notSe")) {
                        if (!$(this).hasClass("on")) {//选中
                            $(this).siblings().removeClass("on");
                            $(this).addClass("on");
                            colorval = $(this).html() + "色";
                            checkColorId = $(this).attr("data-id");
                        } else {//取消选中
                            $(this).removeClass("on");
                            colorval = '';
                            checkColorId = '';
                        }
                        checkColorSize('color', colorval == '' ? 'off' : 'on', data.leSpecs);
                    }
                })
                $("#sizeBlock span").on("tap", function () {//尺寸选择事件
                    if (!$(this).hasClass("notSe")) {
                        if (!$(this).hasClass("on")) {//选中
                            $(this).siblings().removeClass("on");
                            $(this).addClass("on");
                            sizeval = $(this).html() + "码";
                            checkSizeId = $(this).attr("data-id");
                        } else {//取消选中
                            $(this).removeClass("on");
                            sizeval = '';
                            checkSizeId = '';
                        }
                        checkColorSize('size', sizeval == '' ? 'off' : 'on', data.leSpecs);
                    }
                })
                // $("#styleBlock span").on("tap", function () {//尺寸选择事件
                //     if (!$(this).hasClass("notSe")) {
                //         if (!$(this).hasClass("on")) {//选中
                //             $(this).siblings().removeClass("on");
                //             $(this).addClass("on");
                //             styleval = $(this).html();
                //             checkStyleId = $(this).attr("data-id");
                //         } else {//取消选中
                //             $(this).removeClass("on");
                //             styleval = '';
                //             checkStyleId = '';
                //         }
                //         checkColorSize('style', styleval == '' ? 'off' : 'on', sublist);
                //     }
                // })
            }
            else {//请求出错了
                jems.tipMsg(result.errMsg)
                return;
            }
        }
    });
}

//添加购物车
var timer = null;

function addCart() {
    clearTimeout(timer);
    if (params.menuId == undefined) {
        params.menuId = 0;
    }
    timer = setTimeout(function () {
        $.ajax({
            type: "post",
            data: {"goodsId": goodsId, "num": carnumber.val()},
            url: msonionUrl + "app/cart/add/v2",
            dataType: "json",
            success: function (result) {
                if (result.errCode == 4001 || result.errCode == 4002) {	// 如果未登录，则跳至登录页面
                    jems.goUrl("../wx/login.html?" + window.location.href);
                } else if (result.errCode == 10000) {
                    jems.tipMsg(result.errMsg);
                    cartNum += Number(carnumber.val())
                    $("#cartNum").html(cartNum);//购物车数量
                } else {
                    jems.tipMsg(result.errMsg);
                }
            }
        });
    }, 500);
}


