//获取列表信息
$(function(){
    getList()
})





// 搜索+分类联动
$('#city-picker-search').cityPicker({

    dataJson: classifyData,

    renderMode: true,

    search: true,

    linkage: true

});


//商品加载
var type,goodsId,beginCommission,stopCommission,tinyName,catId,pageSize=10,pageNum,MaxcouponAmount,MincouponAmount;
function getList(){
    $('#loading-wrapper').show();

    $.ajax({

        type : "post",

        url : urls + "/sjjxGoodsPdd/selectUserList",

        dataType : "json",

        headers:{"authorization":window.localStorage.getItem('authorization')},

        data : {
            type,

            goodsId,

            beginCommission,

            stopCommission,

            tinyName,

            catId,

            pageSize,

            pageNum,

            MaxcouponAmount,

            MincouponAmount
        },

        success : function(res){
            $('#loading-wrapper').hide();

            if(res.code == 200){

                $(".remove").remove();

                if(res.data.result.length>0){
                    var html = "";
                    $.each(res.data.result,function(i,val){
                        if(val.type == 10){
                            html += `
                            <tr class="text-c remove">
                            <td><input type="radio" value="${val.goodsId}" name="editGoodsId"></td>
                            <td>${val.goodsId}</td>
                            <td>${val.tinyName}</td>
                            <td>${val.commission}</td>
                            <td>${val.couponAmount}</td>
                            <td>${val.catName}</td>
                            <td><span class="btn btn-primary-outline radius statusTxt">修改者：${val.userName}</span></td>
                            </tr>
                            `
                        }else if(val.type == 0){
                            html +=`
                            <tr class="text-c remove">
                            <td><input type="radio" value="${val.goodsId}" name="editGoodsId"></td>
                            <td>${val.goodsId}</td>
                            <td>${val.tinyName}</td>
                            <td>${val.commission}</td>
                            <td>${val.couponAmount}</td>
                            <td>${val.catName}</td>
                            <td><span class="btn btn-success-outline radius statusTxt">未修改</span></td>
                            </tr>
                            `
                        }
                    })
                    $("#productList").append(html)
                    
                    $("#footer").text(`共${Math.ceil(res.data.total / pageSize)}页，数据${res.data.total}条    `)
                }else{
                    $('#productList').append("<tr class='text-c remove'><td colspan='7'><mark>未查询到相关数据!</mark></td></tr>");
                }

                laypage({
					
                    cont: 'page',
                    
                    skin: '#429842',
                    
                    pages: Math.ceil(res.data.total / pageSize), 
                    
                    curr: pageNum || 1, 
                    
                    skip : true,
                    
                    pageSize : pageSize,
                    
                    groups : 3,
                    
                    first: '首页',
                    
                    prev: '上一页',
                    
                    next: '下一页',
                    
                    last: '尾页',
                    
					jump: function(obj, first) { 

						if (!first) {

                            pageNum = obj.curr;


							getList();
						}
					}
				});


            }
        },
        error : function (result){

            if(result.responseText.indexOf('登录') !=-1){

                window.localStorage.clear();

                //top.location.href = "login.html"
                
            }
        }

    })
}


//改变页码
$("#pageSize").on("change",function(){

    pageSize = $("#pageSize").val();

    getList();
})



//点击冒泡
$("#productList").on("click","tr",function(){
    
    if($(this).find("input[type=radio]").is(":checked")){

        $(this).find("input[type=radio]").prop("checked",false);

    }else{

        $(this).find("input[type=radio]").prop("checked",true);

    }
})
$("#productList").on("click","input[type='radio']",function(){

    if($(this).is(":checked")){

        $(this).prop("checked",false);

    }else{

        $(this).prop("checked",true);

    }
})



//筛选
$("#ScreeningProduct").click(function(){

    type = $("#status").find("option:selected").val();

    goodsId = $("#goodsId").val();
  
    beginCommission = $("#beginCommission").val()
    
    stopCommission = $("#stopCommission").val();
    
    pageSize = $("#pageSize").val();
  
    tinyName = $("#tinyName").val();

    MaxcouponAmount = $("#MaxcouponAmount").val();

    MincouponAmount = $("#MincouponAmount").val();

    userDistrictId = $('[ name="userDistrictId"]').val();
    
	userStreet = $('[ name="userStreet"]').val();
   
    userStreet !== "" ? catId = userStreet : catId = userDistrictId;
    
    getList();
})





// 判断是否勾选商品->跳转商品上架/详情
function product_select(title,content){

    var uploadGoodsId = $("#productList input[type='radio']:checked").val();
    
    if(uploadGoodsId != undefined){

        window.localStorage.setItem("uploadGoodsId",uploadGoodsId);

        var index = layer.open({
                type: 2,
                title,
                content
            });
            layer.full(index);

            $(window).resize(function() {
                layer.full(index);
            })

    }else{
        layer.msg("请选择商品",{icon:2});
    }
}


//修改商品按钮
$("#updateProduct").click(function(){

    product_select("修改商品","product-editor.html")

})

// 查看详情按钮
$("#product_details").click(function(){
    
    product_select("查看详情","product-details.html")

})


//折叠---二级菜单
jQuery.Huifold = function(obj, obj_c, speed, obj_type, Event) {

    $(obj).find("b").html("-");
    $(obj_c).show();
    $(obj).bind(Event, function() {
        if ($(this).next().is(":visible")) {
            if (obj_type == 2) {
                return false
            } else {
                $(this).next().slideUp(speed).end().removeClass("selected");
                $(this).find("b").html("+")
            }
        } else {
            if (obj_type == 3) {
                $(this).next().slideDown(speed).end().addClass("selected");

                $(this).find("b").html("-")
            } else {
                $(obj_c).slideUp(speed);
                $(obj).removeClass("selected");
                $(obj).find("b").html("+");
                $(this).next().slideDown(speed).end().addClass("selected");
                $(this).find("b").html("-")
            }
        }
    })
}

$(function() {
    $.Huifold("#Huifold1 .item h4", "#Huifold1 .item .info", "fast", 3, "click");
});
