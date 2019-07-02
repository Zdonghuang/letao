$(function () {
    // mui('.mui-scroll-wrapper').scroll({
    //     indicators:false
    // });
    /*1. 下拉刷新效果渲染页面  初始化的时候 自己去下拉*/
    /*1.1 初始化下拉刷新组件*/
    /*1.2 当触发下拉回调函数的时候  获取数据 渲染商品详情*/
    new App();
});
var App = function () {
    /*主体容器*/
    this.$scroll = $('.mui-scroll');
    this.productId = lt.getParamsByUrl().productId;
    this.init();
};
App.prototype.init = function () {
    var _this = this;
    /*初始化组件*/
    mui.init({
        pullRefresh: {
            indicators: false,
            container: '.mui-scroll-wrapper',
            down: {
                auto: true,
                callback: function () {
                    var that = this;
                    _this.render(function () {
                        //结束下拉刷新效果
                        that.endPulldownToRefresh();
                    });
                }
            }
        }
    });
    _this.bindEvent();
};
App.prototype.render = function (callback) {
    var _this = this;
    /*渲染商品详情*/
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'get',
        data: {
            id: _this.productId
        },
        dataType: 'json',
        success: function (data) {
            /*模拟加载时间*/
            setTimeout(function () {
                /*渲染*/
                _this.$scroll.html(template('detail', data));
                /*初始化轮播图*/
                mui('.mui-slider').slider();
                /*回调*/
                callback && callback();
            }, 500);
        }
    });
};

App.prototype.bindEvent = function () {
    var _this = this;
    _this.$scroll.on('tap', '.lt_pro_Size span', function () {
        /*选中尺码*/
        _this.$scroll.find('.lt_pro_Size span').removeClass('now');
        $(this).addClass('now');
    }).on('tap', '.lt_pro_Num span', function () {
        var $input = _this.$scroll.find('.lt_pro_Num input');
        /*选数量*/
        var type = $(this).data('type');
        var value = $input.val();
        var max = $input.data('max');
        if (type == 1) {
            /*加*/
            /*需要和库存比较 */
            if (value >= max) {
                mui.toast('亲库存不足');
                return;
            }
            value++;
        } else {
            /*减*/
            /*需要判断是否至少一件*/
            if (value <= 1) {
                mui.toast('至少买一件');
                return;
            }
            value--;
        }
        /*赋值*/
        $input.val(value);
    });
    /*加入购物车事件*/
    $('.cart').on('tap', function () {
        _this.addCart();
    });
};

App.prototype.addCart = function () {
    var _this = this;
    /*添加购物车*/
    /*1. 检验是否选择了尺码*/
    /*2. 调用后台接口 传递加入购物车数据 */
    /*3. 如果成功   弹窗提示*/
    /*4. 如果失败   */
    /*4.1 如果失败  没有登录  立即跳转登录页 登录成功 原路返回*/
    /*4.1 如果失败  业务逻辑  根据后台提示 进行操作*/
    var $size = _this.$scroll.find('.lt_pro_Size span.now');
    if (!$size.length) {
        mui.toast('请选择尺码');
        return;
    }

    //需要校验登录的接口调用 通通是lt.ajax
    lt.ajax({
        url: '/cart/addCart',
        type: 'post',
        data: {
            productId: _this.productId,
            size: $size.data('value'),
            num: _this.$scroll.find('.lt_pro_Num input').val()
        },
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                /*成功*/
                /*弹窗提示*/
                mui.confirm('亲添加成功,去购物车看看?', '温馨提示', ['取消', '确认'], function (e) {
                    //点击按钮的回调函数
                    //判断点击的是哪个按钮  通过索引去判断
                    if (e.index === 1) {
                        location.href = '/mobile/user/cart.html';
                    }
                });
            } else {
                mui.toast(data.message);
            }
        }
    });

};