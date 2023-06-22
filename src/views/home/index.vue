<template>
  <div id="app">
    <div class="head">
      <div class="head_content1">
        <el-image style="height: 100%" :src="url"></el-image>
      </div>
      <div class="head_content2">
        <div style="margin-right: 2%;">{{ title }} </div>
        <div style="margin-right: 2%;">国际海运出口</div>
        <div>国内拖车</div>
      </div>
      <div class="head_content3">客服信息 QQ:1940039680</div>
      <div class="head_content4">邮箱:foches@fcysfreight.com</div>
    </div>

    <div class="query">
      <div>起运港
        <el-select filterable @change="handle_SelectBeginPort()" v-model="begin_port_value" placeholder="请选择"
          :clearable="true">
          <el-option v-for="item in begin_port_list" :key="item.begin_port" :label="item.begin_port"
            :value="item.begin_port">
          </el-option>
        </el-select>
      </div>
      <div style="margin-left: 50px;">目的港
        <el-select filterable @change="handle_SelectEndPort()" v-model="end_port_value" placeholder="请选择"
          :clearable="true">
          <el-option v-for="item in end_port_list" :key="item.end_port" :label="item.end_port" :value="item.end_port">
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- <div class="query2">
      <div class="query2_content1">
        <div class="query2_content1_text">航空公司</div>
      </div>
      <div class="query2_content2">起运地</div>
      <div class="query2_content3">目的港</div>
    </div> -->

    <!-- 数据展示 -->
    <div class="content">
      <div class="card content_1 bg_green">
        <div v-for="head in tableHeaderInfo">{{ head.label }}</div>
      </div>
      <div v-for="item in dataList" class="card content_1">
        <div v-for="item2 in tableHeaderInfo">
          <!-- <div>{{ item2.label }}</div> -->
          <div style="margin-top: 15px;">{{ item[item2.value] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _self
import { mapGetters } from 'vuex'
import { add_List, get_Info, set_List, del_List, get_List, executeSql } from '@/api/nodeApi'

export default {
  name: "app",
  inject: ['reload'],
  data () {
    return {
      // 数据列表
      dataList: [],
      search: '',
      // 定制器
      timer: null,
      title: '国际空运出口',

      url: require('@/assets/images/logo.png'),
      begin_port_list: [],
      end_port_list: [],
      begin_port_value: '',
      end_port_value: '',

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
    };
  },
  computed: {

  },
  components: {

  },
  created () {
    _self = this
    this.fetchData();

    // 页面数据加载时显示的遮罩动画
    const loading = this.$loading({
      lock: true,
      text: "数据加载中...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    setTimeout(() => {
      loading.close();
    }, 2000);
  },
  mounted () {

  },
  methods: {
    fetchData () {
      this.handle_GetBeginPort()
      this.handle_GetEndPort()
      this.handle_GetPortTrade()
    },
    handle_GetPortTrade () {
      let data = {}
      if (this.begin_port_value != '' && this.begin_port_value) {
        data['begin_port'] = this.begin_port_value
      }
      if (this.end_port_value != '' && this.end_port_value) {
        data['end_port'] = this.end_port_value
      }
      let param = { data, gether: "t_port_trade" }
      get_List(param).then(rest => {
        this.dataList = rest.data
        // this.totalCount = this.dataList.length
        // console.log('数据列表：', JSON.stringify(rest.data))
      })
    },
    handle_GetBeginPort () {
      let params = { data: "select begin_port from t_port_trade GROUP BY begin_port", gether: "t_port_trade" }
      executeSql(params).then(rest => {
        this.begin_port_list = rest.data
      })
    },
    handle_GetEndPort () {
      let params = { data: "select end_port from t_port_trade GROUP BY end_port", gether: "t_port_trade" }
      executeSql(params).then(rest => {
        this.end_port_list = rest.data
      })
    },
    handle_SelectBeginPort () {
      this.handle_GetPortTrade()
    },
    handle_SelectEndPort () {
      this.handle_GetPortTrade()
    },
    // 获取系统时间
    getTime () {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      const str = "";
      if (this.hour > 12) {
        this.hour -= 12;
        this.str = " AM";
      } else {
        this.str = " PM";
      }
      this.month = check(month);
      this.day = check(day);
      this.hour = check(hour);
      this.minute = check(minute);
      this.second = check(second);
      function check (i) {
        const num = i < 10 ? "0" + i : i;
        return num;
      }
      this.nowDate = year + "年" + this.month + "月" + this.day + "日";
      this.nowTime = this.hour + ":" + this.minute + ":" + this.second
    },
    setTimer (interval) {
      this.timer = setInterval(() => {
        this.getTime();
        clearInterval(this.timer);
        this.setTimer(1000);
      }, interval);
    },
    fetchDateTime () {
      var flip = document.getElementById('flip')
      var backNode = document.querySelector('.back')
      var frontNode = document.querySelector('.front')
      // 当前数字
      var count = 0
      // 是否正在翻转（防止翻转未结束就进行下一次翻转）
      var isFlipping = false
      // 向下翻转+1
      function flipDown () {
        // 如果处于翻转中，则不执行
        if (isFlipping) {
          return false
        }
        // 设置前牌的文字
        frontNode.setAttribute('class', 'digital front number' + count)
        // 计算后牌文字（越界判断）
        var nextCount = count >= 9 ? 0 : (count + 1)
        // 设置后牌的文字
        backNode.setAttribute('class', 'digital back number' + nextCount)
        // 添加go，执行翻转动画
        flip.setAttribute('class', 'flip down go')
        // 将翻转态设置为true
        isFlipping = true
        // 翻转结束后，恢复状态
        setTimeout(function () {
          // 去掉go
          flip.setAttribute('class', 'flip down')
          // 将翻转态设置为false
          isFlipping = false
          // 设置前牌文字为+1后的数字
          frontNode.setAttribute('class', 'digital front number' + nextCount)
          // 更新当前文字
          count = nextCount
        }, 1000)
      }
      // 向上翻转-1（同理，注释略）
      function flipUp () {
        if (isFlipping) {
          return false
        }
        frontNode.setAttribute('class', 'digital front number' + count)
        var nextCount = count <= 0 ? 9 : (count - 1)
        backNode.setAttribute('class', 'digital back number' + nextCount)
        flip.setAttribute('class', 'flip up go')
        isFlipping = true
        setTimeout(function () {
          flip.setAttribute('class', 'flip up')
          isFlipping = false
          frontNode.setAttribute('class', 'digital front number' + nextCount)
          count = nextCount
        }, 1000)
      }

      function Flipper (config) {
        // 默认配置
        this.config = {
          // 时钟模块的节点
          node: null,
          // 初始前牌文字
          frontText: 'number0',
          // 初始后牌文字
          backText: 'number1',
          // 翻转动画时间（毫秒，与翻转动画CSS 设置的animation-duration时间要一致）
          duration: 500
        }
        // 节点的原本class，与html对应，方便后面添加/删除新的class
        this.nodeClass = {
          flip: 'flip',
          front: 'digital front',
          back: 'digital back'
        }
        // 覆盖默认配置
        Object.assign(this.config, config)
        // 定位前后两个牌的DOM节点
        this.frontNode = this.config.node.querySelector('.front')
        this.backNode = this.config.node.querySelector('.back')
        // 是否处于翻牌动画过程中（防止动画未完成就进入下一次翻牌）
        this.isFlipping = false
        // 初始化
        this._init()
      }
      Flipper.prototype = {
        constructor: Flipper,
        // 初始化
        _init: function () {
          // 设置初始牌面字符
          this._setFront(this.config.frontText)
          this._setBack(this.config.backText)
        },
        // 设置前牌文字
        _setFront: function (className) {
          this.frontNode.setAttribute('class', this.nodeClass.front + ' ' + className)
        },
        // 设置后牌文字
        _setBack: function (className) {
          this.backNode.setAttribute('class', this.nodeClass.back + ' ' + className)
        },
        _flip: function (type, front, back) {
          // 如果处于翻转中，则不执行
          if (this.isFlipping) {
            return false
          }
          // 设置翻转状态为true
          this.isFlipping = true
          // 设置前牌文字
          this._setFront(front)
          // 设置后牌文字
          this._setBack(back)
          // 根据传递过来的type设置翻转方向
          let flipClass = this.nodeClass.flip;
          if (type === 'down') {
            flipClass += ' down'
          } else {
            flipClass += ' up'
          }
          // 添加翻转方向和执行动画的class，执行翻转动画
          this.config.node.setAttribute('class', flipClass + ' go')
          // 根据设置的动画时间，在动画结束后，还原class并更新前牌文字
          setTimeout(() => {
            // 还原class
            this.config.node.setAttribute('class', flipClass)
            // 设置翻转状态为false
            this.isFlipping = false
            // 将前牌文字设置为当前新的数字，后牌因为被前牌挡住了，就不用设置了。
            this._setFront(back)
          }, this.config.duration)
        },
        // 下翻牌
        flipDown: function (front, back) {
          this._flip('down', front, back)
        },
        // 上翻牌
        flipUp: function (front, back) {
          this._flip('up', front, back)
        }
      }

      // 定位时钟模块
      let clock = document.getElementById('clock')
      // 定位6个翻板
      let flips = clock.querySelectorAll('.flip')
      // 获取当前时间
      let now = new Date()
      // 格式化当前时间，例如现在是20:30:10，则输出"203010"字符串
      let nowTimeStr = formatDate(now, 'hhiiss')
      // 格式化下一秒的时间
      let nextTimeStr = formatDate(new Date(now.getTime() + 1000), 'hhiiss')
      // 定义牌板数组，用来存储6个Flipper翻板对象
      let flipObjs = []
      for (let i = 0; i < flips.length; i++) {
        // 创建6个Flipper实例，初始化并存入flipObjs
        flipObjs.push(new Flipper({
          // 每个Flipper实例按数组顺序与翻板DOM的顺序一一对应
          node: flips[i],
          // 按数组顺序取时间字符串对应位置的数字
          frontText: 'number' + nowTimeStr[i],
          backText: 'number' + nextTimeStr[i]
        }))
      }

      // 正则格式化日期
      function formatDate (date, dateFormat) {
        /* 单独格式化年份，根据y的字符数量输出年份
         * 例如：yyyy => 2019
         *      yy => 19
         *      y => 9
         */
        if (/(y+)/.test(dateFormat)) {
          dateFormat = dateFormat.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        // 格式化月、日、时、分、秒
        let o = {
          'm+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'i+': date.getMinutes(),
          's+': date.getSeconds()
        };
        for (let k in o) {
          if (new RegExp(`(${k})`).test(dateFormat)) {
            // 取出对应的值
            let str = o[k] + '';
            /* 根据设置的格式，输出对应的字符
                 * 例如: 早上8时，hh => 08，h => 8
                 * 但是，当数字>=10时，无论格式为一位还是多位，不做截取，这是与年份格式化不一致的地方
                 * 例如: 下午15时，hh => 15, h => 15
                 */
            dateFormat = dateFormat.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
          }
        }
        return dateFormat;
      };
      // 日期时间补零
      function padLeftZero (str) {
        return ('00' + str).substr(str.length);
      }

      setInterval(function () {
        // 获取当前时间
        let now = new Date()
        // 格式化当前时间
        let nowTimeStr = formatDate(new Date(now.getTime() - 1000), 'hhiiss')
        // 格式化下一秒时间
        let nextTimeStr = formatDate(now, 'hhiiss')
        // 将当前时间和下一秒时间逐位对比
        for (let i = 0; i < flipObjs.length; i++) {
          // 如果前后数字没有变化，则直接跳过，不翻牌
          if (nowTimeStr[i] === nextTimeStr[i]) {
            continue
          }
          // 传递前后牌的数字，进行向下翻牌动画
          flipObjs[i].flipDown('number' + nowTimeStr[i], 'number' + nextTimeStr[i])
        }
      }, 1000)
    },
    // 退出登录
    handle_OutLogin () {
      this.$confirm('是否确认退出登录?', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('user/logoutManage')
        this.$router.push({ path: '/loginUser' })

        this.$message({
          type: 'success',
          message: '您已退出登录!'
        });
      }).catch(() => { });
    }
  },
  destroyed () {
    clearInterval(this.timer)
    this.timer = null
  }
};
</script>
<style lang="scss">
#app {
  // padding: 0px 10px 0px 10px;
}

.bg_green {
  background-color: #a9d08e;
}

.head {
  background-color: #a9d08e;
  width: 100%;
  height: 7vh;
  display: flex;

  .head_content1 {
    width: 7%;
    display: flex;
    justify-content: center; // 内容自适应：上下居中
    align-items: center; // 子项对齐方式：左右居中
  }

  .head_content2 {
    width: 43%;
    display: flex;
    // justify-content: center; // 内容自适应：上下居中
    align-items: center; // 子项对齐方式：左右居中

    font-size: 1.3rem;
    letter-spacing: 0.05rem;
    font-weight: 700;
  }

  .head_content3 {
    width: 25%;
    display: flex;
    justify-content: right; // 内容自适应：上下居中
    align-items: center; // 子项对齐方式：左右居中
    font-size: 1.3rem;
  }

  .head_content4 {
    width: 25%;
    display: flex;
    justify-content: center; // 内容自适应：上下居中
    align-items: center; // 子项对齐方式：左右居中
    font-size: 1.3rem;
  }
}

// 查询条件
.query {
  margin-left: 1%;
  display: flex;
  // justify-content: center; // 内容自适应：上下居中
  align-items: center; // 子项对齐方式：左右居中
  height: 15vh;
  width: 99%;
}

.query2 {
  background-color: #1d7e45;
  display: flex;
  // justify-content: center; // 内容自适应：上下居中
  align-items: center; // 子项对齐方式：左右居中
  height: 7vh;
  width: 100%;
  color: #fff;
  padding: 0 10px 0 10px;

  .query2_content1 {
    background-color: #fff;
    color: black;
    font-weight: 500;

    width: 8%;
    height: 65%;

    .query2_content1_text {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center; // 内容自适应：上下居中
      align-items: center; // 子项对齐方式：左右居中
    }
  }

  .query2_content2 {
    width: 70%;
    margin-left: 5%;
  }

  .query2_content3 {
    width: 17%;
  }
}

.content {
  width: 100%;
  height: 70vh;

  .content_1 {
    margin-top: 1vh;
    width: 98%;
    margin-left: 1%;

    display: flex;
    justify-content: space-between;
  }
}

.card {
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.22);
  padding: 22px;
}
</style>

