export default {
  install (Vue, options) {
    // 根据对象名获取对象索引
    Vue.prototype.$findArrayIndex = function findArrayIndex (data, name, value) {
      return data.findIndex(function (item) {
        return item[name] === value;
      })
    }
    // 将一个数组拆分成多个小数组
    Vue.prototype.$arraySlice = function arraySlice (data, chunk) {
      var dataList = []
      // var chunk = 4; //每4个分一组

      for (var i = 0, j = data.length; i < j; i += chunk) {
        dataList.push(data.slice(i, i + chunk));
      }
      return dataList
    }
  }
}