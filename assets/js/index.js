$(function () {
    // 调用 getUserInfo() 函数获取用户基本信息
    getUserInfo()
    // 点击按钮 退出后台管理
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 删除本地的tokeng
            localStorage.removeItem('token')
            // 返回注册登录页面
            location.href = 'login.html'
            layer.close(index);
        });
    })
})
// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0)  return layui.layer.msg('获取用户信息失败！')
            // 调用 renderAvatar 函数渲染函数
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username
    // 设置欢迎文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 渲染用户头像
    if (user.user_pic !== null) {
        // 渲染用户头像
        $('.layui-nav-img').prop('src', user.user_pic)
        $('text-avatar').hide()
    } else {
        // 渲染文本头像
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}