<style scoped>
.flip {
  display: inline-block;
  position: relative;
  width: 10%;
  height: 2.4rem;
  line-height: 2.4rem;
  border: solid 1px#000;
  border-radius: 10px;
  background: #fff;
  font-size: 1.8rem;
  color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  text-align: center;
  font-family: "Helvetica Neue";
}

.flip .digital:before,
.flip .digital:after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  /* background: #000; */
  background: #48a4f4;
  overflow: hidden;
  box-sizing: border-box;
}

.flip .digital:before {
  top: 0;
  bottom: 50%;
  border-radius: 10px 10px 0 0;
  border-bottom: solid 1px#666;
}

.flip .digital:after {
  top: 50%;
  bottom: 0;
  border-radius: 0 0 10px 10px;
  line-height: 0;
}

.flip .number0:before,
.flip .number0:after {
  content: "0";
}

.flip .number1:before,
.flip .number1:after {
  content: "1";
}

.flip .number2:before,
.flip .number2:after {
  content: "2";
}

.flip .number3:before,
.flip .number3:after {
  content: "3";
}

.flip .number4:before,
.flip .number4:after {
  content: "4";
}

.flip .number5:before,
.flip .number5:after {
  content: "5";
}

.flip .number6:before,
.flip .number6:after {
  content: "6";
}

