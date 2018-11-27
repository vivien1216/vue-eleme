<template>
  <div>
    <home-header :seller="seller"></home-header>
  </div>
</template>

<script>
import homeHeader from '../../components/Header/header'
import axios from 'axios'

export default {
  name: 'Home',
  data () {
    return {
      seller: {}
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
       console.log(this.seller)
      }
    }
  },
  mounted () {
    this.getHomeInfo();
  }
}
</script>


<style scoped>
</style>