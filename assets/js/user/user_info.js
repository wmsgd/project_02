$(function () {
    var form = layui.form 
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length <= 0) return '昵称必须在1~6个字符之间'
        }
    })
    initUserInfo()

    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) return layer.msg('用户信息获取失败')
                // console.log(res);
                 // 快速为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }
    // 重置表单信息
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })
    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('修改用户信息失败')
                layer.msg('修改用户信息成功!')
                window.parent.getUserInfo()
            }
        })
    })
})