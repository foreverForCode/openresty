$(function () {
    //返回顶部插件引用
    $(window).goStick({fixed:"fixed",btnCell:"#gotop",posBottom: 70});
    //floor
    function scrollEvent (){
        var scrolltop = $(window).scrollTop(),
            top0 = $(".floor0").offset().top,
            top1 = $(".floor1").offset().top,
            top2 = $(".floor2").offset().top;
        if (scrolltop>top0 && scrolltop<top1){
            $("#headernav li").eq(0).addClass("on").siblings().removeClass("on")
        } else if(scrolltop>top1 && scrolltop<top2) {
            $("#headernav li").eq(1).addClass("on").siblings().removeClass("on")
        }else if(scrolltop>top2) {
            $("#headernav li").eq(2).addClass("on").siblings().removeClass("on")
        }
        return false;
    }
    $(window).on('scroll',scrollEvent)

    $("#headernav li").on("click",function () {
        $(window).off('scroll',scrollEvent)
        var that = $(this);
        that.addClass("on").siblings().removeClass("on");
        console.log(that)
        var idx = that.index();
        var position  =  $(".floor"+idx).offset().top-50;
        $("html,body").scrollTop(position);
        setTimeout(function(){
            $(window).on('scroll',scrollEvent)
        },1000)
        return false;
    })

    $(".detailsTab li").on("tap",function(){
        var idx = $(this).index();
        $(this).addClass("on").siblings().removeClass("on")
        $(".tabbox_"+idx).show().siblings().hide();
    })
    $("#checkMore").on("click",function(){
        //alert(11111)
        var _this =$(this).siblings(".checkCont");
        if(_this.is(":hidden")){
            _this.show();
        }else{
            _this.hide();
        }
    })

    //弹窗 detailbox-flrico 
    $(".detailbox-flrico").on("click",function () {
        mBox.open({
            title: ['查看利润', 'color:#333;font-size:1.5rem;text-align:center;'],
            width: "90%",
            // height: "50%",
            content: $("#materialView")[0],
            // closeBtn: [true, 1],
            btnName: ['关闭'],
            btnStyle: ["color: #0e90d2;"],
            maskClose: false,
            success:function () {
                //$("#materialdata").html($("#materialView").html());

            }
        });
    });
    //抢货产品切换显示
    function relatedProducts() {
        $("#showMore").on('click', function () {
            $(this).hide().parent().addClass("fixrecom");
            $("#godsrecom").show();
            $("#recommask").show();
            $(this).parent().css('bottom', 0);
            /*if (len > 3) {
             var showHeight = $('#godsrecom li').height(), diffHeight = len >= 4 ? 30 : 0;
             $("#godsrecom").css({height: showHeight * 4 + diffHeight, overflow: 'auto'});
             }*/
        });
        $("#recommask").on('click', function () {
            $(this).hide();
            $(this).parent().removeClass("fixrecom");
            $("#godsrecom").hide();
            $("#recommask").hide();
            $("#showMore").show().parent().css('bottom', '');
        });
    }
    relatedProducts();
    //轮播
    if ($("#vidonion .bd li").length > 0) {
        jeSlide({
            slideCell: "#vidonion",
            titCell: ".hd ul",
            mainCell: ".bd ul",
            effect: "leftLoop",
            interTime: 2000,
            pageStateCell: ".pageState",
            switchCell: ".datapic",
            switchLoad: "data-pic",
            autoPage: true,//自动分页
            autoPlay: false  //自动播放
        });
    }
})