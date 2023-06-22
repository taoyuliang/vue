<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-select v-model="ExamDate" placeholder="请选择场次" tabindex="1" @change="handle_ChangeExam">
          <el-option v-for="item in examList" :label="item.ExamName" :value="item.ExamDate"></el-option>
        </el-select>
        <el-button style="margin-left:10px" icon="el-icon-edit" @click="handle_SetSelectList()" type="success">
          <!-- :loading="listLoadingBtn" -->
          批量推送
        </el-button>
      </div>
      <el-table v-loading="listLoading" style="width: 100%" height="700" :data="dataList.data.filter(
          (data) =>
            !search ||
            data.ExamRoomName.toLowerCase().includes(search.toLowerCase())
        )
        " @selection-change="handle_SelectList" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column type="selection" width="55" />
        <el-table-column label="考场" prop="ExamRoomName">
          <template slot-scope="scope">
            {{ scope.row.ExamRoomName }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="StudentName">
          <template slot-scope="scope">
            {{ scope.row.StudentName }}
          </template>
        </el-table-column>
        <el-table-column label="组号" prop="GroupNo">
          <template slot-scope="scope">
            {{ scope.row.GroupNo }}
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="OrderNo">
          <template slot-scope="scope">
            {{ scope.row.OrderNo }}
          </template>
        </el-table-column>
        <el-table-column label="分数" prop="Score">
          <template slot-scope="scope">
            {{ scope.row.Score }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" placeholder="输入关键字搜索" size="mini" />
          </template>
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" @click="handle_Edit(scope.row)" size="mini" type="primary">
              推送面试成绩通知
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingScorePushList, setSingScorePushList, getExamList } from '@/api/nodeApi'

var _self
export default {
  components: {
  },
  computed: {
    ...mapGetters([
    ])
  },
  name: 'pushsocre',
  data () {
    return {
      search: '',
      // 列表操作显隐(默认显示)
      //表格数据
      dataList: {
        data: [],
      },
      listLoading: false,
      listLoadingBtn: false,
      // 场次数据
      ExamDate: null,
      examList: [],
      // 定时器
      timeOut: 5000,
      timer: null,
      // 批量选中
      selectDataList: []
    }
  },
  watch: {

  },
  created () {
    _self = this
    _self.fetchData()
  },
  mounted () {
    // this.timer = setInterval(() => {
    //   this.handle_SingScorePushList()
    // }, this.timeOut);
  },
  methods: {
    async fetchData () {
      await this.handle_GetExamList()
      this.handle_SingScorePushList()
    },
    //选择考生结果
    handle_SelectList (rows) {
      // true就是选中，0或者false是取消选中
      const selected = rows.length > 0
      if (selected !== false)
        _self.selectDataList = rows
      else
        _self.selectDataList = []
    },
    // 批量选中设置
    async handle_SetSelectList () {
      if (_self.selectDataList.length < 1) {
        this.$notify({
          title: '警告',
          message: '请选择考生！',
          type: 'warning'
        });
        return
      }

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      // _self.listLoadingBtn = true
      for (let index = 0; index < _self.selectDataList.length; index++) {
        const params = _self.selectDataList[index];
        await setSingScorePushList(params)
      }

      _self.$notify({
        title: '成功',
        message: '推送完成。',
        type: 'success'
      });

      loading.close();
      // _self.listLoadingBtn = false
      _self.handle_SingScorePushList();
    },
    handle_SingScorePushList () {
      if (!this.ExamDate)
        return
      let params = { ExamDate: this.ExamDate }
      getSingScorePushList(params).then(rest => {
        // console.log('获取可推送通知列表：', JSON.stringify(rest.data))

        this.$set(this.dataList, 'data', rest.data)
      })
    },
    // 选择场次
    handle_ChangeExam () {
      this.handle_SingScorePushList()
    },
    // 获取场次列表
    async handle_GetExamList () {
      let rest = await getExamList()
      this.examList = rest.data
      if (this.examList.length > 0) {
        this.ExamDate = this.examList[0].ExamDate
      }
    },
    // 模态框
    handle_Edit (item) {
      let params = item
      setSingScorePushList(params).then(rest => {
        this.$notify({
          title: '成功',
          message: '推送通知。',
          type: 'success'
        });

        this.handle_SingScorePushList();
      })
    },
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped></style>
