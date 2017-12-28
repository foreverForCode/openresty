/** 
@Js-name:order-refund.js
@Zh-name:退货订单
*/
$(function(){
	//var url = window.location.href;
	//var params =  parsURL(url).params; 
	var pageNum = 1;
    var totalPage = 1;
	$(window).dropload({afterDatafun: lowadData});
	function lowadData(){
		if(pageNum > totalPage){ return; }
		$.ajax({
			type : "post",
			data : {"pageNo":pageNum},
			url : msonionUrl+"sodrest/thSodList",
			dataType : "json",
			asyn:false,
			success:function(json){
				if(json.data == ""){
					$("#orderrefund").html("<p class='p15 mt20 tc g9 f14'>╯▂╰ 暂无订单信息！</p>");
				}else{
					var gettpl = $('#orderrefundData').html();
					jetpl(gettpl).render(json, function(html) {
						$('#orderrefund').append(html);
					});
                    $(".sodyusu").on("tap",function () {
                        var hli = $(this).parent("li").find(".sodhide");
                        if(hli.css("display") == "none"){
                            hli.css({display:""});
                            $(this).find("span").addClass("actcurr");
                            $(this).find("span ins").text("隐藏");
                        }else {
                            hli.css({display:"none"});
                            $(this).find("span").removeClass("actcurr");
                            $(this).find("span ins").text("显示");
                        }
                    });
					totalPage = json.totalPage;
					pageNum++;
				}

			}
		});
	}
	// 显示购物车数量
	jems.showCartNum();
	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop",posBottom:100});
});