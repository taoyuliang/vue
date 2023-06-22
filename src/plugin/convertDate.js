export default {
  install (Vue, options) {
    // 特殊日期格式化
    Vue.prototype.$convertDate = function convertDate (cellValue) {
      if (cellValue == null || cellValue == "") return "";
      let d = new Date(cellValue);  //传入时间
      let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
      let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      let min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      let sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      let times = d.getFullYear() + '-' + month + '-' + day + " " + hours + ':' + min + ':' + sec;
      return times;
    }
    //时间戳转换方法    date:时间戳数字
    Vue.prototype.$formatDate = function formatDate (date) {
      var date = new Date(date);
      var YY = date.getFullYear() + '-';
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return YY + MM + DD;
    }
    //周岁计算
    Vue.prototype.$oneFullYear = function oneFullYear (endDate, startDate) {
      //得到时间戳相减 得到以毫秒为单位的差
      let mmSec = (new Date(endDate).getTime() - new Date(startDate).getTime());
      //单位转换 返回周岁
      let age = parseInt(mmSec / 3600000 / 24 / 365)
      return age
    }
    // 比较日期大小
    Vue.prototype.$compareDate = function compareDate (startDate, endDate) {
      var oDate1 = new Date(startDate);
      var oDate2 = new Date(endDate);
      if (oDate1.getTime() > oDate2.getTime())
        return false
      return true
    }

  }
}