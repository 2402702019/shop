import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Goodslist from '@/components/goodslist.vue'
import Goodsadd from '@/components/goodsadd.vue'
import Cateparams from '@/components/cateparams.vue'
import Goodscate from '@/components/goodscate.vue'

Vue.use(Router)

const router = new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: Home,
    children: [{
      name: 'users',
      path: '/users',
      component: Users
    },
    {
      name: 'rights',
      path: '/rights',
      component: Rights
    },
    {
      name: 'roles',
      path: '/roles',
      component: Roles
    },
    {
      name: 'goods',
      path: '/goods',
      component: Goodslist
    },
    {
      name: 'goodsadd',
      path: '/goodsadd',
      component: Goodsadd
    },
    {
      name: 'params',
      path: '/params',
      component: Cateparams
    },
    {
      name: 'categories',
      path: '/categories',
      component: Goodscate
    }
    ]

  }, {
    name: 'login',
    path: '/login',
    component: Login
  }
  ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  // console.log("路由守卫执行-----");
  // console.log(to, from);
  // 如果要去的是登录 -> 继续登录
  if (to.name === 'login') {
    next()
  } else {
    // 如果要去的不是登录  ->
    const token = localStorage.getItem('token')
    // if !token ->渲染login
    if (!token) {
      // 提示
      // this.$message.warning("请先登录");
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
      return
    }
    //  if token 渲染home
    next()
  }
  // next方法 : 让路由配置继续生效
  // next();
})
export default router
