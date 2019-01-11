'use strict';

console.log(this)

/**
 * Return a unique identifier with the given `len`.
 *
 * @param {Number} length
 * @return {String}
 * @api private
 */
module.exports.getUid = function(length) {
  let uid = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_+@!$&*#[]{}';
  const charsLength = chars.length;

  for (let i = 0; i < length; ++i) {
    uid += chars[getRandomInt(0, charsLength - 1)];
  }

  return uid;
};

/**
 * Return a random int, used by `utils.getUid()`.
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * [getQueryString description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 * @Author: bluelife 
 * @Date: 2019-01-12 02:57:01 
 * @Desc:  
 */
module.exports.getQueryString = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
  var r = window.location.search.substr(1).match(reg);
  return r != null ? unescape(r[2]) : null;
}

/**
 * [getCookie description]
 * @param  {[type]} key [description]
 * @return {[type]}      [description]
 * @Author: bluelife 
 * @Date: 2019-01-12 02:57:01 
 * @Desc:  
 */
module.exports.getCookie = function(key) {
  var v = window.document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

/**
 * [getCookie description]
 * @param  {[type]} key [description]
 * @return {[type]}      [description]
 * @Author: bluelife 
 * @Date: 2019-01-12 02:57:01 
 * @Desc:  
 */
module.exports.setCookie = function(key, value, days) {
  days = days || 7;
  var d = new Date;
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  window.document.cookie = key + '=' + value + ';path=/;expires=' + d.toGMTString();
}

/**
 * [deleteCookie description]
 * @param  {[type]} key [description]
 * @return {[type]}      [description]
 * @Author: bluelife 
 * @Date: 2019-01-12 02:57:01 
 * @Desc:  
 */
module.exports.deleteCookie = function (key){
  this.set(key, '', -1);
}

/**
 * [getGeolocation description]
 * @return {[type]}      [description]
 * @Author: bluelife 
 * @Date: 2019-01-12 02:57:01 
 * @Desc:  
 */
module.exports.getGeolocation = function() {
  if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
          console.log(position)
      }, err => {
          console.log(err)
      });
  } else {
      console.log('浏览器不支持位置服务')
  }
}

/**
 * [storageSetItem description]
 * @return {[type]}      [description]
 * @Author: bluelife 
 * @Date: 2019-01-12 02:57:01 
 * @Desc:  
 */
module.exports.storageSetItem = function(){
  if('localStorage' in window){
    window.localStorage.setItem(key, value);
  }else{
    alert('您的浏览器不支持Storage，请使用Cookie');
  }
}

/**
 * [storageGetItem description]
 * @param  {[type]} key [description]
 * @return {[type]}      [description]
 * @Author: bluelife 
 * @Date: 2019-01-12 02:57:01 
 * @Desc:  
 */
module.exports.storageGetItem = function(key){
  if('localStorage' in window){
    window.localStorage.getItem(key);
  }else{
    alert('您的浏览器不支持Storage，请使用Cookie');
  }
}

/**
 * [storageDeleteItem description]
 * @return {[type]}      [description]
 * @Author: bluelife 
 * @Date: 2019-01-12 02:57:01 
 * @Desc:  
 */
module.exports.storageDeleteItem = function(){
  if('localStorage' in window){
    window.localStorage.removeItem(key);
  }
}

/**
 * [storageClear description]
 * @return {[type]}      [description]
 * @Author: bluelife 
 * @Date: 2019-01-12 02:57:01 
 * @Desc:  
 */
module.exports.storageClear = function(){
  if('localStorage' in window){
    window.localStorage.clear();
  }
}