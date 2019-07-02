$(function () {
    initLeftChart();
    initRightChart();
});
var initLeftChart = function () {
    /*使用echarts数据可视化*/
    /*1. 获取 https://github.com/apache/incubator-echarts*/
    /*2. 导入 只有一个核心文件 ecahrts.min.js*/
    /*3. 准备绘图的容器  一个dom容器即可*/
    /*4. 然后就可以通过 echarts.init 方法初始化一个 echarts 实例
    并通过 setOption 方法生成一个简单的柱状图，下面是完整代码。*/
    var dom = document.querySelector('.picTable');
    var myEcharts = echarts.init(dom);
    var data = [
        {title:'第一季度',num:100},
        {title:'第二季度',num:200},
        {title:'第三季度',num:400},
        {title:'第四季度',num:120},
        {title:'第五季度',num:490}
    ];
    //拼凑需要的数据格式
    var tData = [],dData = [];
    data.forEach(function (item,i) {
        tData.push(item.title);
        dData.push(item.num);
    });
    /*设置配置参数*/
    var option = {
        /*设置完毕*/
        title: {
            text: '2018年的注册人数统计'
        },
        tooltip: {},
        legend: {
            data:['注册人数']
        },
        xAxis: {
            data: tData
        },
        yAxis: {},
        series: [{
            name: '注册人数',
            type: 'bar',
            data: dData
        }]
    };
    /*使用配置项*/
    myEcharts.setOption(option);
};
var initRightChart = function () {
    /*实现饼状图*/
    var data = [
        {brand:'耐克',num:100},
        {brand:'回力',num:322},
        {brand:'双星',num:453},
        {brand:'老北京',num:1232},
        {brand:'宝马',num:99},
    ];
    var dom = document.querySelector('.picTable:last-child');
    var myEcharts = echarts.init(dom);

    var lData = [],dData = [];
    data.forEach(function (item,i) {
        lData.push(item.brand);
        dData.push({
            name:item.brand,
            value:item.num
        });
    });

    var option = {
        title : {
            text: '品牌销售情况',
            subtext: '2018年',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: lData
        },
        series : [
            {
                name: '品牌销售',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:dData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myEcharts.setOption(option);
};