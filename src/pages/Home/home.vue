<template>
  <div>
    <home-header :seller="seller"></home-header>

    <div class="tab border-1px">
       <div 
       class="tab-item"
       v-for="(item,index) in tabItems" 
       :key="index"
       :class="[isActive === index ? 'active': '', 'module']" 
       @click="moduleClickHandle(item.src, index, $event)"
       >
         {{item.text}}  
       </div>
    </div>

    <div class="content">
       <router-view></router-view>
    </div>
    
  </div>
</template>

<script>
import homeHeader from '../../components/Header/header'
import axios from 'axios'

export default {
  name: 'Home',
  data () {
    return {
      seller: {},
      isActive: 0,
      tabItems: [{
        text: '商品',
        src: '/goods'
      },{
        text: '评价',
        src: '/rating'
      },{
        text: '商家',
        src: '/seller'
    }]
    }
  },
  components: {
    homeHeader
  },
  methods: {
    getHomeInfo () {
      axios.get('/api/seller.json')
        .then(this.getHomeInfoSucc)
    },
    getHomeInfoSucc (res) {
      res = res.data
      if(res.ret && res.data) {
       this.seller = res.data
      }
    },
    moduleClickHandle(routerLink, index, event) {
      this.isActive = index;
      this.$router.push({path: routerLink});
    }
  },
  mounted () {
    this.getHomeInfo()
  },
  created () {
    this.$router.replace('/goods')
  }
}
</script>


<style lang="stylus" scoped>
@import '~style/mixin.styl'
.tab 
  display: flex
  width: 100%
  height: 40px
  line-height: 40px
  border-1px(rgba(77,27,17,.1))
  .tab-item
    flex: 1
    text-align: center
    font-size: 14px
    color: rgb(77,85,93)
    &.active
      color: rgb(240,20,20)
</style>