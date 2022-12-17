$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('初始化文章分类失败')
                // 调用模板引擎 渲染分类下拉表单
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                // 提醒 layui 重新渲染表单
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮 绑定选择文件事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()

    })
    // 监听 coverFile 事件 获取用户选择的文件
    $('#coverFile').on('change', function (e) {
        // 1.获取文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) return
        //2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        //3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 定义文章发布状态
    var art_state = '已发布' 
    $('#btnSava2').on('click', function () {
        art_state = '草稿'
    })
    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单 快速创建一个 FormDate 对象
        var fd = new FormData($(this)[0])
        // 将文章发布的状态存到 fd  中
        fd.append('state', art_state)
        // 4.将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象存储到 fd 当中
                fd.append('cover_img', blob)
                // 6.发起ajax 请求
                publishArticle(fd)
            })
    })
    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layer.msg('发布文章失败')
                layer.msg('发布文章成功')
                // 文章发布成功后 跳转到文章列表页
                location.href = '/article/art_list.html'
            }
        })
    }
})
