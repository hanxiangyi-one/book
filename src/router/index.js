import Vue from 'vue'
import VueRouter from 'vue-router'

const Ebook = () => import(/* webpackChunkName: "about" */ '../views/ebook/index.vue')
const EbookReader = () => import('../components/ebook/EbookReader.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store'
  },
  {
    path: '/ebook',
    name: 'ebook',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Ebook,
    children: [
      {
        path: ':fileName',
        component: EbookReader
      }
    ]
  },
  {
    path: '/store',
    component: () => import('../views/store/index.vue'),
    redirect: '/store/shelf',
    children: [
      {
        path: 'shelf',
        component: () => import('../views/store/StoreShelf.vue')
      },
      {
        path: 'category',
        component: () => import('../views/store/StoreCategory.vue')
      },
      {
        path: 'home',
        component: () => import('../views/store/StoreHome.vue')
      },
      {
        path: 'list',
        component: () => import('../views/store/StoreList.vue')
      },
      {
        path: 'detail',
        component: () => import('../views/store/StoreDetail.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
