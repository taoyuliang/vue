export default {
  install (Vue, options) {
    // Excel下载
    Vue.prototype.$excelDown = function excelDownload (listData, header, headerVal, filename, autoWidth, bookType) {
      // console.log(this.total)
      import('@/vendor/Export2Excel').then(excel => {
        const data = listData.map(v => headerVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
        excel.export_json_to_excel({
          header: header,
          data,
          filename: filename,
          autoWidth: autoWidth,
          bookType: bookType
        })
      })
    }
  }
}