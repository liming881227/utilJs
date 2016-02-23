/**
 *  add liming
 *  util 通用js
 *  使用方式:
 *  window.util.url...
 *  effevo已经赋值给window
 */

define(function(require, exports,module) {
    window.util = {
        //# util 版本号
        version: '1.0',

        noop: function () { //#空函数
            return function () {
                //空函数
            };
        },

        isArray: Array.isArray || function (array) {  //# 判断变量 是否为数组
            return '[object Array]' == Object.prototype.toString.call(array);
        },

        config: {} //用户传入
    };
    
    //通用url操作
    util.url = {
        //#URL
        //参数：变量名，url为空则表从当前页面的url中取
        getQuery: function (name, url) {
            var u = arguments[1] || window.location.href
                , reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
                , r = u.substr(u.indexOf("?") + 1).match(reg)
                ;
            return r != null ? r[2] : "";
        },

        //计算hash值
        getHash: function (name, url) { //# 获取 hash值
            var u = arguments[1] || location.hash;
            var r = u.substr(u.indexOf("#") + 1);
            return r;
        },

        //# 解析URL
        parse: function (url) {
            var a = document.createElement('a');
            url = url || document.location.href;
            a.href = url;
            return {
                source: url, protocol: a.protocol.replace(':', ''), host: a.hostname, port: a.port, query: a.search, file: (a.pathname.match(/([^\/?#]+)$/i) || [, ''])[1], hash: a.hash.replace('#', ''), path: a.pathname.replace(/^([^\/])/, '/$1'), relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1], segments: a.pathname.replace(/^\//, '').split('/')
            };
        },

        //拼装get参数
        parseGetParams: function(query) {
            var paramsArr = [];
            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    paramsArr.push(key + '=' + ( query[key] || '' ));
                }
            }
            return paramsArr.join('&');
        },

	    //检测是否能支持pushState方法
	    checkCanPushState: function() {
			if(window.history.pushState)
				return true;
		    return false;
	    },

	    pushState: function(data,url) {
		    if (util.url.checkCanPushState()) {
			    //注意data虽然可以保存数据，但是不能保存仍然引用着当前页面元素的对象，例如$("DOM")这样一个对象，就会出现ObjectCloneError
			    window.history.pushState(data, document.title, url);
			    return true;
		    }
		    return false;
	    }
    };
    
    //通用数组操作
    util.array = {
        //判断变量是否为数组
        isArray: Array.isArray || function (array) {  //# 判断变量 是否为数组
            return '[object Array]' == Object.prototype.toString.call(array);
        },

        // inArray, 返回位置！ 不存在则返回 -1；
        index: function (t, arr) { //# 返回当前值所在数组的位置
            if (arr.indexOf) {
                return arr.indexOf(t);
            }
            for (var i = arr.length; i--;) {
                if (arr[i] === t) {
                    return i * 1;
                }
            }
            ;
            return -1;
        },

        //返回对象 的 键值！  返回值 类型为数组。
        getKey: function (data) { //# 返回对象所有的键值
            var arr = [], k;
            for (k in data) {
                arr.push(k);
            }
            return arr;
        },

        // max , 数组中最大的项
        max: function (array) {//#求数组中最大的项
            return Math.max.apply(null, array);
        },

        // min , 数组中最小的项
        min: function (array) { //#求数组中最小的项
            return Math.min.apply(null, array);
        },

        // remove ， 移除
        remove: function (array, value) { //#移除数组中某值
            var length = array.length;
            while (length--) {
                if (value === array[ length ]) {
                    array.splice(length, 1);
                }
            }
            return array;
        },

        //  removeAt ，删除指定位置的 值
        //@index , 索引. 不传递 index ，会删除第一个
        removeAt: function (array, index) { //#删除数组中 指定位置的值
            array.splice(index, 1);
            return array;
        },

        //检查数组是否有重复数据
        checkHasRepeat : function(arr) {
            var hash={};
            for(var i in arr){
                if(hash[arr[i]] && arr[i]){
                    return true;
                }
                hash[arr[i]]=true;
            }
            return false;
        }
    };
    
    util.browser = { //#浏览器
        browsers: { //# 浏览器内核类别
            weixin: /micromessenger(\/[\d\.]+)*/   //微信内置浏览器
            , mqq: /mqqbrowser(\/[\d\.]+)*/       //手机QQ浏览器
            , uc: /ucbrowser(\/[\d\.]+)*/            //UC浏览器
            , chrome: /(?:chrome|crios)(\/[\d\.]+)*/  //chrome浏览器
            , firefox: /firefox(\/[\d\.]+)*/          //火狐浏览器
            , opera: /opera(\/|\s)([\d\.]+)*/     //欧朋浏览器
            , sougou: /sogoumobilebrowser(\/[\d\.]+)*/   //搜狗手机浏览器
            , baidu: /baidubrowser(\/[\d\.]+)*/          //百度手机浏览器
            , 360: /360browser([\d\.]*)/                         //360浏览器
            , safari: /safari(\/[\d\.]+)*/		//苹果浏览器
            , ie: /msie\s([\d\.]+)*/    // ie 浏览器
        },

        //@errCall : 错误回调
        addFav: function (url, title, errCall) { //#加入收藏夹
            try {
                window.external.addFavorite(url, title);
            } catch (e) {
                try {
                    window.sidebar.addPanel(title, url, '');
                } catch (e) {
                    errCall();
                }
            }
        },

        //浏览器版本
        coreInit: function () { //#noadd
            var i = null
                , browsers = this.browsers
                , ua = window.navigator.userAgent.toLowerCase()
                , brower = ''
                , pos = 1
                ;
            for (i in browsers) {
                if (brower = ua.match(browsers[i])) {
                    if (i == 'opera') {
                        pos = 2;
                    } else {
                        pos = 1;
                    }
                    this.version = (brower[ pos ] || '').replace(/[\/\s]+/, '');
                    this.core = i;
                    return i;
                }
            }
        },

        //检测是否有IE浏览器
        isIE: function() {
            var b = document.createElement('b');
            b.innerHTML = '<!--[if IE]><i></i><![endif]-->';
            return b.getElementsByTagName('i').length === 1;
        },

        // 检测IE版本 ！仅支持IE:  5,6,7,8,9 版本
        ie: (function () { //# 检测IE版本 ！仅支: ie5,6,7,8,9
            var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                    all[0]
                );
            return v > 4 ? v : false;
        })(),

        isWebkit: /webkit/i.test(navigator.userAgent), version: 0, core: ''
    };

    //字符串匹配通用
    util.regExp = {
        //是否为 数字！整数，浮点数
        isNum: function (num) { //# 是否为数组
            return !isNaN(num);
        },

        isEmail: function (mail) {//# 是否为 邮箱
            return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i.test(mail);
        },

        isIdCard: function (card) { //# 是否为 身份证
            return /^(\d{14}|\d{17})(\d|[xX])$/.test(card);
        },

        isMobile: function (mobile) { //# 是否为 手机
            return /^0*1\d{10}$/.test(mobile);
        },

        isQQ: function (qq) { //# 是否为 QQ
            return /^[1-9]\d{4,10}$/.test(qq);
        },

        isTel: function (tel) { //# 是否为 电话
            return /^\d{3,4}-\d{7,8}(-\d{1,6})?$/.text(tel);
        },

        isUrl: function (url) { //# 是否为 URL
            return /https?:\/\/[a-z0-9\.\-]{1,255}\.[0-9a-z\-]{1,255}/i.test(url);
        },

        isColor: function (color) { //# 是否为 16进制颜色
            return /#([\da-f]{3}){1,2}$/i.test(color);
        },

        //@id ： 身份证 ，
        // @now : 当前时间 如：new Date('2013/12/12') , '2013/12/12'
        // @age ： 允许的年龄
        isAdult: function (id, allowAge, now) { //# 是否年龄是否成年
            var age = 0 // 用户 年月日
                , nowDate = 0  //当前年月日
                ;
            allowAge = parseFloat(allowAge) || 18;
            now = typeof now == 'string' ? new Date(now) : ( now || new Date() );


            if (!this.isIdCard(id)) {
                return false;
            }
            //15位身份证
            if (15 == id.length) {
                age = '19' + id.slice(6, 6);
            } else {
                age = id.slice(6, 14);
            }
            // 类型转换 整型
            age = ~~age;
            nowDate = ~~( julyJs.date.format('YYYYMMDD', now) );
            //比较年龄
            if (nowDate - age < allowAge * 1e4) {
                return false;
            }
            return true;
        },

        //浮点数
        isFloat: function (num) { //# 是否为 浮点数
            return /^(([1-9]\d*)|(\d+\.\d+)|0)$/.test(num);
        },

        //正整数
        isInt: function (num) { //# 是否为 正整数
            return /^[1-9]\d*$/.test(num);
        },

        //是否全为汉字
        isChinese: function (str) { //# 是否全为 汉字
            return /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])+$/gi.test(str);
        }
    };

    //# 字符串
    util.string = {
        codeHtml: function (content) { //# 转义 HTML 字符
            return this.replace(content, {
                '&': "&amp;", '"': "&quot;", "'": '&#39;', '<': "&lt;", '>': "&gt;", ' ': "&nbsp;", '\t': "&#09;", '(': "&#40;", ')': "&#41;", '*': "&#42;", '+': "&#43;", ',': "&#44;", '-': "&#45;", '.': "&#46;", '/': "&#47;", '?': "&#63;", '\\': "&#92;", '\n': "<br>"
            });
        },

        decodeHtml : function (str){
            if (!str || str.indexOf("&") == -1){
                return str.trim();
            }

            str = str.replace(/&lt;/g, "<");
            str = str.replace(/&gt;/g, ">");
            str = str.replace(/&nbsp;/g, " ");
            str = str.replace(/&amp;/g, "&");
            str = str.replace(/&#40;/g, "(");
            str = str.replace(/&#41;/g, ")");
            return str.trim();
        },

        //替换全部
        replaceAll : function(str, replaced, replacement) {
            if(str == null)
                return "";
            var ret = "";

            var index = 0;
            while(str.indexOf(replaced, index) >= index)
            {
                ret += str.substring(index, str.indexOf(replaced, index)) + replacement;

                index = str.indexOf(replaced, index) + replaced.length;
            }

            ret += str.substring(index);

            return ret;
        },

        //去除html标签
        removeHTMLTag: function (str) {
            str = str.replace(/<br>/ig, '\r\n');//替换<br> \r\n
            str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[ | ]* /g, ' '); //去除行尾空白
            str = str.replace(/ /ig, '');//去掉
            str = str.replace(/&nbsp;/ig, '');//去掉
        // return this.codeHtml(str);
            return str;
        },

        //去除两边空格
        trim: function (text) { //# 去除两边空格
            return ( text || '' ).replace(/^\s+|\s$/, '');
        },
        //字符串替换
        replace: function (str, re) { //# 字符串替换
            str = str || '';
            for (var key in re) {
                replace(key, re[key]);
            }
            ;
            function replace(a, b) {
                var arr = str.split(a);
                str = arr.join(b);
            };
            return str;
        },

        //增加前缀
        addPre : function (pre, word, size) { //# 补齐。如给数字前 加 0
            pre = pre || '0';
            size = parseInt(size) || 0;
            word = String(word || '');
            var length = Math.max(0, size - word.length);
            return this.repeat(pre, length, word);
        },

        //删除字符串中的img标签
        removeImg: function (src) {
            src = src.replace(/<\s?img[^>]*>/gi, '');
            return src;
        },

        //重复字符串
        repeat : function (word, length, end) {
            end = end || ''; //加在末位
            length = ~~length;
            return new Array(length * 1 + 1).join(word) + '' + end;
        },

        //格式化
        format: function (src) {
            if (arguments.length == 0) return null;
            var args = Array.prototype.slice.call(arguments, 1);
            return src.replace(/\{(\d+)\}/g, function (m, i) {
                return args[i];
            });
        },

        //判断是否中文
        isChinese : function (str){
            var reg = /^[\u0391-\uFFE5]+$/;
            return reg.test(str);
        }
    };

    //其它一些通用方法
    util.util = {
        //阻止浏览器默认行为
        stopDefault: function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                //IE中阻止函数器默认动作的方式
                window.event.returnValue = false;
            }
            return false;
        },

        /**
         * 原生触发事件
         * @param element 元素dom
         * @param type 触发事件类型
         * @returns {*}
         */
        triggerEvent : function(element,type){
            var event;
            if(document.createEventObject){
                event = document.createEventObject();
                return element.fireEvent('on'+type,event);
            }else{
                event = document.createEvent('HTMLEvents');
                event.eventName = type;
                event.initEvent(type,true,true);
                return !element.dispatchEvent(event);
            }
        },

        /**
         * 计算弹出框口位置
         * @param popHeight 弹出框高度
         * @param position: {left:left,top:top} //弹出窗位置
         * @param marginDown 留出空间 默认为10
         */
        getPopUpDirection: function(popUpWidth,popHeight,position,marginDown) {
            var document = window.document,
                docElem = document.documentElement,
                clientHeight = docElem['clientHeight'],
                innerHeight = window['innerHeight'];
            marginDown = marginDown || 10;
            var maxHeight = Math.max(clientHeight,innerHeight);
            var spaceDown = maxHeight - position.top - popHeight - marginDown;
            return {
                up: spaceDown < 0,
                down: spaceDown > 0,
                left: true, //todo left right 后面再加
                right: true
            }
        },

        /**
         * 自动计算弹出pop窗口 位置与方向
         * @param el 触发弹出窗的dom对象
         * @param popUpWidth 弹出窗口宽度
         * @param popUpHeight 弹出窗口高度
         * @param margin margin用于设置箭头指向的margin距离
         * @returns {{direction: *}}
         */
        calcPopUpProperty: function(el,popUpWidth,popUpHeight,margin) {
            var targetWidth = $(el).width(),
                targetHeight = $(el).height();
            var targetPosition = util.object.getWindowAbsPos(el);
            margin = margin || 0;
            var popUpPostion = {
                top: targetPosition.top + targetHeight + margin,
                left: targetPosition.left + targetWidth / 2 - popUpWidth / 2
            };
            var popUpDirection = util.util.getPopUpDirection(popUpHeight,popUpWidth,popUpPostion,margin);
            if(popUpDirection.up) {
                popUpPostion.top = popUpPostion.top - margin *2 - targetHeight - popUpHeight;
            }
            return {
                position: popUpPostion,
                direction: popUpDirection
            };
        }

    };
    
    util.date = {
        format: function (formatType, time, weeks) { //格式化输出时间
            var pre = '0';
            var formatType = formatType || 'YYYY-MM-DD';
            //格式化时间
            var weeks = weeks || '日一二三四五六';
            var time = time || new Date();
            return (formatType || '')
                .replace(/yyyy|YYYY/g, time.getFullYear())
                .replace(/yy|YY/g, util.string.addPre(pre, time.getFullYear() % 100), 2)
                .replace(/mm|MM/g, util.string.addPre(pre, time.getMonth() + 1, 2))
                .replace(/m|M/g, time.getMonth() + 1)
                .replace(/dd|DD/g, util.string.addPre(pre, time.getDate(), 2))
                .replace(/d|D/g, time.getDate())
                .replace(/hh|HH/g, util.string.addPre(pre, time.getHours(), 2))
                .replace(/h|H/g, time.getHours())
                .replace(/ii|II/g, util.string.addPre(pre, time.getMinutes(), 2))
                .replace(/i|I/g, time.getMinutes())
                .replace(/ss|SS/g, util.string.addPre(pre, time.getSeconds(), 2))
                .replace(/s|S/g, time.getSeconds())
                .replace(/w/g, time.getDay())
                .replace(/W/g, weeks[time.getDay()])
                ;
        },

        convertTZtime: function (time) {
            time = time || "";
            time = time.replace("T", " ");
            time = time.replace("Z", "");
            return time;
        },

        getLastDayDate : function(day,formatType,date){
            var startTime;
            if(date){
                startTime = new Date(date).getTime();
            }else{
                startTime = new Date().getTime();
            }
            startTime = startTime - 1000 * 60 * 60 * 24 * parseInt(day);
            formatType = formatType || 'YYYY-mm-dd HH:ii:ss';
            return this.format(formatType, new Date(startTime));
        },

        isDate : function(d){
            if(!d) {
                return false;
            }
            return new Date(d) != 'Invalid Date';
        }
    };
    
    //xml通用
    util.xml = {

        getXMLStr: function (str) {
            str = cynthia.string.replaceAll(str, "&", "&amp;");
            str = cynthia.string.replaceAll(str, "<", "&lt;");
            str = cynthia.string.replaceAll(str, ">", "&gt;");
            str = cynthia.string.replaceAll(str, "'", "&apos;");
            str = cynthia.string.replaceAll(str, "\"", "&quot;");
            return str;
        },

        getNoXMLStr: function (str) {
            str = cynthia.string.replaceAll(str, "&lt;", "<");
            str = cynthia.string.replaceAll(str, "&gt;", ">");
            str = cynthia.string.replaceAll(str, "&apos;", "'");
            str = cynthia.string.replaceAll(str, "&quot;", "\"");
            str = cynthia.string.replaceAll(str, "&amp;", "&");
            return str;
        },

        getXMLDoc: function () {
            if (document.implementation && document.implementation.createDocument) {
                return document.implementation.createDocument("", "", null);
            }

            if (window.ActiveXObject) {
                return new ActiveXObject("Msxml.DOMDocument");
            }
            return null;
        },

        getDocXML: function (doc) {
            if (doc.xml) {
                return doc.xml;
            }
            return new XMLSerializer().serializeToString(doc);
        },

        setTextContent: function (node, text) {
            while (node.childNodes.length > 0) {
                node.removeChild(node.firstChild);
            }

            if (text != "") {
                var textNode = node.ownerDocument.createTextNode("text");
                textNode.nodeValue = text;
                node.appendChild(textNode);
            }
        },

        getTextContent: function (node) {
            var value = "";

            for (var i = 0; i < node.childNodes.length; i++) {
                if (node.childNodes[i].nodeValue != null)
                    value += node.childNodes[i].nodeValue;
            }

            return trim(value);
        }
    };
    
    util.cookie = {
        read: function (name) {
            var cookieValue;
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }

                if (c.indexOf(nameEQ) == 0) {

                    cookieValue = c.substring(nameEQ.length, c.length);
                    //解决在tomcat下cookie前面带引号的问题
                    if (cookieValue.indexOf("\"") == 0)
                        cookieValue = cookieValue.substring(1, cookieValue.length - 1);
                    return decodeURIComponent(cookieValue);
                }
            }
            return null;
        },

        create: function (value) {
            var expires = "";
            var date = new Date();
            date.setTime(date.getTime() + ( 3600 * 24 * 1000 * 365 ));
            expires = "; expires=" + date.toGMTString();
            document.cookie = value + expires + "; path=/";
        },

        delete: function (name) {
            var expdate = new Date();
            expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));

            document.cookie = name + "=" + escape("") + "; expires=" + expdate.toGMTString() + "; path=/";
        }
    };

    util.object = {
        //修改underscope的findWhere方法兼容 int string查找
        findWhere : function(arr,property) {
            var findObj = null;
            if(!arr || arr.length == 0 || !property) {
                return findObj;
            }
            for(j in arr) {
                if(findObj) {
                    break;
                }
	            if(!arr[j])
		            continue;
                var find = true;
                for(var i in property) {
                    if(property.hasOwnProperty(i)) {
                        if(arr[j][i] != property[i]) {
                            find = false;
                            break;
                        }
                    }
                }
                if(find) {
                    findObj = arr[j];
                }
            }
            return findObj;
        },

        extend : function(dest, from) {
            var props = Object.getOwnPropertyNames(from), destination;
            props.forEach(function (name) {
                if (typeof from[name] === 'object') {
                    if (typeof dest[name] !== 'object') {
                        dest[name] = {}
                    }
                    this.extend(dest[name],from[name]);
                } else {
                    destination = Object.getOwnPropertyDescriptor(from, name);
                    Object.defineProperty(dest, name, destination);
                }
            });
        },

        /**
         * 获取dom元素的绝对位置
         * @param e
         * @returns {{left: *, top: *}}
         */
        getElementAbsPos : function (e) {
            var t = e.offsetTop;
            var l = e.offsetLeft;
            while(e = e.offsetParent){
                t += e.offsetTop;
                l += e.offsetLeft;
            }
            return {left:l,top:t};
        },

        /**
         * 获取元素在window窗口中的绝对位置
         * @param e
         * @returns {{top: *, left: *}}
         */
        getWindowAbsPos: function(e) {
            var l = e.getBoundingClientRect().left;
            var t = e.getBoundingClientRect().top;
            return {
                top: t,
                left: l
            }
        },

        cloneJSON : function(obj) {
            var o,i,j,k;
            if(typeof(obj)!="object" || obj===null)return obj;
            if(obj instanceof(Array)) {
                o=[];
                i=0;j=obj.length;
                for(;i<j;i++)
                {
                    if(typeof(obj[i])=="object" && obj[i]!=null)
                    {
                        o[i]=arguments.callee(obj[i]);
                    }
                    else
                    {
                        o[i]=obj[i];
                    }
                }
            }
            else {
                o={};
                for(i in obj)
                {
                    if(typeof(obj[i])=="object" && obj[i]!=null)
                    {
                        o[i]=arguments.callee(obj[i]);
                    }
                    else
                    {
                        o[i]=obj[i];
                    }
                }
            }

            return o;
        }
    };

    /**
     * local storage 操作
     * @type {{}}
     */
    util.storage = {
        set: function(key, data) {
            return window.localStorage.setItem(key, window.JSON.stringify(data));
        },
        get: function(key) {
            return window.JSON.parse(window.localStorage.getItem(key));
        },
        remove: function(key) {
            return window.localStorage.removeItem(key);
        }
    };

    module.exports = util;
});