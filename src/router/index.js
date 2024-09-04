import { createRouter } from "vue-router"
// 引入路由器模式
import { createWebHashHistory } from "vue-router"
import { useUserStore } from "@/store/user";

import HelloWorld from "@/components/HelloWorld.vue";
import NotFound from '@/views/NotFound.vue'
import Login from '@/views/Login.vue'
import Detect from '@/views/Detect.vue'
import Register from '@/views/Register.vue'
import Forget from '@/views/Forget.vue'
import LayoutContainer from '@/views/LayoutContainer.vue'
import DataAnalyze from '@/views/DataAnalyze.vue'
import History from '@/views/History.vue'
import Reset from '@/views/Reset.vue'
import User from '@/views/User.vue'

//创建路由器
const router = createRouter({
  history: createWebHashHistory(),
  //管理路由
  routes: [
    //一个一个的路由规则
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/forget', component: Forget },
    { path: '/helloworld', component: HelloWorld },
    {
      path: '/home',
      component: LayoutContainer,
      redirect: '/home/detect',
      children: [
        { path: 'detect', component: Detect },
        { path: 'dataAnalyze', component: DataAnalyze },
        { path: 'history', component: History },
        { path: 'reset', component: Reset },
        { path: 'user', component: User },
      ]
    },
    { path: "/:catchAll(.*)", component: NotFound },
    //  {
    //    //路径
    //     path:'/home',
    //   //组件绑定
    //     component:home
    //  },
  ]
})

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  console.log(userStore.token);
  console.log(to);
  
  if (!userStore.token && to.path !== '/login' && to.path !== '/register' && to.path !== '/forget') return '/login'
  return true
})

export default router

