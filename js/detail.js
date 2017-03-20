~function (pro) {
    //->QueryURLParameter:获取URL问号后面的参数值,最后以对象键值对的方式存储
    function QueryURLParameter() {
        var reg = /([^?&#=]+)=([^?&#=]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    }

    pro.QueryURLParameter = QueryURLParameter;
}(String.prototype);

var userName = document.getElementById('userName'),
    submit = document.getElementById('submit');
/*
 * 判断当前页面属于增加的操作还是修改的操作
 * 1、在首页中，给修改按钮绑定跳转页面的同时，把对应的客户ID也传递过来(问号传参)
 * 2、在详情页中第一件事情：获取当前URL地址栏中问号后面的参数值
 * 3、如果获取到了客户ID说明当前的操作是修改，没有获取到ID当前的操作为增加
 * 4、如果是修改的话
 * -->通过传递过来的客户ID，先从服务器上把之前的客户信息获取到，然后展示在页面的文本框中
 * -->点击提交的时候走的是修改的流程而不是之前增加的操作了(在提交按钮的点击事件中我们需要判断是增加还是修改)
 */
var urlObj = window.location.href.QueryURLParameter(),
    customId = urlObj['id'];
if (typeof customId !== 'undefined') {//->修改
    ajax({
        url: '/getInfo',//->'/getInfo?id=' + customId,
        type: 'get',
        dataType: 'json',
        cache: false,
        data: {
            id: customId
        },
        success: function (result) {
            if (result && result.code == 0) {
                result = result['data'];
                userName.value = result['name'];
            }
        }
    });
}

/*
 * 提交
 * ->增加
 * ->修改
 */
submit.onclick = function () {
    //->验证文本框中的内容不能为空
    if (userName.value.length === 0) {
        alert('客户姓名必填!');
        return;
    }

    var sendData = {
        name: userName.value
    };
    /*
     * 修改客户信息
     * 1、获取页面中客户填写的信息
     * 2、使用AJAX按照指定的API把客户信息发送给服务器 {id:xxx,name:xxx}
     * 3、接收服务器反馈回来的结果,成功的话跳转到首页,失败的话提示增加失败即可
     */
    if (typeof customId !== 'undefined') {
        sendData['id'] = customId;
        ajax({
            url: '/updateInfo',
            type: 'post',
            dataType: 'json',
            data: sendData,
            success: function (result) {
                if (result && result.code == 0) {
                    window.location.href = 'index.html';
                } else {
                    alert('亲，修改失败了哦！')
                }
            }
        });
        return;
    }

    /*
     * 增加客户信息
     * 1、获取页面中客户填写的信息
     * 2、使用AJAX按照指定的API把客户信息发送给服务器 {name:xxx}
     * 3、接收服务器反馈回来的结果,成功的话跳转到首页,失败的话提示增加失败即可
     */
    ajax({
        url: '/addInfo',
        type: 'post',
        dataType: 'json',
        data: sendData,
        success: function (result) {
            if (result && result.code == 0) {
                //->成功:JS中页面跳转
                //window.location.href='目标页面的地址'; [当前页面跳转]
                //window.open('目标页面的地址'); [在浏览器新窗口打开]
                window.location.href = 'index.html';
                //window.open('index.html');
            } else {
                //->失败:服务器把数据都正常给我们了,只是在服务器处理的时候没有达到最后的需求效果,所以反馈一个状态信息代表失败,不是我们AJAX封装ERROR方法中的失败(ERROR中的失败时状态码不为2或者3开头的)
                alert('哎呦，出错啦！');
            }
        }
    });
};