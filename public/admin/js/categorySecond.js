$(function () {
    /*1. 渲染列表数据*/
    /*2. 渲染分页按钮*/
    /*3. 分页展示功能*/
    /*4. 布局添加弹窗*/
    /*5. 一级分类下拉菜单*/
    /*6. 上传图片功能*/
    /*7. 数据校验功能*/
    /*8. 发请求添加到后台*/
    /*9. 添加成功 关闭模态框 且 渲染第一页*/
    new App();
});
var App = function () {
    /*渲染容器*/
    this.$el = $('.table tbody');
    /*分页容器*/
    this.$pagination = $('.pagination');
    /*添加按钮*/
    this.$addBtn = $('.btn-success');
    /*模态框*/
    this.$modal = $('#addCategory');
    /*下拉菜单容器*/
    this.$dropdown = $('.dropdown');
    //定义 当前页码
    this.pageCurr = 1;
    this.init();
};
App.prototype.init = function () {
    var _this = this;
    _this.render(function (data) {
        _this.renderPagination(data);
    });
    _this.bindEvent();
    _this.initDownMenu();
    _this.initUploadFile();
    _this.initValidator();
    _this.initResetModal();
};
App.prototype.render = function (callback) {
    var _this= this;
    /*渲染列表*/
    $.ajax({
        type:'get',
        url:'/category/querySecondCategoryPaging',
        data:{
            page:_this.pageCurr,
            pageSize:3
        },
        dataType:'json',
        success:function (data) {
            _this.$el.html(template('list',data));
            /*渲染分页*/
            callback && callback(data);
        }
    });
};
App.prototype.bindEvent = function () {
    var _this = this;
    _this.$addBtn.on('click',function () {
        _this.$modal.modal('show');
    });
};
App.prototype.renderPagination = function (data) {
    var _this = this;
    /*使用基于bootstrap分页插件*/
    /*1. 下载 https://github.com/lyonlai/bootstrap-paginator*/
    /*2. 文档 https://www.cnblogs.com/yasmi/articles/4877364.html*/
    /*3. 引入 值需要核心的js文件 bootstrap-paginator.min.js*/
    /*4. 初始化   html <ul class="pagination"> */
    $('.pagination').bootstrapPaginator({
        //如果使用的是bootstrap 3版本
        bootstrapMajorVersion:3,
        /*必要*/
        /*当前页面*/
        currentPage:data.page,
        /*一共几页*/
        totalPages:Math.ceil(data.total/data.size),
        size:'small',
        //绑定点击事件
        onPageClicked:function (event, originalEvent, type,page) {
            /*event jquery事件对象*/
            /*originalEvent 原生js事件对象*/
            /*type 按钮的类型  普通的页面 上一页 上一下 第一页 最后一页 */
            /*page 当前点击的按钮对应的页码  */
            _this.pageCurr = page;
            //每一次的分页都是依赖后台数据进行分页按钮的渲染
            _this.render(function (data) {
                _this.renderPagination(data);
            });
        }
    });
};
App.prototype.initDownMenu = function () {
    var _this = this;
    /*初始化下拉菜单*/
    /*1. 获取一级分类渲染下拉选项*/
    /*2. 选择下拉选项后赋值给按钮*/
    $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        data:{
            page: 1,
            pageSize: 1000
        },
        dataType:'json',
        success:function (data) {
            _this.$dropdown.find('.dropdown-menu').html(template('topCategoryTpl',data));
        }
    });
    _this.$dropdown.on('click','.dropdown-menu a',function () {
        _this.$dropdown.find('.text').html($(this).data('text'));
        /*赋值ID*/
        _this.$modal.find('[name="categoryId"]').val($(this).data('id'));
        _this.$modal.find('form').data('bootstrapValidator').updateStatus('categoryId','VALID');
    });
};
App.prototype.initUploadFile = function () {
    var _this = this;
    /*初始化上传图片插件*/
    /*1. 下载 https://github.com/blueimp/jQuery-File-Upload*/
    /*2. 文档 http://www.jq22.com/jquery-info230*/
    /*3.1 引入  基于jquery  引入jquery*/
    /*3.2 引入  基于jqueryUI组件  引入jquery-ui-widget.js*/
    /*3.3 引入  实现上传的核心文件 jquery.fileupload.js*/
    /*3.4 引入  不是跨域就不需要 jquery.iframe-transport.js*/
    /*4. html结构 <input type="file" >*/
    /*5. 初始化*/
    $('#fileUpload').fileupload({
        /*后台上传图片的接口地址*/
        url:'/category/addSecondCategoryPic',
        /*我发送的图片数据名称是什么*/
        /*上传成功的回调函数*/
        done:function(e,data){
            $('.imgBox').find('img').attr('src',data.result.picAddr);
            _this.$modal.find('[name="brandLogo"]').val(data.result.picAddr);
            _this.$modal.find('form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        },
        /*设置返回图片地址为json数据*/
        dataType:'json'
    });
};
App.prototype.initValidator = function(){
    var _this = this;
    _this.$modal.find('form').bootstrapValidator({
        //隐藏的输入框的内容是js进行修改的
        //不会触发校验 不会修改校验状态 需要手动修改
        excluded:[],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:'请选择顶级分类'
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:'请输入品牌名称'
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'请上传品牌图片'
                    }
                }
            },
        }
    }).on('success.form.bv',function (e) {
        _this.addSecondCategory($(e.target).serialize());
    })
};
App.prototype.addSecondCategory = function (data) {
    var _this = this;
    $.ajax({
        type:'post',
        url:'/category/addSecondCategory',
        data:data,
        dataType:'json',
        success:function (data) {
            if(data.success){
                _this.$modal.modal('hide');
                _this.render(function (data) {
                    _this.renderPagination(data);
                });
            }
        }
    });
};
App.prototype.initResetModal = function () {
    var _this = this;
    _this.$modal.on('hidden.bs.modal',function () {
        var $form = _this.$modal.find('form');
        $form.data("bootstrapValidator").resetForm();
        //$form.trigger('reset');
        //$form[0].reset();
        $form.find('input').val('');
        $form.find('.text').html('请选择');
        $form.find('img').attr('src','/admin/images/none.png');
    });
};