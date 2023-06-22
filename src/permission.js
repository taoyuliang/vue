import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/loginManage', '/loginUser', '/auth-redirect', '/home'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/loginManage' || to.path === '/loginUser' || to.path === '/home') {
      await store.dispatch('user/logoutManage')
      // if is logged in, redirect to the home page
      next({ path: to.path })
      NProgress.done()
    } else {
      const { roles } = { roles: 'admin' }
      const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
      router.addRoutes(accessRoutes)

      next()
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/home`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
