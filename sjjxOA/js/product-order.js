//输入框字数
$("textarea").on("input",function(){

    var len =  ($(this).val().replace(/\s*/g, "")).length;
 
    var count = 1200 - len;

    $("#count").text(count);
})


//提交按钮
$("#OrderList").click(function(){

    var goodsId = $("#goodsId").val();

    var type = $("#orderType").find("option:selected").val();

    var content = $("#content").val();

    console.log(goodsId,type,content)

    if(!goodsId || !type || !content){

        layer.msg("请填写信息",{icon:5});

        return;
    }

    $.ajax({

        type : "post",

        url : urls + "/sjjxPddWorkOrder/pddWorkList",

        dataType : "json",

        headers:{"authorization" : authorization},

        data : {goodsId,type,content},

        success : function(res){

            if(res.code == 200){

                layer.msg(res.data,{icon:1},
                    
                function(){

                    location.replace(location.href)

                });

            }else{

                layer.msg(res.data,{icon:2});

            }
        },

        error : function(result) {

            errorMsg(result);
        }
            
    })
})