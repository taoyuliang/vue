<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="off"
      label-position="left">
      <div class="title-container">
        <h3 class="title">用户登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text" tabindex="1"
          autocomplete="off" class="inputs" />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <input class="inputs" :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
            placeholder="Password" name="password" tabindex="2" autocomplete="off" @keyup.native="checkCapslock"
            @blur="capsTooltip = false" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  name: 'Login',
  components: {},
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        // username: 'admin',
        // password: '123456'
        username: 'user',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},

      // 场次列表
      examList: []
    }
  },
  watch: {

  },
  created () {
    this.fetchData()
  },
  mounted () {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed () {

  },
  methods: {
    fetchData () {

    },
    checkCapslock (e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    //密码类型转换
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/loginUser', this.loginForm).then((rest) => {
            // this.$router.push({ path: this.redirect || '/' })

            // window.localStorage.setItem('setDate', this.loginForm.examdate)

            if (rest.code == 200) {
              this.$router.push({ path: '/home' })
            }
            else {
              this.$message({
                type: 'error',
                message: '用户名或密码错误！',
                duration: 5 * 1000
              })
            }
            this.loading = false
          }).catch(() => {
            // 登录失败提示错误
            // this.$message({
            //   type: 'error',
            //   message: '登录失败！',
            //   duration: 5 * 1000
            // })
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

input {
  outline: none;
}

.inputs {
  border: none !important;
  background: none;
  background-color: none !important;
  color: #fff !important;
  margin-left: 2%;
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container v-deep .el-input input {
    color: $cursor;
  }
}

.el-input {
  display: inline-block !important;
  height: 47px;
  width: 85%;

  input {
    background: transparent !important;
    -webkit-appearance: none !important;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
    caret-color: $cursor;
  }

  input:-webkit-autofill {
    box-shadow: 0 0 0 1000px transparent inset !important;
  }

  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: $cursor !important;
    transition: background-color 5000s ease-in-out 0s !important;
  }
}

.el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
}

$cursor: #fff;

/* reset element-ui css */
.login-container {
  background-image: url("~@/assets/images/bg.png");
  background-size: cover;

}

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;


  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
