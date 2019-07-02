$(function () {
    /*1. 区域滚动效果*/
    // mui('.mui-scroll-wrapper').scroll({
    //     indicators: false
    // });

    /*2. 页面初始化的时候  下拉渲染列表 */
    /*2.1 获取地                    址栏的搜索关键字  设置给搜索框*/
    /*2.2 去后台获取数据*/
    /*2.3 在获取的过程中  显示下拉刷新的效果*/
    /*2.4 当获取数据成功  终止下拉刷新效果  渲染当前列表*/

    /*3. 当上拉加载操作的时候  追加列表内容到当前页面*/
    /*3.1 实现上拉加载效果*/
    /*3.2 触发上拉加载之后 去获取数据*/
    /*3.3 渲染成html的内容*/
    /*3.4 追加当当前的列表中*/
    /*3.5 结束上拉加载效果*/

    /*4. 点击搜索 重新根据当前的关键字 进行搜索*/
    /*4.1 绑定搜索点击事件*/
    /*4.2 点击的时候去获取关键字*/
    /*4.3  下拉刷新效果 获取数据 + 渲染列表 + 替换*/

    /*5. 排序*/
    /*5.1 样式的切换功能*/
    /*5.1.1 默认都是未选中 箭头朝下*/
    /*5.1.2 当去点未选中的时候  选中即可  其他排序重置样式*/
    /*5.1.2 当去点已选中的时候  只需操作箭头的方向 */
    /*5.2 排序功能*/
    /*5.2.1 根据类型 price 1升序，2降序  num 1升序，2降序 */
    /*5.2.2 重新获取数据渲染列表 */
    //注意 只能发一种排序方式给后台
    new App();

    /*在传递参数的是 用户不小心安装我们的规则 写了 a&name=xx 关键字程序bug*/
    /*地址栏传参在IE低版本浏览器中文会乱码*/
    /*根源：能输入特殊字符和中文字符进行搜索 */
    /*转码  URL编码*/


    /*测试下拉刷新*/
    //初始化组件的api
    /*mui.init({
        /!*对象的属性 具体的插件名字*!/
        pullRefresh:{
            /!*配置项*!/
            container:'.mui-scroll-wrapper',//组件的容器
            /!*拉的类型*!/
            down:{
                /!*配置下拉过程当中的功能*!/
                /!*有默认值 下拉文字提示  松手的文字提示  加载中文字提示  拉动的距离触发效果 *!/
                /!*默认不主动触发下拉效果*!/
                auto:true,
                /!*触发刷新之后 做什么事情*!/
                callback:function () {
                    var that = this;
                    /!*渲染列表  获取数据 渲染 时间消耗*!/
                    setTimeout(function () {
                        //清除下拉刷新效果
                        that.endPulldownToRefresh();
                    },1000);
                }
            }
        }
    });*/

});
var App = function () {
    //待渲染列表
    this.$list = $('.lt_product');
    //排序元素
    this.$order = $('.lt_order');
    //获取地址栏的参数数据  key
    this.key = lt.getParamsByUrl().key || '';
    //获取搜索框
    this.$searchInput = $('.lt_search input');
    //搜索框元素
    this.$searchButton = $('.lt_search a');
    //后台需要的传参
    this.page = 1;

    //初始化
    this.init();
};
App.prototype.init = function () {
    var _this = this;
    //设置搜索框的内容和地址栏参数一致
    _this.$searchInput.val(_this.key);
    //初始化下拉效果
    mui.init({
        pullRefresh: {
            container: '.mui-scroll-wrapper',
            indicators: false,
            down: {
                auto: true,
                callback: function () {
                    //刷新永远的第一页
                    _this.page = 1;

                    var that = this;
                    // setTimeout(function () {
                    //     that.endPulldownToRefresh();
                    // }, 1000);

                    _this.render(function (data) {
                        //模板渲染列表
                        _this.$list.html(template('list', data));
                        //渲染完毕之后 结束下拉刷新效果
                        that.endPulldownToRefresh();
                        //重置上拉加载效果
                        that.refresh(true);
                    });
                }
            },
            up: {
                callback: function () {
                    //下一页
                    _this.page++;
                    var that = this;
                    //渲染完毕之后 结束上拉加载效果
                    _this.render(function (data) {
                        //模板渲染列表
                        _this.$list.append(template('list', data));
                        //如果没有数据  结束上拉加载效果同时 提示用户 没有更多数据了
                        // 默认传递的是false
                        that.endPullupToRefresh(data.data.length === 0);
                    });
                }
            }
        }
    });
    _this.bindEvent();
};
//渲染列表
App.prototype.render = function (callback) {
    var _this = this;
    $.ajax({
        url: '/product/queryProduct',
        type: 'get',
        data: $.extend({
            proName: _this.key,
            page: _this.page,
            pageSize: 4
            //给对象扩展属性  就不用预留属性名称去赋值
        },_this.orderParam),
        dataType: 'json',
        success: function (data) {
            //让大家加载中的效果
            setTimeout(function () {
                //其他业务
                callback && callback(data);
            }, 500);
        }
    });
};
//绑定事件
App.prototype.bindEvent = function () {
    var _this = this;
    _this.$searchButton.on('tap', function () {
        var key = $.trim(_this.$searchInput.val());
        if (!key) {
            mui.toast('请输入关键字');
            return;
        }
        //赋值给ajax的传参
        _this.key = key;
        //主动触发下拉刷新去渲染列表
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });
    //排序
    _this.$order.on('tap', 'a', function () {
        var $current = $(this);
        /*判断是否选中*/
        if ($current.hasClass('now')) {
            /*已选中*/
            var $span = $current.find('span');
            if ($span.hasClass('fa-angle-down')) {
                $span.addClass('fa-angle-up').removeClass('fa-angle-down');
            } else {
                $span.removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        } else {
            /*未选中*/
            /*去除所有的样式*/
            var $all = _this.$order.find('a');
            $all.removeClass('now');
            $all.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            //给自己加
            $current.addClass('now');
        }

        /*定义需要发送给后台的数据*/
        var orderType = $current.data('type');
        var orderValue = $current.find('span').hasClass('fa-angle-down') ? 2 : 1;
        //值传一种排序给后台
        _this.orderParam = {};
        _this.orderParam[orderType] = orderValue;
        //主动触发下拉刷新去渲染列表
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });
};