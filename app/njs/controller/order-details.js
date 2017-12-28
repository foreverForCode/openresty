/**
 @Js-name:logistics_domestic.js
 @Zh-name:物流信息--国内配送
 @Author:tyron
 @Date:2015-08-05
 */
var params = jems.parsURL().params;
$(function () {
    //console.log(msonionUrl+"sodrest/findSodById");
	$.ajax({
		type: "post",
		data: params,
		url: msonionUrl + "sodrest/findSodById/v2",
		dataType: "json",
		asyn: false,
		success: function (result) {
			if (4001 == result.errCode) {
				jems.goUrl(mspaths + "login.html?" + window.location.href);
			}
			if (result.data == null) {
				$("#myorde_nocart").css({display: "block"});
				return ;
			}   
			jetpl("#infoorderData").render(result, function (html) {
				$('#infoorder').html(html);
				goodSodStat();
			});
			function goodSodStat() {
				result.data.sodStat == 1 ? msCountDown(result.data.sodCreateTime) : $("#ordertime").remove();
				if (result.data.sodStat == 2 || result.data.sodStat == 3) {
					$("#orderPayStart").on('click', function () {
						var isGroup = $(this).attr("data-isGroup");
						var sodStat = $(this).attr("data-sodStat");
						var sodNo = $(this).attr("data-sodNo");
						if (isGroup == "true" && sodStat < 3) {
							jems.mboxMsg("该团购订单不允许退款!");
							return;
						}
						if (isGroup == "true" && sodStat >= 3) {
							//createTdSodGroup(sodNo);
							jems.goUrl('return-goods.html?id=' + sodNo + '&isGroup=true');
							return;
						}
						var nowTime = toGetTime("" + new Date().getTime(), true);
						var sodPayTime = toGetTime(result.data.sodPayTime, false);
						var sodDate = toGetTime(result.data.sodDate, false);
						var sodDelayTime = result.data.sodDelayTime == null ? 0 : toGetTime(result.data.sodDelayTime, false);
						var timeDif = parseInt(nowTime) - sodPayTime;
						var returnTimeDif = parseInt(nowTime) - sodDate;//可以退货时间
						if (timeDif < 21600000) {
							//支付时间小于6小时
							//jems.goUrl(mspaths+'return-allgoods.html?id='+result.data.sodId);
							jems.goUrl('return-allgoods.html?id=' + result.data.sodId);
						} else if (sodDelayTime != 0 && sodDelayTime - nowTime > 0) {
							//支付时间大于6小时
							//jems.goUrl(mspaths+'return-goods.html?id='+result.data.sodId);
							jems.goUrl('return-goods.html?id=' + result.data.sodId);
						} else if (timeDif > 21600000 && returnTimeDif < 1749471000) {
							//支付时间大于6小时
							//jems.goUrl(mspaths+'return-goods.html?id='+result.data.sodId);
							jems.goUrl('return-goods.html?id=' + result.data.sodId);
						} else {
							jems.mboxMsg("交易完成");
							//  jems.mboxMsg("<p class='tc f16' style='width:100%'>交易完成</p>");
							//  jems.goUrl('return-goods.html?id=' + result.data.sodId);
							//  jems.goUrl('return-allgoods.html?id=' + result.data.sodId);
						}
					});
				}
			}
		}
	});
});

function toGetTime(strTime, isbol) {
    if (isbol) {
        return strTime;
    } else {
        if (strTime) {
            var newStr = strTime.replace(/:/g, "-");
            newStr = newStr.replace(/ /g, "-");
            var arr = newStr.split("-");
            var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
            return datum.getTime();
        }
    }
}

function msCountDown(ordertime) {
    var splitTime = function (date) {
        var a = date.split(' '), d = a[0].split('-'), t = a[1].split(':');
        return {YY: d[0], MM: d[1], DD: d[2], hh: t[0], mm: t[1], ss: t[2]};
    }
    $.ajax({
        type: "get",
        url: msonionUrl + "systime",
        dataType: "json",
        asyn: false,
        success: function (json) {
            var st = splitTime(json.t), serverTime = new Date(st.YY, st.MM - 1, st.DD, st.hh, st.mm, st.ss);
            var dateTime = new Date(), difference = dateTime.getTime() - serverTime;
            setInterval(function () {
                $("#ordertime").each(function () {
                    var that = $(this), ot = splitTime(ordertime);
                    var endTime = new Date(ot.YY, ot.MM - 1, ot.DD, ot.hh, ot.mm, ot.ss);
                    endTime.setTime(endTime.getTime() + (40 * 60 * 1000));
                    var nowTime = new Date();
                    var nMS = endTime.getTime() - nowTime.getTime() + difference;
                    var D = Math.floor(nMS / (1000 * 60 * 60 * 24));
                    var H = Math.floor(nMS / (1000 * 60 * 60)) % 24;
                    var M = Math.floor(nMS / (1000 * 60)) % 60;
                    var S = Math.floor(nMS / 1000) % 60;
                    var MS = Math.floor(nMS / 100) % 10;
                    if (nMS >= 0) {
                        that.css({display: "-webkit-box!important"});
                        $('#runtime').html(M + "分" + S + "." + MS + "秒");
                    } else {
                        $("#odinfostat").html("已关闭");
                        that.css({display: "none!important"});
                        $('#orderPayStart').removeAttr("id");
                    }

                });
            }, 100);
        }
    });
};

