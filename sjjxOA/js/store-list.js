//获取店铺数据
$(function(){
    $.ajax({
        type : "get",

        url : urls + "/sjjxShop/shopAll",

        dataType : "json",

        headers : {"authorization" : window.localStorage.getItem('authorization')},

        success : function(res){

            if(res.code == 200){

                $("#total").text(res.data.length);

                //localStorage.setItem("len",JSON.stringify(list.length));
        
                if(res.data.length>0){
        
                    $.each(res.data, function(index,item){
        
                        var html = `
                        <tr class="text-c">
                            <td>${item.owner_id}</td>
                            <td>${item.mall_name}</td>
                            <td>${item.owner_name}</td>
                            <td>${item.expires_in}</td>
                        </tr>
                        `
        
                        $("#shopBody").append(html)
                    })
        
                }else{
        
                    $('#shopBody').append("<tr class='text-c'><td colspan='4'><mark>未查询到相关数据!</mark></td></tr>");
        
                }

            }else{

                layer.msg(res.msg,{icon:5});

            }
        },
        error :function (result){
            if(result.responseText.indexOf('登录') !=-1){

                window.localStorage.clear();

                //top.location.href = "login.html"
                
            }
        }
    })
})




// 刷新店铺
$("#refresh").click(function(){
    $.ajax({
        type : "get",

        url : urls + "/sjjxShop/refreshShop",

        dataType : "json",

        headers : {"authorization" : window.localStorage.getItem('authorization')},

        success : function(res){
            if(res.code == 200){
                layer.msg("刷新成功",{icon:6},
                    function(){
                        location.replace(location.href)
                    }
                )
            }else{
                layer.msg(res.msg,{icon:5})
            }
        },
        error :function (result){
            if(result.responseText.indexOf('登录') !=-1){

                window.localStorage.clear();

                //top.location.href = "login.html"
                
            }
        }
    })
})



// 点击添加店铺
$("#storeAdd").click(function(){
    var index = layer.open({
        type: 2,
        title: "添加店铺",
        content: "store-add.html"
    });
    layer.full(index);

    $(window).resize(function() {
        layer.full(index);
    })
})




//点击查看详情
$("#product_details").click(function(){
    var index = layer.open({
        type: 2,
        title: "商品详情",
        content: "product-details.html"
    });
    layer.full(index);

    $(window).resize(function() {
        layer.full(index);
    })
})



