import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import router from '@/router'

// 标记用于指示是否是首次获取登录用户信息
let firstFetchLoginUser = true

/**
 * 全局权限校验
 * @param to 目标路由信息
 * @param from 当前路由信息
 * @param next 路由跳转的下一个步骤
 */
router.beforeEach(async (to, from, next) => {
  // 获取登录用户存储对象
  const loginUserStore = useLoginUserStore()
  // 初始登录用户信息
  let loginUser = loginUserStore.loginUser
  // 如果是首次获取登录用户信息，则发起请求获取
  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    // 更新登录用户信息
    loginUser = loginUserStore.loginUser
    // 标记为已获取过登录用户信息
    firstFetchLoginUser = false
  }
  // 获取目标路由的完整路径
  const toUrl = to.fullPath
  // 检查是否访问管理员路由
  if (toUrl.startsWith('/admin')) {
    // 如果未登录或用户角色不是管理员，则无权限访问
    if (!loginUser || loginUser.userRole !== 'admin') {
      // 提示无权限错误
      message.error('没有权限')
      // 重定向到登录页面，并携带目标路由路径
      next(`/user/login?redirect=${to.fullPath}`)
      // 结束当前导航
      return
    }
  }
  // 允许路由跳转
  next()
})
