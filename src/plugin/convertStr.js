export default {
  install (Vue, options) {
    // 下划线去掉后首字母转大写（转驼峰）
    Vue.prototype.$splitDownLineandAfterToUpperCase = function splitDownLineandAfterToUpperCase (str) {
      var s = str.split('_');
      var newA = "";
      for (var i = 1; i < s.length; i++) {
        newA += s[i].substring(0, 1).toUpperCase() + s[i].substring(1);
      }
      return newA = s[0] + newA;
    }

  }
}