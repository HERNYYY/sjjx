var isDetails = 0; //通过改变来控制保存修改按钮
var goodsId = window.localStorage.getItem("uploadGoodsId");//获取商品编号
var priceArray = [] , maxPrice;  //初始价格&最高价格




/* **********获取商品信息 ************ */
//初始获取数据
$(function() {

    $('#loading-wrapper').show();
    
	$.ajax({

        type: "GET",
        
        url: urls + "/sjjxGoodsPdd/GoodsDetails",
        
        data: {goodsId: window.localStorage.getItem("uploadGoodsId")},
        
        dataType: "json",
        
		headers: {'authorization': window.localStorage.getItem("authorization")},

		success: function(res) {

			$('#loading-wrapper').hide();

			pddList(res.goods[0]);

			proList(res.proList);

			skuList(res.skuList);

			specList(res.specList);

			imgList(res.imgList);
		}
	});

});

/* ******* 基本信息 ********* */
function pddList(list) {

	isType = list.type;
	if (isType != 10) {
		$("#uploadProduct").attr("disabled", true);
	};

	$("[name='goodsPrice']").val(list.goodsPrice);

	$("[name='catId']").val(list.catId);

	$("[name='tinyName']").val(list.tinyName);
}


//input获取焦点触发事件
$('.details input').focus(function() {

    isDetails = 1;
    
    $("#save").prop("disabled", true);//保存修改禁用
    
    $("#uploadProduct").attr("disabled", true);//上架商品禁用

    console.log($("#save"))
    
    $("#limit").show();//限制字数
    
    var val = $("#tinyName").val().replace(/\s*/g, "");
    
    var remian = 60 - val.length;
    
	$("#count").text(remian)
})


//input输入事件
$('.details input').on('input', function() {

    var val = $("#tinyName").val().replace(/\s*/g, "");
    
    var remian = 60 - val.length;

	if (remian < 10) {

        $("#count").addClass("text-danger");//剩余可输入字数少于10 字体变红
        
	} else {

        $("#count").removeClass("text-danger");
        
    }
    
    $("#count").text(remian);
    
});

//onblur事件
$('.details input').on('blur', function() {

    var val = $("#tinyName").val().replace(/\s*/g, "");

    if(val.length>60){

        layer.msg("输入字数不能超过60个",{icon:0});

    }else{

        $("#limit").hide();

    }

})



