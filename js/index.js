var content = document.getElementById('content');
ajax({
    url: 'http://localhost/getAllList',
    type: 'get',
    dataType: 'json',
    cache: false,
    async: true,
    success: function (result) {
        if (result && result.code == 0) {
            var data = result['data'];

            //->数据绑定
            var str = '';
            for (var i = 0; i < data.length; i++) {
                var cur = data[i];
                str += '<li>';
                str += '<span>' + cur.id + '</span>';
                str += '<span>' + cur.name + '</span>';
                str += '<span>';
                str += '<a href="detail.html?id=' + cur.id + '">修改</a>';
                str += '<a href="javascript:;" data-id="' + cur.id + '">删除</a>';
                /*在数据绑定的时候就给每一个A标签设置一个自定义属性存储对应的客户ID,这样后期点击删除按钮的时候,如果需要用到这个ID,我们就可以直接通过自定义属性值获取到需要的信息了=>自定义属性编程思想*/
                str += '</span>';
                str += '</li>';
            }
            content.innerHTML = str;
        }
    }
});

/*
 * 删除
 * 1、使用事件委托实现点击删除的处理操作，委托给content
 * 2、点击删除的时候做的事情:
 * -->弹出提示框:确定要删除编号为xxx的客户吗?
 * -->确定删除后做以下事情：通过AJAX请求告诉服务器我要删除谁，服务器把内容删除后的结果反馈给我们，如果删除成功的话，我们在HTML结构中移除这一项信息，失败的话给予提示即可
 */
content.onclick = function (e) {
    e = e || window.event;
    var tar = e.target || e.srcElement,
        tarTag = tar.tagName.toUpperCase();
    if (tarTag === 'A' && tar.innerHTML === '删除') {
        var customId = tar.getAttribute('data-id');
        var flag = window.confirm('亲,确定要删除客户编号为 [ ' + customId + ' ] 的客户吗?');
        if (flag) {//->确定
            ajax({
                url: '/removeInfo',
                type: 'get',
                dataType: 'json',
                data: {
                    id: customId
                },
                cache: false,
                success: function (result) {
                    if (result && result.code == 0) {
                        content.removeChild(tar.parentNode.parentNode);
                    } else {
                        alert('亲，删除失败啦！');
                    }
                }
            });
        }
    }
};




