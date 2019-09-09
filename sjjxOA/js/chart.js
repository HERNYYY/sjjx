
$(function(){
    getStoreName();
    getBarList()

    
})


/********** 获取店铺 ********** */

function getStoreName(){

    $.ajax({

        type : "post",

        url : urls + "/sjjxPddGoodsLogs/selectUserShop",

        dataType : "json",

        headers : {"authorization" : authorization},

        success : function(res){

            if(res.code == 200){

                if(res.data.length > 0){

                    var html = "";

                    $.each(res.data,function(index,item){
                        html += `<option value="${item}">${res.data[index]}</option>`
                    });

                    $("#storeChoose").append(html);

                }else{
                
                layer.msg("您暂未绑定任何店铺，请先绑定店铺",{icon:0});

                }

            }else{

                layer.msg(res.msg,{icon:5});

            }
        },
        error:function(res){

            errorMsg(res)

        }
    })
}




/****** 获取上传数据******* */

function getBarList(){

    $.ajax({

        type : "post",

        url : urls + "/sjjxPddGoodsLogs/barList",

        dataType : "json",

        headers : {"authorization" : authorization},

        data : {
            beginTime:$('#beginTime').val(),

            endTime : $('#endTime').val(),

            shopName:$('#storeChoose').val()
        },

        success : function(res){
            $('#main').children().remove()

            if(res.code == 200){

                if(res.data.length > 0){ 
                    let barData =[],barTime=[]
                    $.each(res.data,function(index,item){

                        barData.push(item.nums);
                        barTime.push(item.createTime);

                    })
                
                    bar(barData,barTime);
                    getPieList();
                }else{
                    $('#pieCanv').children().remove()
                    $("#main").append(`<p style="font-size:30px;text-align:center;"><i class="Hui-iconfont">&#xe706;</i>未查询到相关数据!</p>`);
                    $('#main p').css('padding','100px').css('background','#5bc0de').css('color','#fff')    
                    // $("#pieCanv").append(`<p style="font-size:30px;text-align:center"><i class="Hui-iconfont">&#xe706;</i>未查询到相关数据!</p>`);
                }

            }else{
                $('#pieCanv').children().remove()
                $("#main").append(`<p style="font-size:30px;text-align:center"><i class="Hui-iconfont">&#xe706;</i>数据接口报错!</p>`);
                $('#main p').css('padding','100px').css('background','#5bc0de').css('color','#fff')
                // $("#pieCanv").append(`<p style="font-size:30px;text-align:center"><i class="Hui-iconfont">&#xe706;</i>未查询到相关数据!</p>`);
            }
        }
    })
}


/******** 获取成功率*********** */

function getPieList(createTime){
    $.ajax({

        type : "post",

        url : urls + "/sjjxPddGoodsLogs/pieAllData",

        dataType : "json",

        headers : {"authorization" : authorization},

        data : {
            createTime:createTime,
            beginTime:$('#beginTime').val(),
            endTime:$('#endTime').val(),
            shopName:$('#storeChoose').val()
        },

        success : function(res){
           
            if(res.code == 200){

                if(res.data.length > 0){

                    let pieData = [];

                    $.each(res.data,function(index,item){

                        item.type == 0 ? item.name = "未处理" : (item.type == 1 ? item.name = "成功" : item.name = "失败");

                        var obj = {
                            name : item.name,
                            value : item.nums
                        }

                        pieData.push(obj)

                    });

                    pie(pieData);

                }

            }
        },

        error : function(res){

            errorMsg(res);
        }
    })

}





/*********柱状图********* */
function bar(barData,barTime){

//初始化echarts
var myChart1 = echarts.init(document.getElementById("main"));

myChart1.showLoading();

var rot = "";

barData.length >10 ? rot = 90 : rot = 0;

option = {
    
    title : {text : "每日上架分布情况"},

    tooltip : {},

    xAxis : {
        data : barTime,
        axisLabel: {  
            interval : 0,  
            rotate : rot,
            clickable : true,  
         }  
    },

    yAxis : {name:"上架数(件)"},

    legend : {data:["上架量"]},

    series : [
        {
            name : "上架量",

            type : "bar",

            data : barData,

            itemStyle : {
                normal : {
                    color : new echarts.graphic.LinearGradient(
                        0,0,0,1,
                        [
                            {offset: 0, color: '#2378f7'},
                            {offset: 0.7, color: '#2378f7'},
                            {offset: 1, color: '#83bff6'}
                        ]
                    ),
                    label : {
                        show : true,
                        position : 'top',
                        textStyle : {
                            color : "#000",
                            fontSize : 10
                        }
                    }
                }
            }
        },

    ]
}

myChart1.setOption(option);

myChart1.hideLoading();

myChart1.on("click",function(params){
    
    createTime = params.name;

    getPieList(createTime);
})

}




/********* 饼状图 *********/
function pie(pieData){

    var myChart2 = echarts.init(document.getElementById("pieCanv")).setOption({

        title : {
    
            text : "上架成功率",
    
            x : "center"
        },
    
        tooltip : {
    
            trigger : "item",
    
            formatter : "{a} <br/>{b} : {c} ({d}%)"
        },
    
        series : {
    
            type : "pie",
    
            name : "上架结果",
    
            radius : "55%",
    
            center : ["50%","60%"],
    
            data : pieData,
    
            itemStyle : {
                emphasis : {
                    shadowBlur : 10,
                    shadowOffsetX : 0,
                    shadowColor : "rgba(0,0,0,0.5)"
                },
                normal : {
                    label : {
                        show : true,
                        formatter : '{b} : {c} ({d}%)'
                }
            },   
            }
        }
    
    })
}




/********** 筛选 ******* */
$("#ScreeningChart").click(function(){

    getBarList();
})