.flip .number7:before,
.flip .number7:after {
  content: "7";
}

.flip .number8:before,
.flip .number8:after {
  content: "8";
}

.flip .number9:before,
.flip .number9:after {
  content: "9";
}

/*向下翻*/
.flip.down .front:before {
  z-index: 3;
}

.flip.down .front:after,
.flip.down .back:before {
  z-index: 1;
}

.flip.down .back:after {
  z-index: 2;
  transform-origin: 50% 0%;
  transform: perspective(160px) rotateX(180deg);
}

/*向上翻*/
.flip.up .front:after {
  z-index: 3;
}

.flip.up .back:before {
  z-index: 2;
  transform-origin: 50% 100%;
  transform: perspective(160px) rotateX(-180deg);
}

.flip.up .front:before,
.flip.up .back:after {
  z-index: 1;
}

.flip.down.go .front:before {
  transform-origin: 50% 100%;
  animation: frontFlipDown 0.6s ease-in-out both;
  box-shadow: 0-2px6px rgba(255, 255, 255, 0.3);
}

.flip.down.go .back:after {
  animation: backFlipDown 0.6s ease-in-out both;
}

@keyframes frontFlipDown {
  0% {
    transform: perspective(160px) rotateX(0deg);
  }

  100% {
    transform: perspective(160px) rotateX(-180deg);
  }
}

