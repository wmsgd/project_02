$(function () {
    //点击链接去“注册页面”
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击链接去“登录页面”
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })
    // 从 Layui 中获取form 对象
    var form = layui.form
    // 从 Layui 中获取layes 对象
    var layes = layui.layes
    // 通过form.verigy() 函数自定义校准规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        //校验俩个密码是否一致
        repwd: function (value) {
            var pwd = $('.reg-box [name="password"]').val()
            if(pwd !== value) return '两次密码输入不一致'
        }
    })
    // 监听表单注册页面
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        //发起ajax.post请求
        $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function (res) {
            if (res.status !== 0) return layer.msg(res.message, { icon: 5 });
            layer.msg('注册成功', { icon: 6 });
            // 跳转到登录页面
            $("#link_login").click()
        })
        
    })
    // 监听表单登录页面
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        // 发起ajax post 请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('登录失败', { icon: 5 });
                layer.msg('登录成功', { icon: 6 });
                // 将 token 字符串保存到 本地存储当中
                console.log(res);
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = 'index.html'
            }
        })
    })
})