<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="sysImg" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->

          <!-- <el-dropdown-item>
            <span style="display: block" @click="handleCreate">修改密码</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" style="width: 1200px; margin-left: 18.5%">
      <el-form ref="listQuery" status-icon :rules="rules" :model="listQuery" label-position="left" label-width="140px"
        style="width: 380px; margin-left: 50px">
        <!-- <el-form-item label="Id" readonly="readonly" style="position: relative">
          <svg-icon
            icon-class="user"
            style="position: absolute; left: -14%; z-index: 99; top: 33%"
          />
          <el-input v-model="listQuery.adminId" :disabled="true" />
        </el-form-item> -->
        <el-form-item label="用户名" readonly="readonly" style="position: relative">
          <svg-icon icon-class="user" style="position: absolute; left: -14%; z-index: 99; top: 33%" />
          <el-input v-model="listQuery.loginName" :disabled="true" />
        </el-form-item>

        <el-form-item label="新密码" prop="loginPwd" style="position: relative">
          <svg-icon icon-class="password" style="position: absolute; left: -14%; z-index: 99; top: 33%" />
          <el-input v-model="listQuery.loginPwd" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="loginpwdtwo" style="position: relative">
          <svg-icon icon-class="password" style="position: absolute; left: -14%; z-index: 99; top: 33%" />
          <el-input v-model="listQuery.loginpwdtwo" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="changePwd()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { set_List } from '@/api/nodeApi'
var _self
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'common'
    ])
  },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (value !== this.listQuery.loginPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      //导航栏图片
      sysImg: require('@/assets/system/sys-img.png'),
      listQuery: {},
      dialogFormVisible: false,
      rules: {
        loginpwdtwo: [{ required: true, validator: validatePass, trigger: 'blur' }],
        loginPwd: [{ required: true, message: "新密码不能为空", trigger: 'blur' }],
      }
    }
  },
  created () {
    _self = this
  },
  methods: {
    changePwd () {
      let paramset = {
        "data": {
          "old": { "_id": _self.common._id }, "new": {
            "password": _self.listQuery.loginPwd
          }
        }, "gether": "user"
      }
      set_List(paramset).then(rest => {
        this.$message({
          message: '密码修改成功。',
          type: 'success'
        });
        _self.dialogFormVisible = false
      })
    },
    // 创建模态框
    handleCreate () {
      this.listQuery = {}
      this.listQuery.loginName = this.common.nickname
      this.dialogFormVisible = true

      this.$nextTick(() => {
        this.$refs['listQuery'].clearValidate()
      })
    },
    // 模态框关闭
    handleClose () {
      this.dialogFormVisible = false
    },

    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$store.dispatch('user/logoutManage')
      this.$router.push(`/loginManage`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
