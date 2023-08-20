import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from "@/store";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '溯源主页',
    redirect:'/search'
  },
  {
    path: '/login',
    name: '登录',
    component: ()=>import('../views/Login'),
  },
  { path: '/search',
    name: '溯源查询',
    component:()=>import('../views/front/Search.vue'),
    children:[
      {path:'product',name:'产品溯源',component:()=>import('../views/front/TraceProduct')},
      {path:'plant',name:'种植溯源',component:()=>import('../views/front/TracePlant')},
      {path:'process',name:'加工溯源',component:()=>import('../views/front/TraceProcess')},
      {path:'logistics',name:'物流溯源',component:()=>import('../views/front/TraceLogistics')},
      {path:'sale',name:'销售溯源',component:()=>import('../views/front/TraceSale')},
    ]},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//路由刷新问题
const VueRouterPush = VueRouter. prototype.push
VueRouter.prototype.push = function push (to  ) {
  return VueRouterPush.call(this,to).catch(err => err)
}
// 提供一个重置路由的方法
export const resetRouter = () => {
  router.matcher = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
}

// 注意：刷新页面会导致页面路由重置
export const setRoutes = () => {
  const storeMenus = localStorage.getItem("menus");
  if (storeMenus) {

    // 获取当前的路由对象名称数组
    const currentRouteNames = router.getRoutes().map(v => v.name)
    if (!currentRouteNames.includes('主页导航')) {
      // 拼装动态路由
      const manageRoute = { path: '/manage', name: '主页导航', component: () => import('../views/HomeView.vue'), redirect: "/manage/home", children: [
          { path: 'home', name: '主页',component: () => import('../views/Home.vue')},
          { path: 'person', name: '个人信息', component: () => import('../views/Person.vue')},
          { path: 'password', name: '修改密码', component: () => import('../views/Password.vue')},
        ] }
      const menus = JSON.parse(storeMenus)
      menus.forEach(item => {
        if (item.path) {  // 当且仅当path不为空的时候才去设置路由
          let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue')}
          manageRoute.children.push(itemMenu)
        }
      })
      // 动态添加到现在的路由对象中去
      router.addRoute(manageRoute)
    }

  }
}
// 重置我就再set一次路由
setRoutes()

router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称
  store.commit("setPath")
  if(to.path==='/login'||to.path.indexOf("search")!=-1){
    return next()
  }
  const CurUser = localStorage.getItem("pt-user")
  if(!CurUser){
    return next('/login')
  }
  next()
})
export default router
