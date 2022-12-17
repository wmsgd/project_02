$(document).ready(function () {
    
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
 
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n: '0' + n
    }
    // 定义一个查询的参数对象
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示两条数据
        cate_id: '',// 文章分类的id
        state: '' // 文章发布的状态
    }
    initTable()
    initCate()
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('获取文章列表失败')
                // 使用模板引擎
                var htmlStr = template('tap-table', res)
                // console.log(htmlStr);
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('获取分类数据失败')
                // 调用模板引擎渲染数据
                var htmlStr = template('tal-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 通知layui 重新渲染表单结构
                form.render()
            }
        })
    }
    // 为筛选表单绑定提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        // 根据最新的条件重新渲染
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,// 每页显示几条内容
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2,3,5,10 ],
            jump: function (obj, first) {
                // console.log(undefined);
                // 将最新的页码值赋值到 q 的查询参数中
                q.pagenum = obj.curr
                // 将最新的条目数赋值给 q.pagesize 属性
                q.pagesize = obj.limit
                // 根据最新的数据 q 获取对应的数据列表 并渲染表格
                if (!first) initTable()
            }
        });
    }
    // 通过事件委派为按钮绑定删除事件
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        // 询问是否删除数据
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除文章失败1')
                    layer.msg('删除文章成功')
                    if (len === 1) q.pagenum === 1 ? 1 : q.pagenum -1
                    initTable()
                }
        })

            layer.close(index);
        });
       
    })
})