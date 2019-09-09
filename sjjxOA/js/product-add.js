//获取用户名下所有店铺
var type = 1,accessToken = "";
$(function(){

    $.ajax({

        type : "get",

        url : urls + "/sjjxShop/shopAll",

        dataType : "json",

        headers : {"authorization" : window.localStorage.getItem('authorization')},

        success : function(res){

            if(res.code == 200){

                if(res.data.length>0){

                    var html = ""

                    $.each(res.data,function(index,item){

                        html += `
                            <option id="priceOp" data-token="${item.access_token}" data-type="${item.type}">${item.mall_name}</option>
                        `
                    });
                    
                    $("#storeSelect").append(html);

                    type = res.data[0].type;

                    accessToken = res.data[0].access_token;

                    getPrice()

                }else{

                    layer.msg("您还未添加任何店铺哦",{icon:0});

                }
            }
        },

        error : function (result){

            if(result.responseText.indexOf('登录') !=-1){

                window.localStorage.clear();

                //top.location.href = "login.html"
                
            }
        }
    })
    
})



//运费
function getPrice(){

    $.ajax({

        type : "post",

        url : urls + "/sjjxGoodsPdd/logisticsTemplateGet",

        dataType : "json",

        data : {
            type,
            accessToken
        },

        headers : {"authorization" : window.localStorage.getItem("authorization")},

        success : function(res){

            if(res.code == 200){

                $("#costTemplateId option").not(".default").remove();

                if(res.data.length>0){

                    $.each(res.data,function(index,item){

                        $('#costTemplateId').append( `
                        <option value="${item.template_id}">${item.template_name}</option>
                        `)

                    })
                }else{

                    layer.msg("该店铺目前没有运费模板，请联系管理员添加",{icon:0})

                }

            }
        },

        error : function (res){

            layer.msg(res.msg,{icon:1})

        }
    })
}



//选择店铺改变运费模块
$("#storeSelect").change(function(){
    
    type = $(this).find("option:selected").data("type");

    accessToken = $(this).find("option:selected").data("token");

    getPrice();
    
})



//是否预售->显示时间选择框
$('input[name="isPresell"]').on('click', function() {
	this.checked ? $('#isPresell').show() : $('#isPresell').hide();
});
//预售时间
$(function() {
	var date_now = new Date();
	var year = date_now.getFullYear();
	var month = date_now.getMonth() + 1 < 10 ? "0" + (date_now.getMonth() + 1) : (date_now.getMonth() + 1);
	var date = date_now.getDate() < 10 ? "0" + date_now.getDate() : date_now.getDate();

	$("#presellTime").attr("min", year + "-" + month + "-" + date);
});






/********** 商品上架********/
function productAdd(type,goodsId,accessToken,groupPrice,singlePrice,costTemplateId,groupPeople,shipment,presellTime,isJiaYiPeiShi,isRefundable,isUsed,shopName,isPresell){

    $('#loading-wrapper').show();

    $.ajax({

        type : "post",

        url : urls + "/sjjxGoodsPdd/addShop",

        dataType : "json",

        headers : {"authorization" : window.localStorage.getItem("authorization")},

        data : {

            type,

            goodsId,

            accessToken,

            groupPrice,

            singlePrice,

            costTemplateId,

            groupPeople,

            shipment,

            presellTime,

            isJiaYiPeiShi,

            isRefundable,

            isUsed,

            shopName,

            isPresell
        },

        success : function(res){

            window.localStorage.removeItem("selectedGoodId");

            $('#loading-wrapper').hide();

            $('.confirm').show();

            if(res.code == 200){

                $(".confirm p").html(res.data);

            }else{

                $(".confirm p").html(res.data);

            }
        },

        error : function(res){

            $('#loading-wrapper').hide();

            $(".confirm p").html("该商品暂不能上架")
        }
    })
}




//确认上架
$("#ItemUpshelf").click(function(){

    var goodsId = window.localStorage.getItem("uploadGoodsId");

    var groupPrice = $('#groupPrice').val();

	var singlePrice = $('#singlePrice').val();

    var costTemplateId = $('[name="costTemplateId"]').val();

    var groupPeople = $("#groupPeople").val();

    var shipment = $('input[type="radio"]:checked').val();

    var presellTime =  $('#presellTime').val();

    var isJiaYiPeiShi = $('input[name="isJiaYiPeiShi"]').val();

    var isRefundable = $('input[name="isRefundable"]').val();

    var isUsed = $('input[name="isUsed"]').val();

    var shopName = $("#storeSelect").find("option:selected").text();

    var isPresell = $('input[name="isPresell"]').val();

    var operator_g = $('[name="operator_g"] option:selected').text();

	var operator_s = $('[name="operator_s"] option:selected').text();

    if(accessToken !== ""){

        if (costTemplateId !== "") {

			if (groupPrice >= 0 && singlePrice >= 0) {

                groupPrice += " " + operator_g;
                
                singlePrice += " " + operator_s;

                productAdd(type,goodsId,accessToken,groupPrice,singlePrice,costTemplateId,groupPeople,shipment,presellTime,isJiaYiPeiShi,isRefundable,isUsed,shopName,isPresell);

            }else{

                layer.msg("价格不能小于0",{icon:5});

            }

        }else{

            layer.msg("该店铺目前没有运费模板，请联系管理员添加",{icon:5})

        }

    }else{

        layer.msg("请选择店铺",{icon:5});

    }

})


function layer_close(){
     $('.confirm').hide();
     
    var index = parent.layer.getFrameIndex(window.name);

    parent.layer.close(index);
}
