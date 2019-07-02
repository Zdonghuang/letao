$(function () {
    $('form').on('submit', function (e) {
        //阻止默认的表单提交
        e.preventDefault();
        //进行ajax提交
        //前提：表单元素都有名字 name 属性
        //表单序列化：获取表单内所有的表单元素的数据 以某一种数据格式返回
        // serialize() 某一种数据格式: password=123456&username=zhousg
        // serializeArray()某一种数据格式: [{name:'passoword',value:'123456'},{name:'username',value:'zhousg'}]
        // ajax 支持表单序列化后的数据格式
        $.ajax({
            type: 'post',
            url: '/user/login',
            data: $('form').serialize(),
            dataType: 'json',
            success: function (data) {
                if(data.success){
                    /*成功*/
                    var returnUrl = lt.getParamsByUrl().returnUrl;
                    /*当有来源  回去即可 跳转原地址 */
                    if(returnUrl){
                        location.href = returnUrl;
                    }
                    /*没有来源  跳转个人中心首页*/
                    else{
                        location.href = '/mobile/user/index.html';
                    }
                }else{
                    //根据后台的业务提示用户
                    mui.toast(data.message);
                }
            }
        });
    });
});