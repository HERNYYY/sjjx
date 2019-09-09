//判断接口
var interlinkage_w = "https://mms.pinduoduo.com/open.html?response_type=code&client_id=510c54a8ae5b40f2a52dc5bae658f1b5 &redirect_uri=http://47.106.216.78/huidiao.jsp",
    interlinkage_q =
        "https://mms.pinduoduo.com/open.html?response_type=code&client_id=9e7bd373054c4024922a8b031fe79b49&redirect_uri=http://www.91mmm.xin/pdd";

var linkArray = [interlinkage_w,interlinkage_q];
var type = 1;

function getCode() {
    $.ajax({
        type: "get",

        url: urls + "/sjjxShop/selectShopType",

        dataType: "json",

        headers: { "authorization": window.localStorage.getItem("authorization") },

        async: true,

        success: function (res) {
            if (res.code == 200) {
                
                type = res.data;
                if(type  == 1){
                    window.open(linkArray[0]);
                }
                if(type  == 2){
                    window.open(linkArray[1]);
                }

            } else {

                layer.msg(res.msg, { icon: 5 });

            }
        }
    })

    

}


//绑定code码
$("#codeBtn").click(function () {
    if ($("#addCode").val() !== "" || $("#addCode").val() != null) {

        $.ajax({
            type: "post",

            url: urls + "/sjjxShop/addShop",

            data: {
                type,
                code: $("#addCode").val()
            },

            dataType: "json",

            headers: { "authorization": window.localStorage.getItem("authorization") },

            success: function (res) {

                if (res.code == 200) {

                    layer.msg("添加成功", { icon: 6 },

                        function () {

                            window.parent.location.reload();

                        }
                    );
                } else {

                    layer.msg(res.msg, { icon: 5 });

                }
            },
            error: function (result) {
                if (result.responseText.indexOf('登录') != -1) {

                    window.localStorage.clear();

                    top.location.href = "login.html"

                }
            }
        })

    } else {

        layer.msg("授权码不能为空", { icon: 5 });

        return false;
    }
})