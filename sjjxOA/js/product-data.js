var pageSize=10, pageNum, goodsId, type;

function showPage() {

	$.ajax({

        type : "post",
        
        url : urls + "/sjjxPddGoodsLogs/goodslogsList",
        
        dataType : "json",
        
        headers: {'authorization': authorization},
        
		data: {
			pageSize,
			pageNum,
			goodsId,
			type
        },
        
		success: function(response) {

			if (response.code == 200) {

                var totalPage = Math.ceil(response.data.total / pageSize) == 0 ? 1 : Math.ceil(response.data.total / pageSize);
                
                logsList(response.data.data);
                
                showFooter(totalPage, response.data.total);
                
				laypage({
					cont: 'page',
					skin: '#429842',
					pages: totalPage,
					curr: pageNum||1,
					skip:true,
					pageSize:pageSize,
					groups:3,
					first: '首页',
					prev: '上一页',
					next: '下一页',
					last: '尾页',
					jump: function(obj, first) {
					
						if (!first) {
							pageNum=obj.curr;
							showPage();
						}
					}
                });
                
			} else {

				layer.msg(response.msg, {
					icon: 5,
					time: 2000
				});
			}
        },
        error: function(result) {

            $('#skuBtn').removeAttr('disabled', 'disabled');

            if(result.responseText.indexOf('登录') !=-1){

                window.localStorage.clear();
            }
            
			layer.msg("未知错误", {icon: 5});
		}
	})
}

//页脚
function showFooter(totalPage, totalNum) {
    var footerText = "共" + totalPage + "页 , 数据<span id='totalNum'>" +
             totalNum +  "</span>条&emsp;";
        $('#footer').html(footerText);
    }



    
function logsList(list) {

    $(".remove").remove();
    
	if (list.length > 0) {

        var html = "";
        
		$.each(list, function(index, item) {

            var content = item.remake == undefined ? "该上架请求暂时尚未处理" : (item.remake.substring(item.remake.indexOf("[") + 1, item.remake.lastIndexOf("]")));
            
            var time = timeStemp(item.create_time);
            
            var status = item.type == 0 ? "<span class ='btn btn-primary-outline radius statusTxt'>未处理 </span>" : (item.type ==1 ? "<span class='btn btn-success-outline radius statusTxt'>上架成功</span > ":" <span class ='btn btn-danger-outline radius statusTxt' > 上架失败 </span>");
            
            html += "<tr class='text-c remove'><td>" + item.goods_id + "</td><td>" + content + "</td><td>" + time +"</td><td>" + status + "</td > </tr>";
            
        });
        
        $('#productLogs').append(html);
        
	} else {

        totalPage=1;
        
		$('#productLogs').append("<tr class='text-c remove'><td colspan='4'><mark>未查询到相关数据!</mark></td></tr>");
	}
	
}

// 初始化
$(function() {
	showPage(pageSize, pageNum, goodsId, type);

})
// 更改pageSize
$('#pageSize').on("change", function() {
	pageSize = $('[name="pageSize"]').val();
	showPage(pageSize, pageNum, goodsId, type);
});
// 搜索
$('#search').on('click', function() {
	type = $('[name="type"]').val();
	goodsId = $('[name="goodsId"]').val();
	showPage(pageSize, pageNum, goodsId, type);

})
function restock(){
	var index = layer.open({
		title: "重新上架",
		type: 2,
		content: "restock.html"
	})
	$(window).resize(function() {
		layer.full(index);
	})
	layer.full(index);
}




function timeStemp(timeStemp) {
	var d = new Date(timeStemp);
	var month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
	var date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
	var hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
	var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
	var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
	return d.getFullYear() + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
}