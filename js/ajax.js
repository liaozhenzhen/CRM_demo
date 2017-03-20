function ajax(options) {
    //->init parameter
    var _default = {
        url: null,
        type: 'get',
        dataType: 'text',
        data: null,
        async: true,
        cache: true,
        success: null,
        error: null,
        header: null
    };
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            _default[key] = options[key];
        }
    }

    //->send ajax
    var xhr = new XMLHttpRequest;

    var isMark = _default.url.indexOf('?') >= 0 ? true : false,
        mark = isMark ? '&' : '?';
    var regGet = /^(get|delete|head)$/i;
    if (_default.data) {
        if (regGet.test(_default.type)) {//->GET
            _default.data = formatData(_default.data);
            _default.url += mark + _default.data;
            _default.data = null;
        } else {//->POST
            _default.data = JSON.stringify(_default.data);
        }
    }

    if (regGet.test(_default.type) && _default.cache === false) {
        isMark = _default.url.indexOf('?') >= 0 ? true : false;
        mark = isMark ? '&' : '?';
        _default.url += mark + '_=' + Math.random();
    }

    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
        if (/^(?:2|3)\d{2}$/.test(xhr.status)) {
            //->GET RESPONSE HEADER
            if (xhr.readyState === 2) {
                var serverTime = xhr.getResponseHeader('Date');
                serverTime = new Date(serverTime);
                _default.header && _default.header.call(xhr, serverTime);
            }

            //->GET RESPONSE BODY
            if (xhr.readyState === 4) {
                _default.dataType = _default.dataType.toUpperCase();
                var val = xhr.responseText;
                switch (_default.dataType) {
                    case 'JSON':
                        val = 'JSON' in window ? JSON.parse(val) : eval('(' + val + ')');
                        break;
                    case 'XML':
                        val = xhr.responseXML;
                        break;
                }
                _default.success && _default.success.call(xhr, val);
            }
            return;
        }
        //->ERROR
        _default.error && _default.error.call(xhr, {
            status: xhr.status,
            statusText: xhr.statusText
        });
    };
    xhr.send(_default.data);
}

//->把一个对象中的属性名和属性值最后变为一个用&连接的字符串
function formatData(obj) {
    if (({}).toString.call(obj) !== '[object Object]') {
        return;
    }
    var result = '';
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result += key + '=' + obj[key];
            result += '&';
        }
    }
    result = result.substr(0, result.length - 1);
    return result;
}