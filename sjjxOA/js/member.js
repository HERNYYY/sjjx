//提交用户修改信息

$("#memberUp").click(function(){

    var userName = $("#userName").val();

    var sex = $("input[type = 'radio']").val();

    var oldPwd = $("#oldUpwd").val();

    var password = $("#upwd1").val();

    var upwd2 = $("#upwd2").val();

    if(!oldUpwd || !upwd1 || !upwd2){//判断密码框不能为空

        layer.msg("密码不能为空",{icon:5})

    }else{
        
        if(oldUpwd !== upwd1){//判断新旧密码不能一致

            if(password == upwd2){//确认两次输入密码一致

                $.ajax({

                    type : "post",

                    url : urls + "/sjjxOauser/updateUser",

                    dataType : "json",

                    headers : {"authorization" : authorization},

                    data : {

                        userName,password,sex,oldPwd
                    
                    },

                    success : function(res){

                        if(res.code == 200){

                            layer.msg("修改成功,请重新登录",{icon:6},

                            function(){
                                
                                top.location.href = "login.html";

                            });

                        }else{

                            layer.msg(res.msg,{icon:5})
                        }
                   
                    },

                    error : function(res){

                        errorMsg(res);
                    }
                    
                    
                });



            }else{

                layer.msg("两次输入密码不一致",{icon:5})
            }

        }else{

            layer.msg("新密码不能与旧密码一致",{icon:5});

        }

    }
})