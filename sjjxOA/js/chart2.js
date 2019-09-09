//初始化
var barData = [],barTime = [],pieData = [],
    createTime = "",
    beginTime = "",
    endTime = "",
    shopName = "";


$(function(){
    getStoreName();
    getBarList()
    //pie()
    getPieList()
    
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

                        html += `<option>${res.data[index]}</option>`
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
            beginTime:beginTime,

            endTime : endTime,

            shopName:shopName
        },

        success : function(res){


            if(res.code == 200){
                $("#pieCanv").children().show();
                $("#main").children().show();
                
                barData.splice(0);
                barTime.splice(0);

                if(res.data.length > 0){ 

                    $.each(res.data,function(index,item){

                        barData.push(item.nums);
                        barTime.push(item.createTime);

                    })
                    

                    bar(barData,barTime);

                    getPieList();

                }else{
                    $("#pieCanv").children().hide();
                    $("#main").children().hide();
                    $("#main").append(`<p id="mainP" style="font-size:30px;text-align:center;"><i class="Hui-iconfont">&#xe706;</i>未查询到相关数据!</p>`);   

                }

            }else{

                $("#main").append("<tr class='text-c'><td colspan='4'><mark>未查询到相关数据!</mark></td></tr>");
            }
        }
    })
}


/******** 获取成功率*********** */

function getPieList(){
    $.ajax({

        type : "post",

        url : urls + "/sjjxPddGoodsLogs/pieAllData",

        dataType : "json",

        headers : {"authorization" : authorization},

        data : {
            createTime : createTime,
            beginTime : beginTime,
            endTime : endTime,
            shopName : shopName
        },

        success : function(res){
            console.log(6666666)

            if(res.code == 200){

                if(res.data.length > 0){

                    pieData.splice(0)

                    var color = "";

                    $.each(res.data,function(index,item){

                        if(item.type == 0){
                            item.name = "未处理";
                            color = {color:'#aaa'}
                        }
                        if(item.type == 1){
                            item.name = "成功";
                            color = {color : '#4a95f6'}
                        }
                        if(item.type == 2){
                            item.name = "失败";
                            color = {color : '#dd514c'}
                        }
                        var obj = {
                            name : item.name,
                            value : item.nums,
                            itemStyle : color
                        }

                        pieData.push(obj)

                    });

                    pie(pieData);

                }

            }else{
                
                layer.msg(res.msg,{icon:5});

            }
        },

        error : function(res){

            errorMsg(res);
        }
    })

}





/*********柱状图********* */
function bar(barData){

//初始化echarts
var myChart1 = echarts.init(document.getElementById("main"));

myChart1.showLoading();

var rot = "";

barData.length >10 ? rot = 90 : rot = 0;

option = {
    
    title : {text : "每日上架量"},

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
    $("#mainP").remove();
    
    shopName = $("#storeChoose").val();
    if(shopName == "全部店铺"){
        shopName = "";
    }

    createTime = "";

    beginTime = $("#beginTime").val();

    endTime = $("#endTime").val();

    getBarList();

    

})


