
var  code = "", timeStamp = "", nonceStr = "", appId = "", paySign = "", prepay_id = "";
$(function(){
	$("#loader").show();
	$(".mswrapper").hide();
	tmn = jems.parsURL().params.tmn;
	console.log(window.location.href);
	code = jems.parsURL().params.code;
	if (code == "" || code == undefined){
		mBox.open({
			//width:"80%",
			content:"支付参数有误，请重新发起支付",
			closeBtn: [false],
			btnName:['确定'],
			btnStyle:["color: #0e90d2;"],
			maskClose:false,
			yesfun : function(){
				jems.goUrl("ucenter/members.html");
			}
		})
	} else {
		publicPay(code);
	}

});

/**
 * 微信公众号支付
 * @param code
 */
function publicPay(code){
	$.ajax({
		url: msonionUrl+"agentStoreOrder/publicPay/v1",
		type:'POST',
		data:{"code": code},
		dataType:'json',
		success:function(result){
			var errCode = result.errCode;
			if(errCode == 10000) {
				$("#loader").hide();
				$(".mswrapper").show();
				$("#desc").text(result.data.desc);
				$("#amount").text(result.data.amount);
				timeStamp = result.data.timeStamp;
				nonceStr = result.data.nonceStr;
				appId = result.data.appId;
				paySign = result.data.paySign;
				prepay_id = result.data.prepayId;
				if (result.data.timeStamp != undefined ){
					if (typeof WeixinJSBridge == "undefined"){
						if( document.addEventListener ){
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								timestamp:result.data.timeStamp,
								nonceStr:result.data.nonceStr,
								appId:result.data.appId,
								signature:result.data.paySign,
								jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
							});
							document.addEventListener('WeixinJSBridgeReady', callpay, false);
						}else if (document.attachEvent){
							document.attachEvent('WeixinJSBridgeReady', callpay);
							document.attachEvent('onWeixinJSBridgeReady', callpay);
						}
					}else{
						wx.config({
							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							timestamp:result.data.timeStamp,
							nonceStr:result.data.nonceStr,
							appId:result.data.appId,
							signature:result.data.paySign,
							jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						callpay();
					}
				} else {
					jems.goUrl("payment.html?sodId="+sodId);
				}
			} else if(5132 == errCode || '5132' == errCode){
				var trxcode = result.data.trxcode;
				var trxMsg = trxcode == 'VSP501'?'微信':'支付宝';
				mBox.open({
					width:"80%",
					content:"<p class='tc listinfo f16' style='width:100%'>您已使用"+trxMsg+"支付过，请稍后查看！</p>",
					closeBtn: [false,1],
					btnName:['访问首页', '查看订单'],
					btnStyle:["color: #0e90d2;","color: #0e90d2;"],
					maskClose:false,
					yesfun : function(){
						jems.goShop();
					} ,     
					nofun : function(){
						jems.goUrl('ucenter/order-all.html');
					}     
					});
			}else {
				$("#desc").text(result.errMsg);
				$("#amount").text("0.00");		
			}
		},
		error:function(result){
			jems.tipMsg("network error!");
		}
	});
}
function callpay(){
	wx.chooseWXPay({
		timestamp:timeStamp,
		nonceStr:nonceStr,
		package:prepay_id,
		signType:"MD5",
		paySign:paySign,
		success: function (res) {
			jems.goUrl("ucenter/members.html");
		},
		cancel:function(res){
			jems.goUrl("payment-buyagent.html");
		},
		fail:function(res){
			jems.goUrl("payment-buyagent.html");
		}
	});

}