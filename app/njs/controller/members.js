/** 
@Js-name:members.js
@Zh-name:会员中心
 */
var errCode,tmn;
$(function(){
	tmn = jems.parsURL(window.location.href).params.tmn;
	$.ajax({
		type : "post",
		url : msonionUrl+"menbercenter/memberCenter/v1",
		/*data:{"uid":sessionStorage.uid,"msToken":sessionStorage.msToken,"client":sessionStorage.client},*/
		dataType : "json",
		success:function(result){
			if(10000 == result.errCode){
				result.data.messageLength > 0 ? $("#notice").show() : $("#notice").hide(); 
				if(result.data.memberrec.memberName == "" || result.data.memberrec.memberName == null || result.data.memberrec.memberName == "undefined"){
					$("#persent_mender").html(result.data.memberrec.memberYCID);
				} else{
					$("#persent_mender").html(result.data.memberrec.memberName);
				}
				var memberHeadUrl = result.data.memberrec.memberHeadUrl,imgurl;
				if (memberHeadUrl != null && memberHeadUrl != "" && typeof(memberHeadUrl) != undefined){
					if (memberHeadUrl.indexOf("http:") >= 0) {
						imgurl = memberHeadUrl;
					} else {
						imgurl = msPicPath+memberHeadUrl;
					}
					if (imgurl.indexOf("undefined") == -1) $('#personImg').attr("src",imgurl);
				}
				if(result.data.sodCount.sod_dfk_count != 0){$("#sod_dfk_count").text(result.data.sodCount.sod_dfk_count)};
				if(result.data.sodCount.sod_dfh_count != 0 || result.data.sodCount.sod_yfh_count != 0){$("#sod_dfhyfh_count").text(result.data.sodCount.sod_dfh_count+result.data.sodCount.sod_yfh_count)};
				if(result.data.sodCount.sod_return_count != 0){$("#sod_return_count").text(result.data.sodCount.sod_return_count)};
				var storeAgent = $("#storeAgent");
				if(result.data.memberrec.memberType == 2){//服务商
					$(".mstitle").children().show();
					$("#home_pwlist_li").remove();
					storeAgent.text("服务商").attr("onclick","jems.goUrl('../store/agents.html')");
				}
				if(result.data.memberrec.memberType == 3){//店主
					$(".mstitle").children().show();
					$("#home_pwlist_li").remove();
					storeAgent.text("店主").attr("onclick","jems.goUrl('../store/stores.html')");
				}
				if(result.data.memberrec.memberType == 4){//会员
					$(".mstitle").html("会员中心");
				}
				if(result.data.memberrec.memberState == 1){
					$("#home_pwlist_li").remove();// closed store
				}
				// 显示购物车数量
				//jems.showCartNum(result.data.cartNum);
                jems.showCartNumTip(result.data.cartNum);
			} else if(4001 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4002 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4003 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4004 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4008 == result.errCode){
				jems.mboxMsg("您的帐号在其它设备登录，请重新登录");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4009 == result.errCode){
				jems.mboxMsg("您的帐号登录超时，请重新登录");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4013 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else {
				jems.tipMsg(result.errMsg);
			}	
		} 
	});
	//退出登录
	$("#loginout").on('tap',function(){
		$.ajax({
			type : "POST",
			url : msonionUrl+"user/loginout?_="+new Date().getTime(),
			dataType : "json",
			success:function(data){
				if(data.success){
					sessionStorage.uid = "";
					sessionStorage.msToken="";
					sessionStorage.client = "";
					jems.goUrl(mspaths+"indexView");
				}else{
					window.location.reload();
				}
			}
		});		
	});
});