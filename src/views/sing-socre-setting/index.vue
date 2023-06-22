<template>
  <div class="app-container">
    <el-form ref="listInfo" :rules="rules" :model="listInfo" label-position="left" label-width="150px"
      style="width: 50%; margin-left: 50px">
      <el-form-item label="面试通知标题" prop="interviewInformTitle">
        <el-input v-model="listInfo.interviewInformTitle" />
      </el-form-item>
      <el-form-item label="自动通知间隔" prop="automaticNotificationTime">
        <el-input v-model="listInfo.automaticNotificationTime" type="number" :min="0" />
        <span style="color:brown;">请输入自动通知间隔（0 为不启用，单位：分钟）</span>
        <!-- <el-date-picker v-model="listInfo.automaticNotificationTime" type="datetime" placeholder="选择自动通知时间间隔（分钟）">
        </el-date-picker> -->
      </el-form-item>
      <el-form-item label="语音通知次数" prop="automaticNotificationNumber">
        <el-input v-model="listInfo.automaticNotificationNumber" type="number" :min="0" />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="handle_SaveButExam()">
          成绩播报设置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex"; //引用全局变量
import { getExamParamInfo, setExamParamInfo } from '@/api/nodeApi'

var _self

export default {
  name: "pushsocre-data-list",
  props: [],//属性
  components: {},
  computed: {
    ...mapGetters([

    ])
  },
  data () {
    return {
      rules: {
        interviewInformTitle: [{ required: true, message: '面试通知标题不能为空', trigger: 'blur' }],
        automaticNotificationTime: [{ required: true, message: '自动通知间隔不能为空', trigger: 'blur' }],
        automaticNotificationNumber: [{ required: true, message: '语音通知次数不能为空', trigger: 'blur' }]
      },
      // 添加编辑信息
      listInfo: {},
    }
  },
  watch: {

  },
  created () {
    _self = this
    this.restData()
    this.fetchData()
  },
  methods: {
    async fetchData () {
      let params = { ParamName: 'SingScoreTitle' }
      let restParam1 = await getExamParamInfo(params)
      params = { ParamName: 'SingScoreAutoTime' }
      let restParam2 = await getExamParamInfo(params)
      params = { ParamName: 'SingScoreAutoNumber' }
      let restParam3 = await getExamParamInfo(params)

      this.$set(this.listInfo, 'interviewInformTitle', restParam1.data == '1' ? '' : restParam1.data)
      this.$set(this.listInfo, 'automaticNotificationTime', restParam2.data)
      this.$set(this.listInfo, 'automaticNotificationNumber', restParam3.data)
    },
    // 考场选择
    handle_ChangeRoom () {

    },
    // 考生复选框选择
    handleCheckedCitiesChange (value) {

    },
    // 推送成绩播报提交
    handle_SaveButExam () {
      this.$refs.listInfo.validate(async (valid) => {
        if (valid) {
          // let time =  _self.$convertDate(_self.listInfo.automaticNotificationTime)
          if (this.listInfo.automaticNotificationNumber < 1) {
            this.$notify({
              title: '警告',
              message: '通知播报次数应大于1。',
              type: 'warning'
            });
            return
          }

          let time = _self.listInfo.automaticNotificationTime
          let params = { ParamName: "SingScoreTitle", ParamValue: _self.listInfo.interviewInformTitle }
          await setExamParamInfo(params)
          params = { ParamName: "SingScoreAutoTime", ParamValue: time }
          await setExamParamInfo(params)
          params = { ParamName: "SingScoreAutoNumber", ParamValue: this.listInfo.automaticNotificationNumber }
          await setExamParamInfo(params)

          this.$notify({
            title: '成功',
            message: '设置完成。',
            type: 'success'
          });
        }
      })
    },
    // 重置数据
    restData () {
      this.listInfo = {}
    },
    //移除表单验证
    restModelRules () {
      this.$nextTick(() => {
        this.$refs['listInfo'].clearValidate()
      })
    },
  }
}

</script>


