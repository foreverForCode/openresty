// JavaScript Document
var ParHref = jems.parsURL(window.location.href);
var params = ParHref.params;
var tmn = params.tmn;
//var tmn = params.tmn,uid=params.uid,client=params.client,msToken=params.msToken;
var flag = true;
var id = params.id;

$(function () {
    classInfo();
    weekHotList();
    requestIndexList();

    $(".msopennav").on("click", function () {
        if ($(".mslevenav").css("display") == "block") {
            $(this).parent().addClass("mslevemenu");
            $(".mslevenav").css("display", "none");
            $(".msleveopen").css("display", "block");
        } else {
            $(this).parent().removeClass("mslevemenu");
            $(".mslevenav").css("display", "");
            $(".msleveopen").css("display", "none");
        }
    });
    jems.fixMenu();
    //返回顶部插件引用
    $(window).goTops({toBtnCell: "#gotop", posBottom: 55});
})

/**
 * 请求周热销数据
 */
function weekHotList() {
    $.ajax({
        type: "post",
        url: msonionUrl + "subProduct/weekHotList",
        data: {},
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            var weekHothtml = '';
            if (10000 == result.errCode) {
                var weekhotList = result.data;//分类
                weekhotList.forEach(function (v, index, array) {
                    weekHothtml += '<li data-id=' + v.id + '>';
                    weekHothtml += '<p class="imgs"><img src="' + msPicPath + '' + v.mainPicUrl + '"></p>';
                    weekHothtml += '<p class="txtells pl5 pr5 f12">' + v.name + '</p>';
                    weekHothtml += '<p class="pl5 pr5 tl"><span class="purple mr15 f14">&yen;' + v.freePrice + '</span></p>';
                    weekHothtml += '</li>';
                });
                weekHothtml += '<li class="btnMone" onclick="jems.goUrl()"><img src="nimages/btn_more.png"></li>';
                $("#weekHotList ul").html(weekHothtml);

                /**
                 *  周热销榜点击
                 */
                $("#weekHotList ul li").on("tap", function () {
                    jems.goUrl("foreign-detail.html?tmn=" + tmn + "&id=" + $(this).attr("data-id"));
                });
            }
        }
    });
}

/**
 * 请求分类信息
 */
function classInfo() {
    $.ajax({
        type: "post",
        url: msonionUrl + "subProduct/getClassInfo",
        data: {},
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            var classhtml = '';
            if (10000 == result.errCode) {
                var classList = result.data.childrens;//分类
                classList.forEach(function (v) {
                    classhtml += '<li data-id="' + v.id + '">' + v.let_name + '</li>';
                });
                $(".mslevenav ul").html(classhtml);
                $(".msleveopen ul").html(classhtml);

                /**
                 * 分类点击
                 */
                $(".mslevenav li").on("tap", function () {
                    console.log(1);
                    jems.goUrl("foreign-list.html?classId=" + $(this).attr("data-id"));
                })

                /**
                 * 分类点击
                 */
                $(".msleveopen li").on("tap", function () {
                    jems.goUrl("foreign-list.html?classId=" + $(this).attr("data-id"));
                })
            }
        }
    });
}

/**
 * 请求主数据
 */
