(function (w, $) {
    //检测浏览器是否支持localStorage
    //localStorage
    function setStorage(key, value, version) {
        try {
            localStorage.setItem(key, value);
            localStorage.setItem("v@" + key, version);
        } catch (e) {

        }
    }

    function getStorage(key, version) {
        if (!localStorage) {
            return "";
        }
        if (localStorage.getItem(key) && localStorage.getItem("v@" + key) && localStorage.getItem("v@" + key) == version) {
            return localStorage.getItem(key);
        } else {
            return "";
        }
    }

    function hasStorage(key, version) {
        try {
            if (localStorage.getItem(key) && localStorage.getItem("v@" + key) && localStorage.getItem("v@" + key) == version) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }

    }

    //---------------commonjs规范----------------//
    var tmpTag = document.location.protocol + "//";
    var _cssCache = {};
    var _version = 1000;
    var _debug = false;
    var _absUrl = function (path) {
        var url;
        if (path.indexOf(tmpTag) > -1) {
            path = path.replace(tmpTag, "").replace(/\/+/g, "/");
            url = path;
        } else {
            path = path.replace(/\/+/g, "/");
            if (path.substr(0, 1) == "/") {
                url = window.location.host + path;
            } else {
                var _host = window.location.href;
                if (_host.indexOf("/") > -1) {
                    _host = _host.substr(0, _host.lastIndexOf("/") + 1);
                } else {
                    _host = _host + "/";
                }
                url = _host.replace(tmpTag, "") + path;
            }
        }

        var _arr = url.split("/");
        var _urlArr = [];
        for (var i = 0; i < _arr.length; i++) {
            if (_arr[i] != "..") {
                _urlArr.push(_arr[i]);
            } else {
                _urlArr.pop();
            }
        }
        return tmpTag + _urlArr.join("/");
    }
    var _define = function (factory) {
        var _exports = {};
        var _module = {};
        _module.exports = {};
        factory(_exports, _module);
        return $.extend(true, {}, _exports, _module.exports);
    }
    var _require = function (parent, path) {
        var _moudle;
        var _type = "js";
        var _basePath;
        if (path.indexOf(tmpTag) < 0) {
            if (path.substr(0, 2) == "./") {
                path = path.substr(2);
                _basePath = parent + path;
            } else if (path.substr(0, 1) == "/") {
                _basePath = tmpTag + window.location.host + path;
            } else {
                var _host;
                if (parent == "") {
                    _host = window.location.href;
                } else {
                    _host = parent;
                }
                if (_host.indexOf("/") > -1) {
                    _host = _host.substr(0, _host.lastIndexOf("/") + 1);
                } else {
                    _host = _host + "/";
                }
                _basePath = _host + path;
            }
        } else {
            _basePath = path;
        }
        var _path = _basePath;
        _basePath = _basePath.substr(0, _basePath.lastIndexOf("/") + 1);
        if (_path.lastIndexOf("!") > -1) {
            _type = _path.substr(_path.lastIndexOf("!") + 1);
            _path = _path.substr(0, _path.lastIndexOf("!"));
        } else {
            if (_path.lastIndexOf(".js") < 0) {
                _path = _path + ".js";
            }
        }
        var _myUrl = _absUrl(_path);
        if (!_debug && hasStorage(_myUrl, _version)) {
            _moudle = getStorage(_myUrl, _version);
        } else {
            $.ajax({
                type: 'get',
                "url": _myUrl + "?r=" + (new Date() - 1),
                "cache": true,
                "dataType": "text",
                "error": function (XMLHttpRequest, textStatus, errorThrown) {
                    console && console.log(_myUrl + "加载失败");
                },
                "async": false,
                "success": function (data) {
                    _moudle = data
                    setStorage(_myUrl, data, _version);
                }
            });
        }

        if (_type == "js") { //js预编译
            var _script = "_define(function(exports,module){\n";
            _script += "var $parent = \"" + _basePath + "\";\n";
            _script += _moudle.replace(/require\(/g, "_require($parent,");
            _script += ";\n});" + "//@ sourceURL=" + _absUrl(path);
            _moudle = eval(_script);
        } else if (_type == "css") {
            var _key = _absUrl(path);
            if (!_cssCache.hasOwnProperty(_key)) {
                $("<style></style>").html(_moudle).appendTo("head");
                _cssCache[_key] = "load";
            }
        }
        return _moudle;
    }
    window.require = function (path) {
        return _require("", path);
    };
    window.require.setVersion = function (v) {
        _version = v;
    }
    window.require.debug = function (state) {
        _debug = state;
    }
})(window, jQuery);
var cui = (function (w, $) {
    //初始化css样式
    var _w = 0;
    var _h = 0;
    var _delay = 500;
    var _history = [];
    var _curRecord;
    var _indexUrl = 0;
    var _indexData = 0;
    var _rootPage = "";
    var isHistory = true;
    $(function () {
        /*初始化css*/
        var cuiCss = "body{border:0;padding:0;margin:0;position:relative}#webApp{border:0;padding:0;margin:0;position:relative;overflow:hidden;margin-left:0}.cui-page{border:0;padding:0;margin:0;position:absolute;top:0;left:0;z-index:1;overflow:hidden}.cui-webView{border:0;padding:0;margin:0;position:relative;overflow:auto}#cui-load{position:fixed;z-index:100000;top:0;left:0}";
        $("<style></style>").html(cuiCss).appendTo("head");
        function loadscreen() {
            //获取屏幕长宽
            _w = $(w).width();
            _h = $(w).height();
            $("#webApp").width(_w);
            $("#webApp").height(_h);
            $("body").width(_w);
            $("body").height(_h);
            $("#cui-load").width(_w);
            $("#cui-load").height(_h);
            $(".cui-page").width(_w);
            $(".cui-page").height(_h);//cui-webView
            $(".cui-webView").width(_w);
            $(".cui-webView").height(_h);
        }

        window.onresize = function () {//屏幕旋转
            loadscreen();
        }
        loadscreen();
    })
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var _load = function () {
        $("body").append("<div id='cui-load'></div>");
        $("#cui-load").width(_w);
        $("#cui-load").height(_h);
        $(window.document).bind("touchmove", function () {
            return false;
        });
    }
    var _destructor = function () {
        $("#cui-load").remove();
        $(window.document).unbind("touchmove");
    }
    var _startApp = function () {
        if (_indexUrl == 0 || _indexData == 0) {
            console.log("启动页未配置错误");
        } else {
            cui.loadPage(_indexUrl, _indexData);
            //开场关闭动画，需终端提供API
        }
    }
    var _firstload = false;
    window.onpopstate = function (e) {
        if (_firstload) {
            if (_history.length > 0) {
                try {
                    var _oldCur = _curRecord;
                    var _element = _history.pop();
                    _curRecord = _element;
                    $(_oldCur).animate({
                        left: _w + "px"
                    }, _delay, function () {
                        $(_oldCur).remove();
                    })

                } catch (e) {
                    console.log(e.message);
                }
            } else {
                if (e != null) {
                    window.history.back();
                }
            }
        }
        _firstload = true;
    };
    return {
        config: function (configure) {
            var req = GetRequest();//兼容两种url参数类型
            var page, data;
            if (req.hasOwnProperty("data")) {
                page = getQueryString("page");
                data = getQueryString("data");
            } else {
                page = req["page"];
                delete req["page"];
                data = JSON.stringify(req);
            }
            if (page == null) {
                _indexUrl = configure.index.page;
            } else {
                _indexUrl = page;
            }
            if (configure && configure.hasOwnProperty("index") && configure["index"].hasOwnProperty("url")) {
                _rootPage = configure["index"]["url"].replace("#page#", "");
            }
            if (!(data == null)) {
                configure.index.data = JSON.parse(data);
            }
            if (configure && configure.index.hasOwnProperty("data")) {
                _indexData = configure.index.hasOwnProperty("data");
            } else {
                _indexData = {};
            }
            if (configure && configure.hasOwnProperty("delay")) {
                _delay = configure["delay"];
            }
            if (configure && configure.hasOwnProperty("version")) {
                var version = configure["version"];
                require.setVersion(version);
            }
            if (configure && configure.hasOwnProperty("debug")) {
                var debug = configure["debug"];
                require.debug(debug);
            }
            _startApp();

        },
        lockScreen: function () {//锁屏
            _load();
        },
        unlockScreen: function () {/*结束锁屏*/
            _destructor();
        },
        preLoad: function (arr) { //预加载
            if ($.isArray(arr)) {
                setTimeout(function () {
                    for (var i = 0; i < arr.length; i++) {
                        require(arr[i] + "!text");
                    }
                }, 10)
            }
        },
        loadPage: function () {//格式 url，参数 上一页是否计入开始
            cui.lockScreen();//锁屏
            //动态化参数配置
            var url = "";
            var data = {};
            isHistory = true;
            var args = arguments;
            for (var i = 0; i < args.length; i++) {
                var _temp = args[i];
                if ($.type(_temp) == "object") {
                    data = _temp;
                } else if ($.isArray(_temp)) {
                    data = _temp;
                } else {
                    _temp = _temp.toString();
                    if (_temp == "true") {
                        isHistory = true;
                    } else if (_temp == "false") {
                        isHistory = false;
                    } else {
                        url = _temp;
                    }
                }

            }
            var page;
            page = require(_rootPage + url);
            cui.unlockScreen();//解屏
            var _element = $("<div class='cui-page'></div>");
            _element.height(_h);
            _element.width(_w);
            var mv = $("#webApp").find(".cui-page");
            if (mv.length > 0) {
                var zIndex = mv.last().css("zIndex") * 1 + 1;
                _element.css("zIndex", zIndex).css("left", _w + "px");
            }
            $("#webApp").append(_element);
            if (_curRecord && _curRecord != null && _curRecord != "") {
                function isEmpty(obj) {
                    for (var name in obj) {
                        return false;
                    }
                    return true;
                };
                function getUrl() {
                    var _url = window.location.href;
                    if (_url.indexOf("?") > -1) {
                        return _url.substr(0, url.indexOf("?"))
                    } else {
                        return _url;
                    }
                }

                function getPage() {
                    return url;
                }

                var _page = getPage();
                if (isHistory) {
                    if (!isEmpty(data)) {
                        var u = "";
                        for (var p in  data) {
                            u += "&" + p + "=" + data[p];
                        }
                        window.history.pushState({page: 1}, 'page', getUrl() + "?page=" + _page + u);
                    } else {
                        window.history.pushState({page: 1}, 'page', getUrl() + "?page=" + _page);
                    }
                    ;
                    _history.push(_curRecord);
                } else {
                    if (!isEmpty(data)) {
                        var u = "";
                        for (var p in  data) {
                            u += "&" + p + "=" + data[p];
                        }
                        window.history.replaceState({page: 1}, 'page', url + "?page=" + _page + u);
                    } else {
                        window.history.replaceState({page: 1}, 'page', url + "?page=" + _page);
                    }
                    ;
                }
                _firstload = true;
            }
            _curRecord = _element[0];
            page.pageInit(_element[0], data);
            if ($.isFunction(cui.curPageUrl)) {
                cui.curPageUrl(url);
            }
        },
        getHistory: function (num) {
            if (num > 0) return null;
            if (num == 0) return _curRecord;
            var _index = _history.length + num;
            if (_index < 0) return null;
            return _history[_index];
        },
        clearHistory: function () {
            for (var i = 0; i < _history.length; i++) {
                $(_history[i]).remove();
            }
            _history = [];
        },
        pageShow: function (callback) {
            var _back = $("#webApp").find(".cui-page").last().find(".cui-back");
            if (cui.hasHistory()) {
                _back.show();
                _back.click(function () {
                    cui.pageBack();
                });
            } else {
                _back.hide();
            }
            $("#webApp").find(".cui-webView").last().width(_w);
            $("#webApp").find(".cui-webView").last().height(_h);
            var mv = $("#webApp").find(".cui-page");
            var _l = mv.length;
            if (_l > 1) {
                mv.last().animate({
                    left: "0px"
                }, _delay, function () {
                    var _prevPage = $("#webApp").find(".cui-page:eq(" + (_l - 2) + ")");
                    if (!isHistory) {
                        $(_prevPage).remove();
                    }
                    if ($.isFunction(callback)) callback();
                })
            } else {
                if ($.isFunction(callback)) callback();
            }
        },
        "pageBack": function () {
            window.history.back();
        },
        hasHistory: function () {
            return _history.length > 0 ? true : false;
        }
    }
})(window, jQuery);