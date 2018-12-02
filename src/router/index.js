import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home/home'
import homeGoods from '../pages/Home/Component/Goods/goods'
import homeSeller from '../pages/Home/Component/Seller/seller'
import homeRating from '../pages/Home/Component/Rating/rating'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'goods',
          name: 'homeGoods',
          component: homeGoods
        },
        {
          path: 'seller',
          name: 'homeSeller',
          component: homeSeller
        },
        {
          path: 'rating',
          name: 'homeRating',
          component: homeRating
        }
      ]
    }
  ]
})
