String.format = function () {

    if (arguments.length == 0) {
        return null;
    }

    var str = arguments[0];

    for (var i = 1; i < arguments.length; i++) {

        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

(function ($, win) {
    function idb_Core() {
        var that = this;
        this.unit = new idb_Core_unit();
    };

    win.idb = new idb_Core();
})(jQuery, window);

function idb_Core_unit() {
    var that = this;

    this.test = function () {
        alert("xxxx");
    };
    this.hasClass = function (ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };
    this.addClass = function (ele, cls) {
        if (!that.hasClass(ele, cls)) ele.className += " " + cls;
    };
    this.removeClass = function (ele, cls) {
        if (that.hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    };
    this.getRandom = function (max) {
        var num1 = null,
            num2 = null;
        num1 = Math.floor(Math.random() * max);
        num2 = Math.floor(Math.random() * max);
        while (num2 == num1) {
            num2 = Math.floor(Math.random() * max);
        }

        var result = new Array();
        result[0] = num1;
        result[1] = num2;

        return result;
    };
    this.getTimeTick = function () {
        return (new Date()).valueOf();
    };
    this.clone = function (obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0; i < obj.length; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    this.getRandomString = function (length) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }

        var str = '';
        for (var i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    };
};