@keyframes backFlipDown {
  0% {
    transform: perspective(160px) rotateX(180deg);
  }

  100% {
    transform: perspective(160px) rotateX(0deg);
  }
}

.flip.down.go .front:before {
  transform-origin: 50% 100%;
  animation: frontFlipDown 0.6s ease-in-out both;
  box-shadow: 0 -2px 6px rgba(255, 255, 255, 0.3);
  backface-visibility: hidden;
}

.flip.up.go .front:after {
  transform-origin: 50% 0;
  animation: frontFlipUp 0.6s ease-in-out both;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.3);
  backface-visibility: hidden;
}

.flip.up.go .back:before {
  animation: backFlipUp 0.6s ease-in-out both;
}

@keyframes frontFlipUp {
  0% {
    transform: perspective(160px) rotateX(0deg);
  }

  100% {
    transform: perspective(160px) rotateX(180deg);
  }
}

@keyframes backFlipUp {
  0% {
    transform: perspective(160px) rotateX(-180deg);
  }

  100% {
    transform: perspective(160px) rotateX(0deg);
  }
}

.clock {
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  /*垂直居中*/
  justify-content: center;
  /*水平居中*/
}

.clock em {
  display: inline-block;
  line-height: 2.4rem;
  font-size: 2rem;
  font-style: normal;
  vertical-align: top;
}
</style>
