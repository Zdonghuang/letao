$(function () {
    /*1. 表单校验*/
    /*2. 提交登录请求*/
    /*3. 成功 跳转首页*/
    /*4. 不成功 根据错误信息给对应的表单加上错误提示*/
    /*5. 重置 表单内容的清空  检验样式的清除*/


    /*使用表单校验插件 bootstrapvalidator 插件*/
    /*1、下载  https://github.com/nghuuphuoc/bootstrapvalidator/tree/v0.5.3*/
    /*2. 文档  https://www.cnblogs.com/v-weiwang/p/4834672.html*/
    /*3. 文档  https://blog.csdn.net/u013938465/article/details/53507109*/

    /*开始使用*/
    /*1. 引入依赖资源  css  js */
    /*2. HTML遵循一定的规则  form-group > form-control */
    /*3. 初始化校验插件 扩展一个新的api*/
    $('#loginForm').bootstrapValidator({
        /*配置项*/
        /*配置表单元素的四种状态的图标 */
        /*未校验  无图标*/
        /*校验失败 错误图标*/
        /*校验成功 正确图标*/
        /*校验中   加载图标*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /*配置校验规则*/
        /*表单内的所有需要校验字段*/
        fields:{
            /*需要分别去配置不同的校验规则*/
            /*通过表单元素的name属性去匹配*/
            username:{
                /*具体的规则  不止一个*/
                validators:{
                    /*指定校验规则*/
                    /*非空校验*/
                    notEmpty:{
                        message:'用户名必填'
                    },
                    /*定义一个自定义规则 必须加callback*/
                    callback:{
                        message:'用户名不存在'
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:'密码必填'
                    },
                    /*更多校验规则*/
                    stringLength:{
                        min:6,
                        max:18,
                        message:'密码必须6-18个字符'
                    },
                    callback:{
                        message:'密码错误'
                    }
                }
            }
        }
        //这是插件的自定义事件  校验成功的时候触发
    }).on('success.form.bv',function (e) {
        e.preventDefault();
        //提交登录请求
        $.ajax({
            url:'/employee/employeeLogin',
            type:'post',
            data:$(e.target).serialize(),
            dataType:'json',
            success:function (data) {
                if(data.success){
                    location.href = '/admin/index.html';
                }else{
                    if(data.error === 1000){
                        /*用户名不存在*/
                        /*1. 修改当前表单的校验状态为 校验失败*/
                        /*2. 提示用户名不存在*/
                        //1. 字段名字 2. 字段状态  3. 校验规则（提示）
                        //几个状态：NOT_VALIDATED VALID INVALID VALIDATING
                        $('#loginForm').data('bootstrapValidator').updateStatus('username','INVALID','callback');
                    }else if(data.error === 1001){
                        /*密码错误*/
                        $('#loginForm').data('bootstrapValidator').updateStatus('password','INVALID','callback');
                    }
                }
            }
        });
    });
    /*验证成功的时候提交ajax*/
    /*$('#loginForm').on('submit',function (e) {
        e.preventDefault();
        console.log('tj');
    })*/
    $('#loginForm').on('reset',function () {
        /*默认清空*/
        /*但是需要重置校验*/
        /*$('#loginForm').data('bootstrapValidator').updateStatus('username','NOT_VALIDATED');
        $('#loginForm').data('bootstrapValidator').updateStatus('password','NOT_VALIDATED');*/
        $('#loginForm').data("bootstrapValidator").resetForm();
    });
});