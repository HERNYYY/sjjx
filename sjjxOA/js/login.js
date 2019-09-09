// input button 初始禁用
$(function(){
    $("button").attr("disabled",true);

    $("input").attr("readonly",true);

    getCookie(); 

    //判断是否重新登录
    if(window.localStorage.getItem("loginOut")) {

        layer.open({
            title : "重新登录",
        
            content : "登录过期 请重新登录",
        
            btn : ["确认"],
        
            icon : 7,
        
            yes : function(index,layero){
                
                window.localStorage.clear();

                layer.close(index);
            }
        });
    }

})


// 判断是否安装插件
var bindingCode = "";
$.ajax({
    type: "get",

    url: "http://localhost:8991/getCiphertext",

    dataType: "json",

    success: function(data){

        bindingCode = data.md5;

        $("button").attr("disabled",false);

        $("input").attr("readonly",false);
    },

    error:function(errorMsg){

        layer.open({
            title : "安装提示",

            content : "点击确认按钮下载安装exe",

            icon : 7,

            btn : ["确认"],

            yes : function(index,layero){
                window.location.href = "http://47.92.200.124/active/sign.rar";
                layer.close(index);
            }

        })
    }
})


var urls = "http://47.92.200.124:8090/sjjx";

// 激活
$("#postbtn2").click(function(){

    if(user2.value == "" || upwd2.value == ""){

        layer.msg("用户名或密码不能为空",{icon:5});

        return;

    }
    if(verify.value == ""){

        layer.msg("请填写激活码",{icon:5});

        return;
    }

    $.ajax({

        type : "post",

        url : urls + "/sjjxOauser/verifyCode",

        data : {

            account : user2.value,

            password : upwd2.value,

            code : verify.value,

            bindingCode,


        },

        success:function(response){

            if(response.code == 200){

                layer.msg("账号已激活请重新登陆",

                {
                    icon : 6,
                    time : 3000
                },
                
                function(){

                    window.location.reload();
                    
                })
                
            }else{

                layer.msg(response.msg,{icon:5})

            }
        },

        error:function(errorMsg){

            layer.msg("激活失败",{icon:5})

        }
    })
})





// 登录
function login(){

    if(user1.value == "" || upwd1.value == ""){

        layer.msg("用户名或密码不能为空",{icon:5});

        return;
    }

    if($("#remUpwd").is(':checked')){

        setCookie()

    }else{

        clearCookie()

    }

    loginAjax(user1.value,upwd1.value)

}



function loginAjax(account,password){

    $.ajax({
        type : "post",

        url : urls + "/sjjxOauser/login",
        
        data : {
            account: user1.value,

            password: upwd1.value,
            
            bindingCode
        },

        success:function(response){

            if(response.code == 200){

                var authorization = response.data;

                localStorage.setItem("authorization",authorization);


                layer.msg("登录成功！",
                {
                    icon : 1,
                    time : 3000
                },

                    function(){

                        window.location.href = "main.html";

                    }
                )

            }else{

                layer.msg(response.msg, {icon: 5,time:3000});

            }
        },

        error:function(){

            layer.msg('登陆失败', {icon: 5});

        }
})
}


/********* cookie  *******/
//设置cookie
function setCookie(){

    if($("#remUpwd").is(':checked')){

        var date = new Date();

        date.setTime(date.getTime() + 60*1000*60*24*7);

        $.cookie("login_code",user1.value,{
            expires : date,

            path : "/"
        });

        $.cookie("upwd",upwd1.value,{
            expires : date,

            path : "/"
        });

    }else{
        $.cookie("login_code",null);

        $.cookie("upwd",null)
    }
}



//清除cookie
function clearCookie(){

    var date = new Date();

    date.setTime(date.getTime() - 10000);

    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);

    if(keys){
        for(var i=keys.length;i--;){

            document.cookie = keys[i] + "=0; expire=" + date.toGMTString() + "; path=/";

        }
    }
}

//获取cookie
function getCookie(){
    var login_code = $.cookie("login_code");
    var upwd = $.cookie("upwd");
    if(!login_code || login_code==0){

    }else{
        $("#user1").val(login_code)
    }
    if(!upwd || upwd==0){
        
    }else{
        $("#upwd1").val(upwd);
        $("#remUpwd").attr("checked",true)
    }
}







