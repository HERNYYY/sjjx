var urls = "http://47.92.200.124:8090/sjjx";
//http://47.92.200.124
var imgSrc = "http://qiniuyun.91mmm.xin/";
var httpSrc="https://p0.ssl.qhimgs1.com/sdr/400__/t01074c6ba1e42620fa.png";
var authorization = window.localStorage.getItem("authorization");

//获取用户信息
$(function(){

    function errorLogin(){
        if (window.localStorage.getItem('authorization') == null) {
            
                clearInterval(errorLogin);

                window.localStorage.setItem("loginOut","1");

                top.location.href = "login.html"

            }
    }
    window.setInterval(errorLogin,1000);


    
    $.ajax({
        type : "get",

        url : urls + "/sjjxOauser/getByUser",

        dataType : "json",

        async : true,

        headers : {"authorization" : window.localStorage.getItem('authorization')},

        success : function(res){

            if(res.code == 200){

                $("#admin").text(res.data.user.userName);

                $("#userName").val(res.data.user.userName);

            }
        },
        error :function (result){
            if(result.responseText.indexOf('登录') !=-1){

                window.localStorage.clear();
                
            }
        }
    })
})





//重新登录
function errorMsg(result){

    if(result.responseText.indexOf('登录') !=-1){

        window.localStorage.clear();

        window.localStorage.setItem("loginOut","1");

        top.location.href = "login.html";

        }else{

            layer.msg(result.msg,{icon:5});

        }
    
}
