/**
 @Js-name:addres-order.js
 @Zh-name:设置收货地址
 @Author:tyron
 @Date:2017-03-01
 */
$(function(){
    $.ajax({
        type : "get",
        url : msonionUrl+"address/findAddress",
        dataType : "json",
        //jsonp:"callback",
        asyn:false,
        success:function(data){
            var gettpl = $('#indexData').html();
            jetpl(gettpl).render(data, function(html){
                $('#indexList').append(html);
            });
        },
        error:function(data){
            jems.tipMsg("network error!");
        }
    });
    $("#sureOrderAddress").on("tap", function() {
        jems.goUrl('addres-add.html?'+jems.parsURL().queryURL) ;

    });
    /*  $("#sureOrderAddress").on(isTap(), function() { 
     var addressId = "";
     var addressChecked = document.getElementsByName("radio-1-set");		 
     for(var i=0;i<addressChecked.length;i++){
     if(addressChecked[i].checked) {
     addressId = addressChecked[i].value;
     }
     }
     if (addressId == null || addressId == "" || typeof(addressId) == undefined){
     UsTips("先选择收货地址");
     return ;
     }
     $.ajax({
     type : "post",
     data : {"addressId":addressId},
     url : msonionUrl+"address/setOrderAddress",
     dataType : "json",
     asyn:false,
     success:function(data){
     if(data.flg == 2){
     goUrl(parsURL(window.location.href).queryURL);
     } else if (data.flg == 1 ){
     UsTips("登陆超时。");
     }else if (data.flg == 0 ){
     UsTips("保存失败。");
     }
     },
     error:function(data){
     UsTips("network error!");
     }
     });
     });*/
});
function defaultAddress(addressId){
    $.ajax({
        type : "post",
        data : {"addressId":addressId},
        url : msonionUrl+"address/defaultAddress",
        dataType : "json",
        asyn:false,
        success:function(data){
            if(data.flg == 2){
                jems.goUrl(jems.parsURL().queryURL);
            } else if (data.flg == 1 ){
                jems.tipMsg("登陆超时。");
            }else if (data.flg == 0 ){
                jems.tipMsg("保存失败。");
            }
        },
        error:function(data){
            jems.tipMsg("network error!");
        }
    });
}
function editAddress(obj){
    jems.goUrl("addres-edit.html?"+jems.parsURL().queryURL+"&addressId="+obj);
}
function delAddress(addressId){
    mBox.open({
        width:"70%",
        //height:100,
        content:"<p class='tc listinfo f16' style='width:100%'>确定要删除吗？</p>",
        closeBtn: [false,1],
        btnName:['确定', '取消'],
        btnStyle:["color: #0e90d2;"],
        maskClose:false,
        yesfun : function(){
            $.ajax({
                type : "post",
                data : {"addressId":addressId},
                url : msonionUrl+"address/delAddress",
                dataType : "json",
                asyn:false,
                success:function(data){
                    if(data.flg == 1){
                        jems.tipMsg("删除成功。");
                        window.location.reload()
                    } else {
                        jems.tipMsg("删除失败。");
                    }
                },
                error:function(data){
                    jems.tipMsg("network error!");
                }
            });
        } ,
        nofun :  null
    });
}