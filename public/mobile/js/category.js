$(function(){
    /*1.页面初始渲染*/
    /*1.1 去加载顶级分类的数据*/
    /*1.2 去完成左侧栏的渲染*/
    /*1.3 根据左侧栏的第一个分类去查询它对应的品牌分类数据*/
    /*1.4 去完成右侧品牌分类渲染*/

    /*2.点击顶级分类去渲染右侧的品牌分类*/
    /*2.1 去选中当前点击的分类*/
    /*2.2 根据点击的分类去查询它对应的品牌分类数据*/
    /*2.3 去完成右侧品牌分类渲染*/

    new App();

    /*测试*/
});
/*网页业务对象*/
var App = function(){
    this.$left = $('.lt_cateLeft');
    this.$right = $('.lt_cateRight');
    this.init();
};
App.prototype.init = function () {
    var that = this;
    /*页面初始渲染*/
    that.renderLeft(function (id) {
        that.renderRight(id);
    });
    /*点击顶级分类去渲染右侧的品牌分类*/
    that.bindEvent();
};
App.prototype.bindEvent = function () {
    var that = this;
    //mui给你封装了tap
    that.$left.on('tap','li a',function(){
        that.$left.find('li').removeClass('now');
        $(this).parent().addClass('now');
        //获取当前点击的分类的ID  去查询
        //that.renderRight($(this)[0].dataset.id);
        that.renderRight($(this).data('id'))
    });
};
App.prototype.renderLeft = function (callback) {
    var that = this;
    $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        data:'',
        dataType:'json',
        success:function (data) {
            /*渲染*/
            /*1. 准备数据*/
            /*2. 准备模板*/
            /*3. 通过模板插件的方法 数据+模板 转化成HTML字符串*/
            // 传入一个对象  在模板内 可以取到对象的属性为变量的数据
            that.$left.html(template('leftTpl',data));
            /*一级分类的第一条数据的ID*/
            var id = data.rows[0].id;
            //业务分离
            callback && callback(id);
        }
    });
};
App.prototype.renderRight = function (id) {
    var that = this;
    $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        data:{
            id:id
        },
        dataTye:'json',
        success:function (data) {
            /*渲染*/
            that.$right.html(template('rightTpl',data));
        }
    });
};
