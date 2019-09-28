import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@/views/Goods.vue'
import Ratings from '@/views/Ratings.vue'
import Seller from '@/views/Seller.vue'

Vue.use(Router)

const route = new Router({
  routes: [
    {
      path: '/goods',
      component: Goods
    },
    {
      path: '/ratings',
      component: Ratings
    },
    {
      path: '/seller',
      component: Seller
    }
  ],
  linkActiveClass: 'active'
})

route.push('goods')

export default route
