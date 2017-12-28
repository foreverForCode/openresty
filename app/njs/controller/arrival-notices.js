/**
 @Js-name:home.js
 @Zh-name:会员中心
 @Author:tyron
 @Date:2017-03-08 
 */ 
$(function(){
    $.ajax({
        type : "post",
        url : msonionUrl+"message/findArrivalMessage?_="+new Date().getTime(),
        dataType : "json",
        success:function(data){
            var json = {data:data}
            if(json == 1){ 
                jems.goUrl("login.html")
            } else if (json == ""){
                $("#no_record").css({display: "block"});
            }else{
                var gettpl = $('#indexData').html();
                jetpl(gettpl).render(json, function(html){
                    $('#indexList').append(html);
                });
            }
            $(window).goTops({toBtnCell:"#gotop",posBottom:50});
        }
    });
    //返回店主中心 
    jems.backStore(); 
      
}); 
/**
 *
 * @param Lid 商品id
 * @param Mid 信息id
 * @param isRead 0未读，1已读
 */
function goDetails(Lid,Mid,isRead){
    if (isRead == 0) {
        $.ajax({
            type : "post",
            data : {"Mid":Mid},
            url : msonionUrl+"message/updateIsRead?_="+new Date().getTime(),
            dataType : "text",
            success:function(){
                //alert(11);
                //alert(data);
            }
        });
    }
    jems.goUrl("../goods-details.html?id="+Lid);
}


