import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  // 管理员登录
  {
    path: '/loginManage',
    component: () => import('@/views/login-manage/index.vue'),
    hidden: true
  },
  {
    path: '/loginUser',
    component: () => import('@/views/login-user/index.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
  },
  {
    path: '/air-lift',
    component: Layout,
    redirect: '/air-lift-list',
    meta: {
      title: '国际空运出口',
    },
    children: [
      {
        path: '/air-lift-list',
        component: () => import('@/views/air-lift/index.vue'),
        name: 'houselist',
        meta: { title: '国际空运出口数据导入', affix: true, icon: 'el-icon-s-home' }
      }
    ]
  },
  // {
  //   path: '/socre-setting',
  //   component: Layout,
  //   redirect: '/sing-socre-setting',
  //   meta: {
  //     title: '成绩通知设置',
  //   },
  //   children: [
  //     {
  //       path: '/sing-socre-setting',
  //       component: () => import('@/views/sing-socre-setting/index.vue'),
  //       name: 'singscoresetting',
  //       meta: { title: '成绩通知设置', affix: true, icon: 'el-icon-setting' }
  //     }
  //   ]
  // },
  // {
  //   path: '/push',
  //   component: Layout,
  //   redirect: '/push-socre',
  //   meta: {
  //     title: '推送成绩通知',
  //   },
  //   children: [
  //     {
  //       path: '/push-socre',
  //       component: () => import('@/views/push-socre/index.vue'),
  //       name: 'pushsocre',
  //       meta: { title: '推送成绩通知', affix: true, icon: 'el-icon-printer' }
  //     }
  //   ]
  // },

  {
    path: '/home',
    hidden: true,
    component: () => import('@/views/home/index.vue'),
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