//修改基本信息
function updateGoods() {
    isDetails = 0;
    
    //判断标题&价格
    var title = $("#tinyName").val();
    
	if (title.length > 60) {

        title = title.slice(0, 60);
        
	}

	var price = $("#goodsPrice").val();

	if (price == "" || title == "") {

        layer.msg("标题或价格不能为空",{icon: 5});
        
		return;
    }
    
    //正则验证价格格式
	if (!(/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(price)) {

        layer.msg("请输入正确的商品价格",{icon: 5});
        
		return;
    }
    
	if (parseInt(price) > maxPrice * 2) {

        layer.msg("输入的价格不得高于最大单买价两倍",{icon: 5});
        
        $("[name='goodsPrice']").val(maxPrice + 1);
        
    	return;
    
    }
    
	if (parseInt(price) < maxPrice) {

        layer.msg("输入的价格低于最大单买价",{icon: 5});
        
        $("[name='goodsPrice']").val(maxPrice + 1);
        
		return;
	}

    $('#goodsBtn').attr('disabled', 'disabled');
    
	$.ajax({

        type: 'post',
        
        url: urls + '/sjjxGoodsPdd/updateGoodsDetails',
        
		data: {

			goodsId : window.localStorage.getItem("uploadGoodsId"),
			title,
			price,
			catId: $("[name='catId']").val()
        },
        
        headers: {'authorization': window.localStorage.getItem("authorization")},
        
        dataType: 'json',
        
		success: function(res) {

			$('#goodsBtn').removeAttr('disabled', 'disabled');

			if (res.code == 200) {

				layer.msg(res.data, {icon: 6});

			} else {
				layer.msg(res.msg,{icon: 0});
			}
		},
		error: function(result) {

			if(result.responseText.indexOf('登录') !=-1){

            window.localStorage.clear();

            }else{

                layer.msg("修改失败",{icon:5});

            }
        }
	});

	isDetails = 0;

	$("#save").attr("disabled", false);
}










/******** 产品参数 ********/

//获取产品参数
function proList(list) {
	$.each(list, function(index, item) {
		addProAppend(item.punit, item.vvalue);
	});
}

//参数输入框
var isGoodsPro = 0;

$('.goodsPro input').focus(function() {

    isGoodsPro = 1;
    
    $("#save").attr("disabled", "disabled");
    
    $("#uploadProduct").attr("disabled", true);
    
});

//添加参数值
function addProAppend(label, value) {

	var proSpan = "<div class='radius'> <span class='proLables'>" + label + " : " + value +
		"&emsp;<a class='btn btn-secondary size-S radius' onclick='delPro(this)'>删除</a></span></div>";
	$(".proSpan").append(proSpan);

	$('#proLables').val('');

	$('#proValues').val('');
}


function specChange(obj) {
	$(obj).attr("data", "1");
}
//删除参数
function delPro(obj) {

	$(obj).parent().parent().remove();

	isGoodsPro = 1;

	$("#save").attr("disabled", "disabled");

	$("#uploadProduct").attr("disabled", true);
}

//修改商品参数
function updatePro() {

	var proList = encodeURI($('.proLables').text());

	var datas = proList.replace(/\s*/g, "");

	$('#proBtn').attr('disabled', 'disabled');

	$.ajax({

        type : 'post',
        
        url : urls + '/sjjxGoodsPdd/updatePro',
        
		data : {
			datas,
			goodsId
        },
        
        dataType : 'json',
        
		success : function(res) {

			$('#proBtn').removeAttr('disabled', 'disabled');

			if (res.code == 200) {

				layer.msg(res.data, {icon: 6});

			} else {

                layer.msg(res.msg, {icon: 5});
                
			}
		},
		error: function(res) {

			if(res.responseText.indexOf('登录') !=-1){

            window.localStorage.clear();

            }else{

                layer.msg("修改失败",{icon:5});

            }
        }
	});

	isGoodsPro = 0;

	$("#save").attr("disabled", false);


}


//添加参数
function proAdd() {

	var label = $('#proLables').val();

    var value = $('#proValues').val();
    
	if (label == '' || value == '') {

        layer.msg("属性值不能为空 ", {icon: 5});
        
		return;
    }
    
    addProAppend(label, value);

	isGoodsPro = 1;

	$("#save").attr("disabled", "disabled");

	$("#uploadProduct").attr("disabled", true);
}











/*********商品规格与库存******* */
// 获取商品规格

function specList(list) {

	if (list.length > 0) {

        var html = "";

		$.each(list, function(index, item) {

            var url = item.specImg == "" ? httpSrc : (imgSrc + item.specImg);//判断图片地址
            
			html += `
            <tr class='text-c'>
                <td><img class='lazy radius' data-original='${url}' width='30' height='30' onclick='ImgScale(this)'/></td>
                <td><input value='${item.specName}' class='input-text radius specName text-c' onblur='specChange(this)' data='0' data-id='${item.specId}'/></td>
                <td class='specTyep'>${item.specTyep}</td>
            </tr>`
        });   

		// 图片懒加载
		$(".page-container img.lazy").show().lazyload({
			effect: "fadeIn",
			threshold: 200,
			failure_limit: 20
        });
        
        $("#editSpec").append(html);
        
	} else {

        $('#editSpec').append("<tr class='text-c'><td colspan='3'><mark>暂时未有相关规格信息</mark></td></tr>");
        
	}

}

//input失去焦点改变保存按钮
var isgoodsSku = 0;

$("#editSpec").on("focus", "input.specName", function() {

    isgoodsSku = 1;
    
    $("#save").attr("disabled", "disabled");
    
	$("#uploadProduct").attr("disabled", true);
})

//商品库存
function skuList(list) {
	
    $(".remove").remove();
    
	if (list.length > 0) {

        var html = "";

		$.each(list, function(index, item) {

            priceArray.push(item.price);
            
			html +=` 
            <tr class='text-c remove'>
                <td class='text-c'>
                    <span class='skuName '>${item.skuName}</span>
                    <input type='hidden' class = 'skuId' value ='${item.id}'/>
                </td>
                <td class ='price text-c'>${item.price}</td>
                <td class ='multiPrice text-c'>${item.multiPrice}</td>
                <td class ='quantity text-c' data-type='${item.type}'>${item.quantity}</td>
                
            </tr>`;

        });
        
        $("#editSku").append(html);
        
		maxPrice = Math.max.apply(null, priceArray);

	} else {

		$('#editSku').append("<tr class='text-c'><td colspan='5'><mark>暂时未有相关规格信息</mark></td></tr>");

	}
}


// //删除库存
// function delSku(obj) {

//     $(obj).parent().parent().find(".quantity").attr('data-type', '1');
    
//     $(obj).parent().parent().hide();
    
//     isgoodsSku = 1;
    
//     $("#save").attr("disabled", "disabled");
    
// 	$("#uploadProduct").attr("disabled", true);
// }


//修改库存
function updateSku() {

    var skuIds = "";
    
    var isSkuId = true;
    
	var goodsPrice = $("[name='goodsPrice']").val();

	$('.skuId').each(function() {

		if ($(this).val() == "") {

            layer.msg("提交数据不允许有空值",{icon: 5});
            
			isSkuId = false;
        }
        
		skuIds += $(this).val() + ',';

	})
    var isSkuName = true;
    
    var skuName = "";
    
	$('.skuName').each(function() {
		skuName += $(this).text() + ',';
    })
    
    var isSkuPrice = true;
    
    var skuPrice = "";
    
	$('.price').each(function() {
		skuPrice += $(this).text() + ',';

    });
    
    var isMultiPrice = true;
    
    var multiPrice = "";
    
	$('.multiPrice').each(function() {
		multiPrice += $(this).text() + ',';
    });
    
    var isQuantity = true;
    
    var quantity = "";

    var types = "";
	$('.quantity').each(function() {

		quantity += $(this).text().replace(" ", "") + ',';
		types += $(this).attr('data-type') + ',';

	})
	if (!isSkuId || !isSkuName || !isSkuPrice || !isMultiPrice || !isQuantity) {
		return
    }
    
    $('#skuBtn').attr('disabled', 'disabled');
    
	$.ajax({

        type : 'post',
        
        url : urls + '/sjjxGoodsPdd/updateSku',
        
		data: {
			skuIds,
			skuName,
			skuPrice,
			multiPrice,
			quantity,
			goodsId,
			types
        },
        
        dataType: 'json',
        
		headers: {'authorization': window.localStorage.getItem("authorization")},
        
		success: function(res) {

            $('#skuBtn').removeAttr('disabled', 'disabled');
            
			if (res.code == 200) {

				layer.msg(res.data, {icon: 6});

			} else {

                layer.msg(result.msg, {icon: 5});
                
			}
		},
		error: function(result) {

            $('#skuBtn').removeAttr('disabled', 'disabled');

            if(result.responseText.indexOf('登录') !=-1){

                window.localStorage.clear();
            }
            
			layer.msg("修改失败", {icon: 5});
		}
    });
    
	isgoodsSku = 0;

	$("#save").attr("disabled", false);

}



// 修改规格
function updateSpec() {
	var specIds = "";
	var isSpecName = true;
	var specName = "";
	$('.specName').each(function() {
		if ($(this).val() == "") {
			layer.msg("提交数据不允许有空值", {
				icon: 5,
				time: 2000
			});

			isSpecName = false;
		}
		if ($(this).attr("data") != 0) {
			specName += $(this).val() + ',';
			specIds += $(this).attr("data-id") + ',';
		}

	});
	var specTyep = "";
	$('.specTyep').each(function() {
		specTyep += $(this).text().replace(" ", "") + ',';

	})
	if (!isSpecName) {
		return
	}
	$('#specBtn').attr('disabled', 'disabled');
	if (specIds !== "" && specName !== "") {
		$.ajax({
			type: 'POST',
			url: urls + '/sjjxGoodsPdd/updateSpec',
			data: {
				specIds: specIds,
				specNames: specName,
				goodsId: goodsId
            },
            
            dataType: 'json',
            
            headers: {'authorization': window.localStorage.getItem("authorization")},
            
			success: function(result) {


				$('#specBtn').removeAttr('disabled', 'disabled');

				if (result.code == 200) {

					layer.msg("修改成功", {
						icon: 6,
						time: 2000
					});

					skuList(result.data);

					$('.specName').each(function() {

						$(this).attr("data", 0);

					});
				} else {
					layer.msg(result.msg, {
						icon: 5,
						time: 2000
					})
				}
			},
			error: function(e) {

                $('#specBtn').removeAttr('disabled', 'disabled');
                
                if(result.responseText.indexOf('登录') !=-1){

                    window.localStorage.clear();
 
                }

				layer.msg("请求失败", {

					icon: 5,
					time: 2000
				})
			}
		});
	} else {


		layer.msg("修改成功", {
			icon: 6,
			time: 2000
		}, function() {
			$('#specBtn').removeAttr('disabled', 'disabled');
		});

		$('.specName').each(function() {

			$(this).attr("data", 0);

		});
	}
	$('#specBtn').attr('disabled', 'disabled')


	isgoodsSku = 0;

	$("#save").attr("disabled", false);

}










/********* 商品图片 ********* */
// 商品图片
function imgList(list) {
	var len = list.length,
		detailsHtml = "",
		masterHtml = "",
		carouselHtml = "";

	if (len > 0) {
		$.each(list, function(index, item) {

			// 主图
			if (item.type == 11) {
				masterHtml += "<div class='mt-25'><div class='radius'><img data-original='" + imgSrc + item.url +
					"' class='upload_img lazy' onclick='ImgScale(this)' upload-type='0' data-type='" + item.id + "' data='" + item.type +
					"' id='masterImg'/></div><input type='file' name='master' class='upload' accept='image/*' onchange='uploadImgs(this)'/><button type='button' class='btn btn-danger r size-MINI' onclick='imgDel(this)'>删除</button></div>"


			}
			// 轮播图
			if (item.type == 12) {
				carouselHtml += "<div class='mt-25'><div class='radius'><img data-original='" + imgSrc + item.url +
					"' onclick='ImgScale(this)' upload-type='0' data-type='" + item.id + "' data='" + item.type +
					"' class='upload_img lazy'/></div><input type='file' name='carousel' class='upload' id='up' accept='image/*' onchange='uploadImgs(this)' /><button type='button' class='btn btn-danger r size-MINI' onclick='imgDel(this)'>删除</button><button type='button' class='btn btn-secondary r size-MINI' onclick='setMaster(this)'>设置主图</button></div>"


			}
			// 详情图
			if (item.type == 13) {
				detailsHtml += '<div class="mt-25"><div class="radius"><img data-original="' + imgSrc + item.url +
					'" onclick="ImgScale(this)" upload-type="0" data-type="' + item.id + '" data="' + item.type +
					'" class="upload_img lazy"/></div><input type="file" name="details" class="upload"  accept="image/*" onchange="uploadImgs(this)" /><button type="button" class="btn btn-danger r size-MINI" onclick="imgDel(this)">删除</button></div>'

			}
		});
		$(".masterImg h6").after(masterHtml);

		$(".carouselImg h6").after(carouselHtml);

		$(".detailsImg h6").after(detailsHtml);
		// 懒加载
		$(".page-container img.lazy").show().lazyload({

			effect: "fadeIn",
			threshold: 200,
			failure_limit: 20
		});
	}
}
//设置主图
function setMaster(obj) {

	var setUrl = $(obj).parent().find("img").attr("src");

	$("#masterImg").attr("src", setUrl);

	$("#masterImg").attr("upload-type", 1);

	isClick = 1;

	$("#save").attr("disabled", "disabled");

	$("#uploadProduct").attr("disabled", true);
}
//图片修改
function updateImgs() {
	var types = '';
	var imgIds = '';
	var imgUrls = '';

	$('.upload_img').each(function() {

		if ($(this).attr("upload-type") != 0) {

			types += $(this).attr("upload-type") + ',';

			imgIds += $(this).attr('data-type') + ',';

			imgUrls += $(this).attr('src') + ',';

		}

	})
	if (types == '' || imgIds == '' || imgUrls == '') {

		layer.msg("修改成功", {

			icon: 6,
			time: 2000
		});
		return;
	}
	$('.imgsBtn').attr('disabled', 'disabled');
	$.ajax({
		type: 'POST',
		url: urls + '/sjjxGoodsPdd/updatePddImgs',
		data: {
			types: types,
			imgIds: imgIds,
			imgUrls: imgUrls,
			goodsId: goodsId
		},
		headers: {
			'Authorization': authorization
		},
		dataType: 'json',
		success: function(result) {

			$('.imgsBtn').removeAttr('disabled', 'disabled');

			if (result.code == 200) {
				layer.msg(result.data, {
					icon: 6,
					time: 2000
				})

			} else {
				layer.msg(result.msg, {
					icon: 5,
					time: 2000
				})
			}

		},
		error: function(error) {
            if(result.responseText.indexOf('登录') !=-1){

                window.localStorage.clear();
                
            }

			layer.msg("请求失败", {
				icon: 5,
				time: 2000
			})
		}
	});
	isClick = 0;
	$("#save").attr("disabled", false);
}

// 删除图片
function imgDel(obj) {
	$(obj).parent().find("img").attr('upload-type', "2")
	$(obj).parent().hide();
	isClick = 1;
	$("#save").attr("disabled", "disabled");
	$("#uploadProduct").attr("disabled", true);
}
//上传图片
function uploadImgs(obj) {

	var imgId = $(obj).parent().find("img").attr('data-Type');
	var imgType = $(obj).parent().find("img").attr('data');
	var imgs = $(obj)[0].files[0];

	var imgSize = imgs.size / 1024; //图片大小 KB

	//主图大小判断
	if (imgType == '11') {

		if (imgSize > 100) {
			layer.msg("主图大小不能大于100KB", {
				icon: 5,
				time: 2000
			});
			return
		}
	}
	if (imgType == '12' || imgType == '13') {
		if (imgSize > 1024) {

			layer.msg("轮播图大小不能大于1MB", {
				icon: 5,
				time: 2000
			});
			return
		}
	}

	var formData = new FormData();
	formData.append("img", imgs);
	formData.append("type", imgType);
	formData.append("id", imgId);
	formData.append("goodsId", goodsId);
	$.ajax({
		type: 'POST',
		url: urls + '/sjjxGoodsPdd/uploadImgs',
		data: formData,
		processData: false,
		contentType: false,
		headers: {
			'Authorization': authorization
		},
		dataType: 'json',
		success: function(result) {


			if (result.code == 200) {

				layer.msg("上传服务器成功", {
					icon: 6,
					time: 2000
				});
				$(obj).parent().find("img").attr('src', imgSrc + result.data);

				$(obj).parent().find("img").attr('upload-type', '1');
			} else {
				layer.msg(result.msg, {
					icon: 5,
					time: 2000
				});
			}

		},
		error: function(result) {
            if(result.responseText.indexOf('登录') !=-1){

                window.localStorage.clear();
                
            }

			layer.msg("上传服务器失败", {
				icon: 5,
				time: 2000
			});
		}
	});

	isClick = 1;
	$("#save").attr("disabled", "disabled");
	$("#uploadProduct").attr("disabled", true);
};


//图片放大缩小

function ImgScale(obj) {

    $('#scaleModel').show();
    
    var NewImg = "<img src='" + obj.src + "' width='100%'/>";
    
	$('#modelImg').html(NewImg);
}
function closeModel(obj) {

	$('#scaleModel').hide();
}






/****** 保存和上架按钮****** */
// 保存
var isState = 0;

function save() {

	$.ajax({
        type: "post",
        
		url: urls + "/sjjxGoodsPdd/updateUserType",

		data:goodsId,
        
        headers: {'authorization': authorization},
        
		success: function(res) {

			if (res.code == 200) {

				layer.msg(res.data, {icon: 6});

			} else {
				layer.msg(res.msg, {icon: 5});
			}

		},
		error: function(result) {

            if(result.responseText.indexOf('登录') !=-1){

                window.localStorage.clear();
                
            }

			layer.msg("请求失败", {
				icon: 5,
				time: 2000
			});
		}
	});
	isState = 1;
	$("#uploadProduct").attr("disabled", false);
}


$("#uploadProduct").on("click", function() {
	window.location.href = "product-add.html";
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


