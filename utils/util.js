// 字符串转byte
function stringToBytes(str) {
  var strArray = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    strArray[i] = str.charCodeAt(i);
  }
  const array = new Uint8Array(strArray.length)
  strArray.forEach((item, index) => array[index] = item)
  return array.buffer;
}

// ArrayBuffer转16进制字符串示例
function ab2hext(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

//16进制转字符串
function hexToString(str) {
  var trimedStr = str.trim();
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x" ?
      trimedStr.substr(2) :
      trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    // alert("Illegal Format ASCII Code!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

/*微信app版本比较*/
function versionCompare(ver1, ver2) {
  var version1pre = parseFloat(ver1)
  var version2pre = parseFloat(ver2)
  var version1next = parseInt(ver1.replace(version1pre + ".", ""))
  var version2next = parseInt(ver2.replace(version2pre + ".", ""))
  if (version1pre > version2pre)
    return true
  else if (version1pre < version2pre)
    return false
  else {
    if (version1next > version2next)
      return true
    else
      return false
  }
}

/*获取日期,不带分隔*/
function formatDate(date) {
  var year = date.getFullYear();//获取完整的年份(4位,1970-????)  date.getYear();//获取当前年份(2位)
  var month = date.getMonth() + 1//获取当前月份(0-11,0代表1月)（）
  var date = date.getDate()//获取当前日(1-31)
  var day = "01" //date.getDay()+1//获取当前星期几,0开始.有错，直接赋值为1
  return [year, month, date, day].map(formatNumber).join('')//去除了分隔符号
}
/*获取时间，不带分隔*/
function formatTime(date, divide) {
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds() 
  var milliseconds = date.getMilliseconds()//获取当前毫秒数(0-999)
  var frame = Math.floor(milliseconds/divide)//向下取整
  return [hour, minute, second].map(formatNumber).join('')//去除了分隔符号
}

/*获取毫秒数*/
function getMilliseconds(date) {
  var milliseconds = date.getMilliseconds()//获取当前毫秒数(0-999)
  return milliseconds
}

/*获取日期,带分隔，单给显示*/
function formatDateToView(date) {
  var year = date.getFullYear()//获取完整的年份(4位,1970-????)  date.getYear();//获取当前年份(2位)
  var month = date.getMonth() + 1//获取当前月份(0-11,0代表1月)（）
  var day = date.getDate()//获取当前日(1-31)
  return [year, month, day].map(formatNumber).join('-')
}
/*获取时间，带分隔，单给显示*/
function formaotTimeToView(date, divide) {
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var milliseconds = date.getMilliseconds()//获取当前毫秒数(0-999)
  var frame = Math.floor(milliseconds/divide)//向下取整
  return [hour, minute, second,frame].map(formatNumber).join(':')
}
 
//return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second,milliseconds].map(formatNumber).join(':')
/*格式化时间相关数字*/
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//module.exports 对象是由模块系统创建的。在我们自己写模块的时候，
//需要在模块最后写好模块接口，声明这个模块对外暴露什么内容，module.exports 提供了暴露接口的方法。
module.exports = {
  stringToBytes: stringToBytes,
  ab2hext: ab2hext,
  hexToString: hexToString,
  versionCompare: versionCompare,
  formatTime: formatTime,
  formatDate:formatDate,
  formatDateToView:formatDateToView,
  formaotTimeToView:formaotTimeToView,
  getMilliseconds:getMilliseconds
}
