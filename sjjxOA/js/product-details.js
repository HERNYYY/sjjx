$(function() {

    $('#loading-wrapper').show();
    
	$.ajax({

        type: "GET",
        
        url: urls + "/sjjxGoodsPdd/getGoodsPddInfor",
        
		data: {
			goodsId: window.localStorage.getItem("uploadGoodsId")
        },
        
        dataType: "json",
        
        headers: {'Authorization': window.localStorage.getItem("authorization") },

		success: function(res) {

			$('#loading-wrapper').hide();
			
			if (res.code == 200) {

                pddList(res.data.sjjxGoodsPdd);
                
                skuList(res.data.sjjxSkuSpec);
                
                imgList(res.data.sjjxGoodsImgs);
                
				proList(res.data.sjjxPddGoodsProperty);

			} else {

				layer.msg(res.msg, {icon: 5,});
			}
		}
    });
    

    //返回顶部
	$('#goToTop').hide();

	$(window).scroll(function() {

		if ($(this).scrollTop() > 500) {

            $('#goToTop').fadeIn();
            
		} else {

            $('#goToTop').fadeOut();
            
		}
	});

	$('#goToTop').click(function() {

		$('html ,body').animate({

            scrollTop: 0
            
        }, 300);
        
		return false;
	});

})




// 基本信息
function pddList(list) {

    var pddHtml = "";
    
	if (list.length > 0) {
        
		pddHtml =`
            <label class="form-label col-md-1 col-xs-2">商品价格:</label>
            <div class ="formControls col-md-5 col-xs-10 labelValue">￥ ${list[0].goods_price}</div>
            <label class ="form-label col-md-1 col-xs-2"> 分类: </label>
            <div class = "formControls col-md-5 col-xs-10 labelValue" title = "${list[1].catName}">${list[1].catName}</div>
            <label class = "form-label col-md-1 col-xs-2"> 商品编码: </label>
            <div class = "formControls col-md-5 col-xs-10 labelValue">${list[0].goods_id}</div>
            <label class = "form-label col-md-1 col-xs-2" > 商品名称: </label>
            <div class = "formControls col-md-5 col-xs-10 tinyName labelValue" title = "${list[0].tiny_name}">${list[0].tiny_name}</div>
            `

        $(".sjjxGoodsPdd").append(pddHtml);
        
	} else {
		$(".sjjxGoodsPdd").append("<div class='col-xs-12 text-c'><mark>暂时未有相关商品信息！！！</mark></div>");
	}
}




//图片放大缩小

function ImgScale(obj) {

    $('#scaleModel').show();
    
    var NewImg = "<img src='" + obj.src + "' width='100%'/>";
    
	$('#modelImg').html(NewImg);
}
function closeModel(obj) {

	$('#scaleModel').hide();
}





//商品sku
function skuList(list) {

    var skuHtml = "";
    
	if (list.length > 0) {

		$.each(list, function(index, item) {
            
            var specImg = "";
            
			$.each(item.specList, function(k, v) {

				if (v.specImg != "") {

                    specImg = v.specImg;
                    
				};
            })
            
            skuHtml += `
            <tr class='text-c'>
            <td><img data-original=" ${imgSrc}${specImg} " width='30' height='30' class='lazy radius isShow' onclick='ImgScale(this)'/></td><td>${item.skuName}</td><td>${item.price}</td><td>${item.multiPrice}</td><td>${item.quantity}</td>
            </tr>
                `
        });
        
        $('#sjjxGoodsSku').append(skuHtml);
        

		// 懒加载
		$(".page-container img.lazy").show().lazyload({

            effect: "fadeIn",
            
            threshold: 200,
            
			failure_limit: 20
        });
        
	} else {

        $('#sjjxGoodsSku').append("<tr class='text-c'><td colspan='5'><mark>暂时未有相关规格信息</mark></td></tr>");
        
	}
}





// 详情图片
function imgList(list) {

    var imgHtml = "";
    
	if (list.length > 0) {

		$.each(list, function(index, item) {

            imgHtml +=` 
            <div class='col-xs-2'>
                <img data-original="${imgSrc}${item.url}" width="100%" height="200px" onclick='ImgScale(this)' class='lazy radius imgHover'/>
            </div>
            `
                
        });
        
        $(".sjjxGoodsImgs").append(imgHtml);
        
		// 懒加载
		$(".page-container img.lazy").show().lazyload({

            effect: "fadeIn",
            
            threshold: 200,
            
            failure_limit: 20
            
		});
	} else {

        $(".sjjxGoodsImgs").append("<div class='col-xs-12 text-c'><mark>暂时未有相关商品图片信息！！！</mark></div>");
        
	}
}




// 商品属性参数
function proList(list) {
    
    var proHtml = "";
    
	if (list.length > 0) {

		$.each(list, function(index, item) {

            proHtml += `
            <label class='form-label col-md-1 col-xs-2 tinyName' title="${item.punit}"> ${item.punit} :</label><span class ='formControls col-md-5 col-xs-10 labelValue' title ="${item.vvalue}">${item.vvalue}</span>
            `
        });
        
        $(".sjjxPddGoodsProperty").append(proHtml);
        
	} else {

        $(".sjjxPddGoodsProperty").append("<div class='col-xs-12 text-c'><mark>暂时未有相关商品参数信息！！！</mark></div>");
        
	}
}


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