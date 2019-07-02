$(function () {
    new App();
});
var App = function () {
    /*渲染的容器*/
    this.$cart = $('#cart');
    /*金额容器*/
    this.$amount = $('.lt_trade span');
    this.init();
};
//初始化
App.prototype.init = function () {
    var _this = this;
    /*初始化 下拉刷新效果*/
    mui.init({
        pullRefresh: {
            container: '.mui-scroll-wrapper',
            indicators: false,
            down: {
                auto: true,
                callback: function () {
                    var that = this;
                    // setTimeout(function () {
                    //     that.endPulldownToRefresh();
                    // },1000)
                    _this.render(function () {
                        that.endPulldownToRefresh();
                    });
                }
            }
        }
    });
    _this.bindEvent();
};
//渲染
App.prototype.render = function (callback) {
    var _this = this;
    lt.ajax({
        type: 'get',
        url: '/cart/queryCart',
        data: {},
        dataType: 'json',
        success: function (data) {
            //模拟延时
            setTimeout(function () {
                //渲染
                _this.cartList = data;
                _this.$cart.html(template('cartTpl', _this.cartList));
                callback && callback();
            }, 500);
        }
    });
};
//绑定事件
App.prototype.bindEvent = function () {
    var _this = this;
    /*刷新操作*/
    $('.lt_topBar .right').on('tap', function () {
        /*主动触发一次下拉效果 就可以进行一次加载*/
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });
    /*删除按钮点击事件*/
    _this.$cart.on('tap', '.fa-trash', function () {
        _this.deleteCart(this);
    }).on('tap', '.fa-edit', function () {
        _this.editCart(this);
    }).on('change','input',function () {
        //在选中的时候给当前数据 加标识 用来 证明是否被选中
        var cartData = _this.getCartById(this.dataset.id);
        cartData.isChecked = $(this).prop('checked');
        _this.calcAmount();
    });

    /*弹窗的事件*/
    $('body').on('tap', '.lt_pro_Size span', function () {
        $('.lt_pro_Size span').removeClass('now');
        $(this).addClass('now');
    }).on('tap', '.lt_pro_Num span', function () {
        var $input = $('.lt_pro_Num input');
        /*选数量*/
        var type = $(this).data('type');
        var value = $input.val();
        //未知
        var max = $input.data('max') || 10;
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
};
//删除
App.prototype.deleteCart = function (el) {
    var _this = this;
    /*1. 弹窗确认对话框*/
    /*2. 取消  默认关闭对话框  滑块归位*/
    /*3. 确认  默认关闭对话框 发删除请求*/
    /*4. 响应成功 重新渲染列表*/
    /*5. 响应失败 提示相关错误信息*/
    mui.confirm('您确认要删除改商品吗?', '温馨提示', ['取消', '确认'], function (e) {
        if (e.index === 0) {
            //取消
            mui.swipeoutClose(el.parentNode.parentNode);//当前列表的dom对象 li
        } else {
            //确认
            lt.ajax({
                url: '/cart/deleteCart',
                type: 'get',
                data: {
                    id: el.dataset.id
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                        /*成功*/
                        //重新发请求
                        //mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                        //不去一个一个的操作DOM  都是为了提高性能
                        _this.cartList.splice(el.dataset.index, 1);
                        _this.$cart.html(template('cartTpl', _this.cartList));
                        _this.calcAmount();
                    } else {
                        /*失败*/
                        mui.toast(data.message);
                    }
                }
            });
        }
    });
};
//编辑
App.prototype.editCart = function (el) {
    var _this = this;
    /*1. 弹窗*/
    /*1.1 弹窗  内容HTML  选择尺码 选择数量  布局出来*/
    /*1.2 弹窗  内容HTML  选择尺码 选择数量  交互效果*/
    /*1.3 弹窗  动态渲染  根据当前商品信息*/
    /*2. 取消  默认关闭对话框  滑块归位*/
    /*3. 确认  默认关闭对话框  发修改请求*/
    /*4. 响应成功 重新渲染列表*/
    /*5. 响应失败 提示相关错误信息*/
    var cartData = _this.getCartById(el.dataset.id);
    var html = template('editTpl', cartData).replace(/\n/g, '');
    //注意：换行在弹窗内自动替换成br标签
    mui.confirm(html, '编辑商品', ['取消', '确认'], function (e) {
        if(e.index == 0){
            mui.swipeoutClose(el.parentNode.parentNode);
        }else{
            var size = $('.lt_pro_Size span.now').data('value');
            var num = $('.lt_pro_Num input').val();
            /*确认*/
            lt.ajax({
                url:'/cart/updateCart',
                type:'post',
                data:{
                    id:cartData.id,
                    size:size,
                    num:num
                },
                dataType:'json',
                success:function (data) {
                    if(data.success){
                        //修改缓存数据 cartList  其实就是修改cartData
                        cartData.size = size;
                        cartData.num = num;
                        //重新渲染列表
                        _this.$cart.html(template('cartTpl', _this.cartList));
                        _this.calcAmount();
                    }else{
                        mui.toast(data.message);
                    }
                }
            });
        }
    });
};
//计算金额
App.prototype.calcAmount = function () {
    /*1. 选择复选框  计算*/
    /*2. 删除  计算*/
    /*3. 编辑  计算*/
    /*思路：选择的时候加一个可以判断是否选中的标识 那么一次遍历即可*/
    var amount = 0;
    this.cartList.forEach(function (item,i) {
        //计算选中的金额
        if(item.isChecked){
            amount += item.num * item.price;
        }
    });
    this.$amount.html(amount.toFixed(2));
};
//根据ID获取列表中的购物车对象数据
App.prototype.getCartById = function (id) {
    var data = null;
    this.cartList.forEach(function (item,i) {
        if(item.id == id){
            data = item;
            return false;
        }
    });
    return data;
};