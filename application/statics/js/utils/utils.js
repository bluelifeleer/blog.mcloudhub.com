'use strict';
(function(global, factory) {
    if (typeof module == 'object' && typeof module.exports == 'object') {
        module.exports = global.document ? factory(global, true) : function(w) {
            if (!w.document) {
                throw new Error("jQuery requires a window with a document");
            }
            // 如果不是浏览器，将函数返回
            return factory(global);
        }
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function(window, noGlobal) {
    'use strict';
    const Utils = {
        /**
         * [getQueryString description]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         * @Author: bluelife 
         * @Date: 2019-01-12 02:57:01 
         * @Desc:  
         */
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
            var r = window.location.search.substr(1).match(reg);
            return r != null ? unescape(r[2]) : null;
        },
        /**
         * [getCookie description]
         * @param  {[type]} key [description]
         * @return {[type]}      [description]
         * @Author: bluelife 
         * @Date: 2019-01-12 02:57:01 
         * @Desc:  
         */
        getCookie: function(key) {
            var v = window.document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return v ? v[2] : null;
        },
        /**
         * [getCookie description]
         * @param  {[type]} key [description]
         * @return {[type]}      [description]
         * @Author: bluelife 
         * @Date: 2019-01-12 02:57:01 
         * @Desc:  
         */
        setCookie: function(key, value, days) {
            days = days || 7;
            var d = new Date;
            d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
            window.document.cookie = key + '=' + value + ';path=/;expires=' + d.toGMTString();
        },
        /**
         * [deleteCookie description]
         * @param  {[type]} key [description]
         * @return {[type]}      [description]
         * @Author: bluelife 
         * @Date: 2019-01-12 02:57:01 
         * @Desc:  
         */
        deleteCookie: function(key) {
            this.set(key, '', -1);
        },
        /**
         * [getGeolocation description]
         * @return {[type]}      [description]
         * @Author: bluelife 
         * @Date: 2019-01-12 02:57:01 
         * @Desc:  
         */
        getGeolocation: function() {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    console.log(position)
                }, err => {
                    console.log(err)
                });
            } else {
                console.log('浏览器不支持位置服务')
            }
        },
        /**
         * [storageSetItem description]
         * @return {[type]}      [description]
         * @Author: bluelife 
         * @Date: 2019-01-12 02:57:01 
         * @Desc:  
         */
        storageSetItem: function() {
            if ('localStorage' in window) {
                window.localStorage.setItem(key, value);
            } else {
                alert('您的浏览器不支持Storage，请使用Cookie');
            }
        },
        /**
         * [storageGetItem description]
         * @param  {[type]} key [description]
         * @return {[type]}      [description]
         * @Author: bluelife 
         * @Date: 2019-01-12 02:57:01 
         * @Desc:  
         */
        storageGetItem: function(key) {
            if ('localStorage' in window) {
                window.localStorage.getItem(key);
            } else {
                alert('您的浏览器不支持Storage，请使用Cookie');
            }
        },
        /**
         * [storageDeleteItem description]
         * @return {[type]}      [description]
         * @Author: bluelife 
         * @Date: 2019-01-12 02:57:01 
         * @Desc:  
         */
        storageDeleteItem: function() {
            if ('localStorage' in window) {
                window.localStorage.removeItem(key);
            }
        },
        /**
         * [storageClear description]
         * @return {[type]}      [description]
         * @Author: bluelife 
         * @Date: 2019-01-12 02:57:01 
         * @Desc:  
         */
        storageClear: function() {
            if ('localStorage' in window) {
                window.localStorage.clear();
            }
        },
        /**
         * [formateDate description]
         * @return {[type]}      [description]
         * @Author: bluelife 
         * @Date: 2019-01-12 02:57:01 
         * @Desc:  
         */
        formateDate: function(date) {
            let MyDate = date ? new Date(date) : new Date();
            return MyDate.getFullYear() + '-' + ((MyDate.getMonth() + 1) <= 9 ? '0' + (MyDate.getMonth() + 1) : (MyDate.getMonth() + 1)) + '-' + (MyDate.getDate() <= 9 ? '0' + MyDate.getDate() : MyDate.getDate()) + ' ' + (MyDate.getHours() <= 9 ? '0' + MyDate.getHours() : MyDate.getHours()) + ':' + (MyDate.getMinutes() <= 9 ? '0' + MyDate.getMinutes() : MyDate.getMinutes()) + ':' + (MyDate.getSeconds() <= 9 ? '0' + MyDate.getSeconds() : MyDate.getSeconds());
        },
        message: function() {

        }
    }
    if (!noGlobal) {
        window.Utils = window.$U = Utils;
    } else {
        return Utils;
    }
});