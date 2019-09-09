//初始获取通知
$(function(){
    getMsg()
})

function getMsg(){
    $.ajax({
        type : "post",

        url : urls + "/sjjxUpdateNotice/selectUpdateNotice",

        dataType : "json",
        
        headers : {"authorization" : authorization},

        success : function(res){

            if(res.code == 200){

                if(res.data.data.length > 0){

                    var html = "";

                    for(var item of res.data.data){

                        if(item.type == 1) {
                            
                            html += `
                            <li class="msg-item">
                                <h4 class="msg-title2"><i class="Hui-iconfont">&#xe619;</i> 更新佣金券通知</h4>
                                <p>商品ID&emsp;：<span>${item.goods_id}</span></p>
                                <p class="pname">店铺名称：<span>${item.shop_name}</span></p>
                                <p>消息通知：<span>${item.notice}</span></p>
                                <p class="msgbtn">
                                    <button class="btn btn-secondary radius disabled size-S">已读</button>
                                </p>
                            </li>
                            `

                        };
                        if(item.type == 0){
                            html += `
                        <li class="msg-item">
                            <h4 class="msg-title"><i class="Hui-iconfont">&#xe619;</i> 更新佣金券通知</h4>
                            <p>商品ID&emsp;：<span>${item.goods_id}</span></p>
                            <p class="pname">店铺名称：<span>${item.shop_name}</span></p>
                            <p>消息通知：<span>${item.notice}</span></p>
                            <p class="msgbtn">
                                <button class="btn btn-danger-outline radius size-S" data-id="${item.id}" id="msgRead">标记为已读</button>
                                <button class="btn btn-secondary radius disabled size-S" id="ReadBtn">已读</button>
                            </p>
                        </li>
                        `
                        }
                        
                    }

                    $("#msgBox").append(html);

                }else{

                    $("#msgBox").append(`
                    <p style="text-align:center"><i class="Hui-iconfont" style="font-size:80px">&#xe70b;</i></p>
                    <p style="text-align:center">暂时还没有消息哦</p>
                    `)
                }

            }else{
                
                $("#msgBox").append(`<p style="text-align:center"><mark>${res.msg}</mark></p>`)
            }
        },
        error : function(res){
            
            errorMsg(res);

        }
    })
}

$("body").on("click","#msgRead",function(){

    var $i = $(this).parent().siblings("h4").children();
    console.log($i);
    $i.css("color","#3bb4f2");

    var $btn1 = $(this);
    var $btn2 = $(this).siblings("#ReadBtn");
    var id = $(this).attr("data-id");

    $.ajax({
        type : "get",

        url : urls + "/sjjxUpdateNotice/updateReadType",

        dataType : "json",

        data : {id:id},

        headers : {"authorization" : authorization},

        success : function(res){
            if(res.code == 200){
                $btn1.hide();
                $btn2.css("display","block");
            }
        },
        error : function(res){

            errorMsg(res);
        }
    })
    
})

