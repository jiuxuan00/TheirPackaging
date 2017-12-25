(function (global, factory, plug) {
    factory.call(global, global.jQuery, plug)
}(this, function ($, plug) {
    //创建jq插件架构
    //默认参数
    var __DEFS__ = {
        "raise": "change",
        "showMessage": function ($field, msg) {
            $field.after("<span class='error'>" + msg + "</span>");
        }
    };

    //规则引擎
    // require：该元素必须填写
    //   regex：正则表达式匹配
    // integer：该元素必须是整数
    //   email：该元素必须是邮箱格式 xxx@qq.com等
    //  mobile：该元素必须是手机格式 1311111111
    //   phone：该元素必须为电话格式 010-7777777
    //     url：该元素必须为合法的url=uri(https://)
    // gt-than：该元素必须大于XXX
    // lt-than：该元素唏嘘小于XXX
    //min-length：5
    //max-length：10
    var __RULES__ = {
        "require": function () {//如果true代表验证通过否则失败
            return (this.val() && this.val() != "") ? true : false;
        },
        "password": function () {//如果true代表验证通过否则失败
            return /^[a-zA-Z0-9]{6,12}$/.test(this.val()); //6-12位字母数字组合：
        },
        "mobile": function () {//如果true代表验证通过否则失败
            return /^1\d{10}/.test(this.val());
        },
        "email": function () {//如果true代表验证通过否则失败
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.val());
        },
    };

    $.fn[plug] = function (options) {
        if (this.is("form")) {
            //扩展基本的属性
            $.extend(this, __DEFS__, options);
            var that = this;
            //寻找所有的表单元素  排除submit、button按钮
            var $fields = this.find('input,textarea,select').not("[type=submit],[type=button]");
            $fields.on(this.raise, function () {
                //针对当前事件源进行值的验证
                var $field = $(this);
                //给输入框父级增加正确与错误class
                var $group = $field.parents('.form-group:first').removeClass('has-success has-error');
                //默认检验成功
                var result = true;
                //清空以往的错误提示信息
                $group.find('.error').remove();

                //迭代规则引擎
                $.each(__RULES__, function (rule, valid) {
                    if ($field.data("qx-" + rule)) {
                        //该规则要校验
                        result = valid.call($field);
                        $group.addClass(result ? "has-success" : "has-error")
                        //校验失败
                        if (!result) {
                            that.showMessage($field,$field.data("qx-" + rule + "-message"))
                            return result;
                        }
                    }
                });
            });


        } else {
            throw new Error("您验证的不是表单");
        }
    }
}, "qxValidator"))