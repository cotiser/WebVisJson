import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    meta: { title: '主页' },
    component: (resolve) => require(['@/components/Home'], resolve),
    redirect: '/Welcome',
    children: [
      {
        path: '/home',
        component: (resolve) => require(['@/components/Welcome'], resolve)
      }
    ]
  }
]

const router = new VueRouter({
  base: '/admin/',
  routes
})

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/home') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/home')
  next()
})

export default router
