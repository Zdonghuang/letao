/*定义项目中的公用方法*/
// var lt = {};
// /*1. 获取地址栏传参*/
// lt.fn1 = function () {
//
// }
// /*2. ...*/
// lt.fn2 =function () {
//
// };
//处于是否已经存在一个lt的全局对象
if (!window.lt) {
    window.lt = {};
}
/*1. 获取地址栏传参*/
lt.getParamsByUrl = function () {
    /*url http://localhost:3000/mobile/searchList.html?key=3&name=xm*/
    /*params  {key:3,name:xm} */
    //var url = location.href;
    var obj = {};

    //?key=3&name=xm
    var search = location.search; //获取地址栏 传参 ?后的字符串包括问好

    //当没有传参的时候 返回一个空对象
    if (!search) {
        return obj;
    }
    //去掉？号
    search = search.replace(/^\?/, '');
    if (!search) {
        return obj;
    }

    //正常数据
    //key=3&name=xm
    var paramsArr = search.split('&');
    paramsArr.forEach(function (item, i) {
        //item ===> key=3
        //item ===> name=xm
        var itemArr = item.split('=');
        //[key,3] [name,xm]
        //赋值属性
        obj[itemArr[0]] = decodeURIComponent(itemArr[1]);
    });
    return obj;
};
/*封装登录拦截逻辑到你响应成功之前*/
//自己封装的传参保持和zepto一致
lt.ajax = function (options) {
    // 准备给zepto的成功回调  成功的业务
    var success = options.success;
    // 增加自己的业务
    options.success = function(data){
        //拦截登录
        if(data.error === 400){
            location.href = '/mobile/user/login.html?returnUrl='+encodeURIComponent(location.href);
        }else{
            //已经登录 正常的成功
            success && success(data);
        }
    };
    //传 {url:,data:''....}
    $.ajax(options);
};