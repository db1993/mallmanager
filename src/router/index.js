import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Users from '@/views/Users.vue'
import Role from '@/views/Role.vue'
import Rights from '@/views/Rights.vue'


Vue.use(Router)

export default new Router({
  routes: [ {
    name: 'home',
    path: '/',
    component: Home,
    children: [
      {name: 'users',path: '/users',component: Users},
      {name:'role',path:'/role',component:Role},
      {name:'rights',path:'/rights',component:Rights}
    ]
  },{
    name: 'login',
    path: '/login',
    component: Login
  },]
})