function ordertoPay(sid, isGroup, endtime) {
    $.ajax({
        type: "get",
        data: {"sodId": sid},
        url: msonionUrl + "sodrest/checkTimeout",
        dataType: "json",
        asyn: false,
        success: function (data) {
            if (data == 1) {
                mBox.open({
                    content: "<div class='jew100 tc'>交易超时</div>",
                    btnName: ['确定'],
                    btnStyle: ["color: #0e90d2;"],
                    maskClose: false,
                    yesfun: function () {
                        window.location.reload();
                    }
                });
                return;
            } else {
                var tip = "";
                $.each($("#goodsinfo li"), function () {
                    var sodItemQty = $(this).find('input[name="sodItemQty"]').val();
                    var productQty = $(this).find('input[name="productQty"]').val();//
                    var name = $(this).find('h3[name="pName"]').html();

                    if (parseInt(productQty) < parseInt(sodItemQty)) {
                        tip += name + "<br/>";
                    }
                });
                if (tip != "") {
                    dialogMsgATip(tip + "库存不足！", sid);
                    return "";
                } else if (isGroup == 1) {
                    if (endtime != null) {
                        var endTime = new Date(endtime);
                        var date = new Date();//当前时间
                        if (date > endTime) {
                            jems.mboxMsg("团结已结束!");
                            return;
                        } else {
                            jems.goUrl(mspaths + 'payment.html?sodId=' + sid);
                        }
                    }
                }
                else {
                    jems.goUrl(mspaths + 'payment.html?sodId=' + sid);
                }
            }
        },
        error: function (data) {
            jems.mboxMsg("network error!");
        }
    });

};

function dialogMsgATip(msg, sid) {
    mbox.open({
        width: "90%",
        height: 100,
        content: "<p class='tc f15' style='width:100%'>" + msg + "</p>",
        closeBtn: [false, 1],
        btnName: ['继续购买', '删除订单'],
        btnStyle: ["color: #0e90d2;", "color: #0e90d2;"],
        maskClose: false,
        yesfun: function () {
            jems.defaults();
        },
        nofun: function () {
            cancelSod(sid);
        }
    });
};

function cancelSod(id) {
    if (id == null || id == "" || typeof(id) == undefined) {
        jems.mboxMsg("获取订单失败，请刷新");
        return;
    }
    mbox.open({
        width: "90%",
        height: 100,
        content: "<p class='tc f15' style='width:100%'>确定要删除吗？</p>",
        closeBtn: [false, 1],
        btnName: ['确定', '取消'],
        btnStyle: ["color: #0e90d2;"],
        maskClose: false,
        yesfun: function () {
            $.ajax({
                type: "post",
                data: {"sodId": id},
                url: msonionUrl + "sodrest/cancelSod",
                dataType: "json",
                asyn: false,
                success: function (data) {
                    if (data.flg == 1) {
                        jems.goUrl('order-all.html');
                    } else {
                        jems.mboxMsg("删除失败");
                    }
                },
                error: function (data) {
                    jems.mboxMsg("network error!");
                }
            });
        }
    });
};

/**
 * 确认收货
 * @param id
 */
function sureOrder(id) {
    if (id == null || id == "" || typeof(id) == undefined) {
        jems.mboxMsg("获取订单失败，请刷新");
        return;
    }
    mBox.open({
        width: "80%",
        content: "<p class='f14' style='width:100%;'><span class='red'>请慎点！</span>确认收货之后将不能再申请退款，请确保您购买的商品已全部收到并确认无任何破损。</p>",
        closeBtn: [false, 1],
        btnName: ['确定', '取消'],
        btnStyle: ["color: #0e90d2;", "color: #0e90d2;"],
        maskClose: false,
        yesfun: function () {
            $.ajax({
                type: "post",
                data: {"sodId": id},
                url: msonionUrl + "sodrest/comfirmReceipt",
                dataType: "json",
                asyn: false,
                success: function (data) {
                    if (data.errCode > 0) {
                        window.location.reload();
                    } else {
                        jems.mboxMsg("确认失败，");
                    }
                },
                error: function () {
                    jems.mboxMsg("network error!");
                }
            });
        }
    });
}

/**
 * 团购订单退款
 * @param sodId 团购订单号
 */
function createTdSodGroup(sodId) {
    $.ajax({
        type: "post",
        data: {"sodId": sodId},
        url: msonionUrl + "sodgroup/createTdSodGroup",
        dataType: "json",
        success: function (data) {
            if (data.errCode == 10000) {
                jems.mboxMsg("已提交退款申请,请勿重复提交");
                window.location.href = '../ucenter/order-refund.html';
            } else {
                jems.mboxMsg(data.errMsg);
            }
        },
        error: function () {
            jems.mboxMsg("network error!");
        }
    });
}

function goToPage(isGroup, id,type,parentId) {
    if (isGroup == 1) {
        jems.goUrl('../group-details.html?id=' + id);
    }
    else {
    	if(undefined != type && 1 == type){
    		jems.goUrl('../foreign-detail.html?id=' + parentId);
    	}else{
    		 jems.goUrl('../goods-details.html?id=' + id);
    	}
    }
}

