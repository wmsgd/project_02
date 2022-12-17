$(function () {
    var layer = layui.layer
    var form = layui.form
    initArticleList()

    // 获取文章分类列表
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return '请求失败'
                var htmlStr = template('tep-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加类别绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        var indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html() //这里content是一个普通的String
        });
    })
    // 通过代理的方式为 添加表单绑定提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log('ok');
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layer.msg('新增分类失败')
                initArticleList()
                layer.msg('新增分类成功')
                layer.close(indexAdd)
            }

        })
    })
    // 为修改按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        var indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html() //这里content是一个普通的String
        });
        // 发起请求获取对应数据
        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    // 通过代理的方式 为修改表单绑定提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新分类数据失败')
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArticleList()
            }
        })
    })
    // 通过代理的方式 为修改表单绑定删除事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    initArticleList()
                    layer.close(index);
                }
            })
        })
    })
})