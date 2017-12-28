var ParHref = jems.parsURL();
$(function () {
    $.ajax({
        type : "get",
        url :msonionUrl+"app/configs/hot/v1?tmn="+ParHref.params.tmn,
        cache:true,
        dataType : "json",
        success:function(json) {
            var  recommenddata={data:json.recommendList},
                 newListdata ={data:json.newList};
            jetpl("#recommendData").render(recommenddata, function(html){
                $('#recommendList').html(html);
            });  

            jetpl("#newListData").render(newListdata, function(html){
                $('#newList').html(html);
            });
            jems.wxShare("洋葱海外仓"+json.comingTime+"上架清单");
        }
    });
    //头部标签切换
    $(".tabNav span").on("click",function () {
        var _this = $(this),idx = _this.index();
        $(".tabbox_"+idx).show().siblings().hide();
        _this.addClass("on").siblings().removeClass("on");
    }).eq(0).addClass("on");
}) ;          