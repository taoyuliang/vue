export default {
  install (Vue, options) {
    Vue.prototype.$labelHead = function labelHead (h, { column, index }) {
      // 设置头部样式一行显示
      let l = column.label.length
      let f = 16 //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      // column.minWidth = f * l //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      column.minWidth = 100
      //然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { 'width': '100%', } }, [column.label])

      // 拼接一起，可在后面添加详情标签
      // ,[h('div', { class: 'table-head', style: { 'width': '100%', } }, [column.label]), h(
      //   'el-tooltip',
      //   {
      //     props: {
      //       content: (function () {
      //         return `含增值说`
      //       })(),
      //       placement: 'top'
      //     }
      //   },
      //   [
      //     h('span', {
      //       class: {
      //         'el-icon-question': true
      //       }
      //     })
      //   ]
      // )]
    }
  }
}