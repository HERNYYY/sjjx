//初始化列表
var pageSize=10,pageNum,type,status,goodsId;
$(function(){

    showPage()

})

//查询
function showPage(){

    $.ajax({

        type : "post",

        url : urls + "/sjjxPddWorkOrder/selectPddWorklist",

        dataType : "json",

        headers : {"authorization" : authorization},

        data : {pageSize,pageNum,type,status,goodsId},

        success : function(res){

            if(res.code == 200){

                totalPage = Math.ceil(res.data.total / pageSize) == 0 ? 1 : Math.ceil(res.data.total / pageSize);
                
                pddList(res.data.data);
                
                showFooter(totalPage, res.data.total);
                
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
							showPage(pageSize, pageNum, type, status, goodsId);
                        }
                        
                    }
                });

            }else{

                layer.msg(res.msg,{icon:5});
            }
        },

        error : function(result){

            errorMsg(result);
        }
    })
}


function pddList(result){
    
    $(".remove").remove();

    if(result.length > 0){

        var html = "";
        
        $.each(result,function(i,k){

            var statusTxt = k.status == 1 ? "未处理" : "已处理";

            var type = k.type == 3 ? `<span class='btn btn-primary-outline radius'>其&emsp;他</span>` : (k.type == 1 ? `<span class='btn btn-success-outline radius'>详情图</span>` : `<span class='btn btn-danger-outline radius'>轮播图</span>`  );
            
            var time = timeStemp(k.create_time);

            html += `
            <tr class='text-c remove'><td>${k.goods_id}</td><td>${k.content}</td><td>${time}</td><td>${statusTxt}</td><td>${type}</td></tr>
            `
        })
            
        $("#productPickets").append(html);

    }else{

        $('#productPickets').append("<tr class='text-c remove'><td colspan='5'><mark>未查询到相关数据!</mark></td></tr>");
    }
}

//点击筛选
$("#ScreeningProduct").click(function(){

    type = $("[name='type']").val();

    status = $("#status").val();

    goodsId = $("#goodsId").val();

    showPage();
})


//页脚
function showFooter(totalPage, totalNum) {
    var footerText = "共" + totalPage + "页 , 数据<span id='totalNum'>" +
             totalNum +  "</span>条&emsp;";
        $('#footer').html(footerText);
}

//获取时间
function timeStemp(timeStemp) {
	var d = new Date(timeStemp);
	var month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
	var date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
	var hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
	var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
	var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
	return d.getFullYear() + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
}