function requestIndexList() {
    var url = msonionUrl + "subProduct/getForeignIndex";
    var datas = {};
    $.ajax({
        type: "get",
        url: url,
        data: datas,
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            var recommendhtml = '';
            var commonAlbumhtml = '';
            var activityAlbumhtml = '';
            var adPichtml0 = '';
            var adPichtml1 = '';
            if (10000 == result.errCode) {
                var indexList = result.data;
                var recommendList = indexList.recommendList;//推荐
                var commonAlbumList = indexList.commonAlbumList;//超值热卖
                var activityAlbumList = indexList.activityAlbumList;//精选美衣
                var adList = indexList.adList;//轮播图
                adList.forEach(function (v, index) {
                    adPichtml0 += '<li data-picUrl=' + v.imgUrl + '>';
                    adPichtml0 += '<a>';
                    adPichtml0 += '<div class="conpic">';
                    adPichtml0 += '<span class=""style="background-image: url(' + msPicPath + '' + v.imgPath + ')"></span>';
                    adPichtml0 += '</div>';
                    adPichtml0 += '</a>';
                    adPichtml0 += '</li>';
                    adPichtml1 += '<li>' + index + 1 + '</li>';
                });

                $("#findslider div[class='bd']").find('ul').html(adPichtml0);
                $("#findslider div[class='hd']").find('ul').html(adPichtml1);

                jeSlide({
                    slideCell: "#findslider",
                    titCell: ".hd ul",
                    mainCell: ".bd ul",
                    effect: "leftLoop",
                    interTime: 4000,
                    switchCell: ".datapic",
                    switchLoad: "data-pic",
                    autoPage: true,//自动分页
                    autoPlay: $('#findslider .bd li').length > 1 ? true : false  //自动播放
                });

                recommendList.forEach(function (v) {
                    recommendhtml += '<li data-recomid=' + v.id + '>';
                    recommendhtml += '<div class="p5">';
                    recommendhtml += '<span class="photo show" style="background-image:url(' + msPicPath + '' + v.picUrl + ')"></span>';
                    recommendhtml += '<h3 class="f13 mt5">' + v.name + '</h3>';
                    recommendhtml += '<p class="flexbox mt5 je-align-center">';
                    recommendhtml += '<span class="f12 purple show">&yen' + v.freePrice + '</span>';
                    recommendhtml += '<del class="f10 g9 show jeflex ml10">&yen' + v.marketPrice + '</del>';
//                    recommendhtml += '<span class="btn btn-favorite show"></span>';
                    recommendhtml += '</p>';
                    recommendhtml += '</div>';
                    recommendhtml += '</li>';
                });
                $(".prolist").html(recommendhtml);

                $("li[data-recomid]").on("tap", function () {
                    jems.goUrl("foreign-detail.html?tmn=" + tmn + "&id=" + $(this).attr("data-recomid"));
                });
                commonAlbumList.forEach(function (v) {
                    commonAlbumhtml += '<div data-activeid='+v.ID+' class="msgodscon">';
                    commonAlbumhtml += '<div class="imgbox" onclick="jems.goUrl()">';
                    commonAlbumhtml += '<span class="lazy" style="background-image:url(' + msPicPath + '' + v.mainPicUrl + ');"></span>';
                    commonAlbumhtml += '</div>';
                    commonAlbumhtml += '</div>';
                    commonAlbumhtml += ' <div class="msgods-smalist msgodscroll pb5">';
                    commonAlbumhtml += '<ul>';
                    v.productList.forEach(function (val) {
                        commonAlbumhtml += '<li data-hotid=' + val.id + '>';
                        commonAlbumhtml += '<p class="imgs"><img src="' + msPicPath + '' + val.mainPicUrl + '"></p>';
                        commonAlbumhtml += '<p class="txtells pl5 pr5 f12">' + val.brandName + '</p>';
                        commonAlbumhtml += ' <p class="pl5 pr5 tl"><span class="purple mr15 f14">&yen;' + val.freePrice + '</span></p>';
                        commonAlbumhtml += ' </li>';
                    })
                    commonAlbumhtml += ' <li data-activeid='+v.ID+' class="btnMone"><img src="nimages/btn_more.png"></li>';
                    commonAlbumhtml += '</ul>';
                    commonAlbumhtml += ' </div>';

                });
                $("div[data-hot=\"hot\"]").html(commonAlbumhtml);

                $("li[data-hotid]").on("tap", function () {
                    jems.goUrl("foreign-detail.html?tmn=" + tmn + "&id=" + $(this).attr("data-hotid"));
                });
                
                $("li.btnMone").on("tap", function () {
                    jems.goUrl("actapp/album/index.html?tmn=" + tmn + "&album=" + $(this).attr("data-activeid"));
                });
                $("div.msgodscon").on("tap",function(){
                    jems.goUrl("actapp/album/index.html?tmn=" + tmn + "&album=" + $(this).attr("data-activeid"));
                });

                activityAlbumList.forEach(function (v) {
                    activityAlbumhtml += '<li data-activeid=' + v.ID + '>';
                    activityAlbumhtml += '<span class="show" style="background-image:url(' + msPicPath + '' + v.mainPicUrl + ');"></span>';
                    activityAlbumhtml += '</li>';
                });
                $(".menulist").html(activityAlbumhtml);

                $("li[data-activeid]").on("tap", function () {
                    jems.goUrl("actapp/album/index.html?tmn=" + tmn + "&album=" + $(this).attr("data-activeid"));
                });

                /**
                 * 轮播图点击
                 */
                $('#findslider .bd li').on("tap", function () {
                    jems.goUrl($(this).attr("data-picUrl"));
                })
            }
            else {
                jems.tipMsg(result.errMsg)
                return;
            }
        }
    });
}