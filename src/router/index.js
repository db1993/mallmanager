import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Users from '@/views/Users.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  },{
    name: 'home',
    path: '/home',
    component: Home
  },{
    name: 'users',
    path: '/users',
    component: Users
  }]
})
