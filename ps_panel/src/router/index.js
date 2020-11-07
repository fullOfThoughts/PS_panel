import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const Home = () => import(/*webpackChunkName:"group-home"*/ '../views/Home.vue')
const Magnify = () => import(/*webpackChunkName:"group-magnify"*/ '../views/Magnify.vue')
const Corona = () => import(/*webpackChunkName:"group-corona"*/ '../views/Corona.vue')
const CD = () => import(/*webpackChunkName:"group-CD"*/ '../views/CD.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/magnify",
    name: "Magnify",
    component: Magnify
  },
  {
    path: "/corona",
    name: "Corona",
    component: Corona
  },
  {
    path: "/cd",
    name: "CD",
    component: CD
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/') return next()
  if (to.path === '/home') return next()
  if (to.path === '/magnify') return next()
  if (to.path === '/corona') return next()
  if (to.path === '/cd') return next()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
