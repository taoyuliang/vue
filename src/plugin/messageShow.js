export default {
  install (Vue, options) {
    // 成功提示框
    Vue.prototype.$messageSuccess = function messageSuccess (e) {
      //更新视图
      this.$forceUpdate()
      this.$notify({
        title: 'Success',
        message: e,
        type: 'success',
        duration: 2000
      })
    }
    Vue.prototype.$messageWarning = function messageWarning (e) {
      //更新视图
      this.$forceUpdate()
      this.$notify({
        title: 'Warning',
        message: e,
        type: 'warning',
        duration: 2000
      })
    }
  }
}