import { add_List, get_Info, set_List, del_List, get_List } from '@/api/nodeApi'

import { getToken, setToken, removeToken, getCommon, setCommon } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  common: getCommon() != "" && getCommon() != undefined && getCommon() != null ? JSON.parse(getCommon()) : {},
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TOKEN_SING_SCORE: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_COMMON: (state, common) => {
    state.common = common
  }
}

const actions = {
  // 管理员登录
  loginManage ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      let json = { data: { "Role": 0, "UserName": username.trim(), "PassWord": password }, gether: "t_user_list" }

      get_Info(json).then(response => {
        const { data } = response
        if (data.length > 0) {

          commit('SET_TOKEN', data.token)
          setToken(data.token)
          setCommon(data)
          commit('SET_COMMON', data)
          resolve({ code: 200, msg: "登录成功！" })
        }
        else {
          resolve({ code: 500, msg: "用户名或密码错误！" })
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  loginUser ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      let json = { data: { "Role": 1, "UserName": username.trim(), "PassWord": password }, gether: "t_user_list" }

      get_Info(json).then(response => {
        const { data } = response

        if (data.length > 0) {

          commit('SET_TOKEN', data.token)
          setToken(data.token)
          setCommon(data)
          commit('SET_COMMON', data)
          resolve({ code: 200, msg: "登录成功！" })
        }
        else {
          resolve({ code: 500, msg: "用户名或密码错误！" })
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logoutManage ({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      removeToken()

      resolve()
    })
  },

  // user logout
  logout ({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      removeToken()

      resolve()
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles ({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
