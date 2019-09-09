//切换账户
$("#changeUser").on("click", function() {

    window.localStorage.clear();

    top.location.href = "login.html"

});


//消息弹出框
$("#msgBtn").click(function(){

    layer.open({
        type : 2,

        title : "消息中心",

        content : "msg.html",

        area : ["500px","300px"]


    })
})
$(function(){
    $.ajax({
        type : "post",

        url : urls + "/sjjxUpdateNotice/selectUpdateNotice",

        dataType : "json",
        
        headers : {"authorization" : authorization},

        success : function(res){

            if(res.code == 200){

                if(res.data.notReadTotal>0){

                    $("#msgNum").show();

                }
            }
        }
    })
})
