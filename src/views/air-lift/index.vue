<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-upload ref="upload" :on-success="uploadSuccess" :on-change="handleChange" :auto-upload="false"
          :action="fileUrl" :on-error="uploadError" multiple :file-list="fileList">
          <!-- :headers="myHeader" -->
          <!-- :data="myData" -->
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
        <!-- 解析files组件 -->
        <upload-excel-component v-show="false" ref="excelUp" :on-success="handleSuccess" />
      </div>
      <el-table style="width: 100%" height="700" :data="dataList.slice((currentPage - 1) * PageSize, currentPage * PageSize).filter(
        (data) =>
          !search ||
          data.begin_port.toLowerCase().includes(search.toLowerCase())
      )
        " element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="起运港" prop="begin_port">
          <template slot-scope="scope">
            {{ scope.row.begin_port }}
          </template>
        </el-table-column>
        <el-table-column label="目的港" prop="end_port">
          <template slot-scope="scope">
            {{ scope.row.end_port }}
          </template>
        </el-table-column>
        <el-table-column label="中转港" prop="transfer_port">
          <template slot-scope="scope">
            {{ scope.row.transfer_port }}
          </template>
        </el-table-column>
        <el-table-column label="航班周期" prop="flight_period">
          <template slot-scope="scope">
            {{ scope.row.flight_period }}
          </template>
        </el-table-column>
        <el-table-column label="航司" prop="airline">
          <template slot-scope="scope">
            {{ scope.row.airline }}
          </template>
        </el-table-column>
        <el-table-column label="时效" prop="timeliness">
          <template slot-scope="scope">
            {{ scope.row.timeliness }}
          </template>
        </el-table-column>
        <el-table-column label="货型" prop="goods_type">
          <template slot-scope="scope">
            {{ scope.row.goods_type }}
          </template>
        </el-table-column>
        <el-table-column label="45+" prop="number1">
          <template slot-scope="scope">
            {{ scope.row.number1 }}
          </template>
        </el-table-column>
        <el-table-column label="100+" prop="number2">
          <template slot-scope="scope">
            {{ scope.row.number2 }}
          </template>
        </el-table-column>
        <el-table-column label="300+" prop="number3">
          <template slot-scope="scope">
            {{ scope.row.number3 }}
          </template>
        </el-table-column>
        <el-table-column label="500+" prop="number4">
          <template slot-scope="scope">
            {{ scope.row.number4 }}
          </template>
        </el-table-column>
        <el-table-column label="1000+" prop="number5">
          <template slot-scope="scope">
            {{ scope.row.number5 }}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-if="totalCount > 0" style="margin-left: 1%; margin-top: 20px" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
  </div>
</template>

<script>
import { add_List, get_Info, set_List, del_List, get_List, executeSql } from '@/api/nodeApi'
import Papa from 'papaparse';
import UploadExcelComponent from '@/components/UploadExcelTwo/index.vue'
import XLSX from 'xlsx'

import { mapGetters } from 'vuex'

var _self
export default {
  components: {
    UploadExcelComponent
  },
  computed: {
    ...mapGetters([
    ])
  },
  name: 'drug-list',
  data () {
    return {
      search: '',
      // 列表操作显隐(默认显示)
      //表格数据
      dataList: [],
      listLoading: false,

      // 导入
      fileUrl: '',
      fileList: [],
      files: null,
      fieldTable: [],
      tableData: [],
      tableHeader: [],// 字段下拉绑定

      showTable: false,
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [1, 5, 10, 50],
      // 默认每页显示的条数（可修改）
      PageSize: 10,

      tableHeaderInfo: [
        { label: '起运港', value: 'begin_port' },
        { label: '目的港', value: 'end_port' },
        { label: '中转港', value: 'transfer_port' },
        { label: '航班周期', value: 'flight_period' },
        { label: '航司', value: 'airline' },
        { label: '时效', value: 'timeliness' },
        { label: '货型', value: 'goods_type' },
        { label: '45+', value: 'number1' },
        { label: '100+', value: 'number2' },
        { label: '300+', value: 'number3' },
        { label: '500+', value: 'number4' },
        { label: '1000+', value: 'number5' },
      ]
    }
  },
  watch: {

  },
  created () {
    _self = this
    _self.fetchData()
  },
  mounted () {

  },
  methods: {
    fetchData () {
      let param = { data: {}, gether: "t_port_trade" }
      get_List(param).then(rest => {
        this.dataList = rest.data
        this.totalCount = this.dataList.length
        if (this.totalCount != 0 && this.totalCount != 5 && this.totalCount != 10 && this.totalCount != 50) {
          this.pageSizes = [1, 5, 10, 50, this.totalCount]
        }
        // console.log('数据列表：', JSON.stringify(rest.data))
      })
    },
    // 文件选择
    handleChange (file, fileLists) {
      this.fileList = fileLists.slice(-1);
      this.$refs.excelUp.readerData(file.raw)
    },
    // 返回解析后的files
    handleSuccess ({ files }) {
      _self.files = files
      _self.fieldTable = files.SheetNames

      if (_self.fieldTable && _self.fieldTable.length > 0) {
        _self.handelSelectTable(_self.fieldTable[0])
      }
    },
    // 选择表
    handelSelectTable (val) {
      let worksheet = _self.files.Sheets[val]
      _self.tableHeader = this.$refs.excelUp.getHeaderRow(worksheet)
      // console.log('解析导入表头：', JSON.stringify(_self.tableHeader))
      const sheet2JSONOpts = {
        defval: null//给defval赋值为空的字符串
      }
      _self.tableData = XLSX.utils.sheet_to_json(worksheet, sheet2JSONOpts)
      // console.log('解析导入数据：', JSON.stringify(_self.tableData))

      this.$confirm('确认导入此数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        await executeSql({ data: "truncate table `t_port_trade`", gether: "t_port_trade" })

        for (let index = 0; index < _self.tableData.length; index++) {
          const item = _self.tableData[index];

          let filed = ''; let values = ''; let update = ''

          for (let index2 = 0; index2 < _self.tableHeaderInfo.length; index2++) {
            const item2 = _self.tableHeaderInfo[index2];

            if (index2 != 0) {
              filed += ',';
              values += ',';
              update += ',';
            }

            filed += item2.value;
            values += item[item2.label] ? "'" + item[item2.label] + "'" : "''";
            update += (item2.value + '=') + (item[item2.label] ? "'" + item[item2.label] + "'" : "''");
          }

          let data = 'insert into t_port_trade(' + filed + ')' + 'VALUES(' + values + ') ON DUPLICATE KEY UPDATE ' + update
          let params = { data: data, gether: "t_port_trade" }

          executeSql(params).then(rest => {

          })
        }

        _self.fetchData()
        _self.$messageSuccess('导入成功。')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消导入。'
        })
      })
    },
    // 文件上传成功
    uploadSuccess (response, file, fileList) {
      if (response.code === 20000) {
        // 初始化
        _self.fielPath = response.data

        this.$notify({
          title: 'Success',
          message: '上传成功。',
          type: 'success',
          duration: 2000
        })
      }
    },
    uploadError (response, file, fileList) {
      this.$notify.error({
        title: 'Error',
        message: '上传失败。'
      })
    },

    // 分页
    // 每页显示的条数
    handleSizeChange (val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
    },
    // 显示第几页
    handleCurrentChange (val) {
      // 改变默认的页数
      this.currentPage = val;
    },
  }
}
</script>

<style lang="scss" scoped></style>
