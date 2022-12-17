$.ajaxPrefilter(function (options) {
    // 统一的为有权限的接口 设置header请求头 
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log(options.url);

    
    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = 'login.html'
        }

    }
})