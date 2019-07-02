$(function () {
    /*1.渲染用户信息*/
    $.ajax({
        type:'get',
        url:'/user/queryUserMessage',
        data:{},
        dataType:'json',
        success:function (data) {
            $('.mui-media-body > span').html(data.username);
            $('.mui-media-body > p').html('手机号码：'+data.mobile);
        }
    });
    /*2.退出登录状态*/
    $('.lt_button a').on('tap',function () {
        $.ajax({
            url:'/user/logout',
            type:'get',
            data:{},
            dataType:'json',
            success:function (data) {
                /*退出成功 去登录页面*/
                if(data.success){
                    location.href = '/mobile/user/login.html';
                }
            }
        });
    })
});