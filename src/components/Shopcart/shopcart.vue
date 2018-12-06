<template>
  <div>
	  <div class="shopcart">
	    <div class="content">
	      <div class="content-left">
	        <div class="logo-wrapper">
	           <div class="badge" v-show="totalCount">{{totalCount}}</div>
	           <div class="logo" :class="{'active':totalPrice}">
	             <i class="iconfont" v-show="totalCount<1">&#xe601;</i>
	             <i class="iconfont" v-show="totalCount>=1">&#xe600;</i>
	            </div>
	        </div>
	        <div class="price" :class="{'active':totalPrice}">
	          ¥ {{totalPrice}}
	        </div>
	        <div class="desc">
	          另需配送费¥{{deliveryPrice}}元
	        </div>
	      </div>
	      <div class="content-right" :class="{'enough':totalPrice>=minPrice}">
	        {{payDesc}}
	      </div>
	    </div>

        <div class="ball-container">
         <transition name="drop" v-on:before-enter="beforeEnter"
	        v-on:enter="enter" v-on:after-enter="afterEnter"
	        v-for="(ball,index) in balls">
	        <div class="ball" v-show="ball.show">
	          <div class="inner inner-hook"></div>
	        </div>
	      </transition>
        </div>

	  </div>
  </div>
</template>

<script>
export default {
  name: 'shopcart',
  props: {
    selectFoods: {
      type:Array,
      default () {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      balls: [{
        show: false
      },{
        show: false
      },{
        show: false
      },{
        show: false
      },{
        show: false
      }],
      dropBalls: [],
    }
  },
  computed: {
    totalPrice () {
      let total = 0;
      this.selectFoods.forEach( (food) => {
        if (food.count) {
          total += food.price * food.count
        }
      })
      return total
    },
  totalCount () {
    let count = 0;
    this.selectFoods.forEach( (food) => {
      count += food.count
    })
    return count
  },
  payDesc () {
    if(this.totalPrice === 0) {
      return `¥${this.minPrice}元起送`
    }else if(this.totalPrice < this.minPrice) {
      let diff = this.minPrice - this.totalPrice
      return `还差¥${diff}元起送`
    }else{
      return '去结算'
    }
  }
 },
 methods: {
    drop(el) {
      for (let i = 0, l = this.balls.length; i < l; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
   beforeEnter(el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.querySelector('.inner-hook')
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    enter(el) {
      el.offsetHeight // 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.querySelector('.inner-hook')
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
      })
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    }
 }
}
</script>

<style lang="stylus" scoped>
.shopcart
  position: fixed
  left: 0
  bottom: 0
  width: 100%
  height: 48px
  z-index: 50
  .content
    display: flex
    background-color: #141d27
    .content-left
      flex: 1
      height: 48px
      .logo-wrapper
        display: inline-block
        vertical-align: top
        position: relative
        width: 56px
        height: 56px
        line-height: 56px
        text-align: center
        border-radius: 50%
        top: -10px
        background: #141d27
        margin:0 12px
        padding: 6px
        box-sizing: border-box
        .badge
          position: absolute
          top: 0
          right: 0
          background: rgb(240,20,20)
          color: white
          width: 20px
          height: 20px
          line-height: 20px
          font-size: 9px
          box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.4);
          font-weight: 700
          border-radius: 10px
          text-align: center
        .logo
          width 100%
          height 100%
          background: #2b343c
          border-radius: 50%
          font-size: 24px
          color: #80858a
          line-height: 44px
          font-weight: 700
          &.active
            background: rgb(0,160,220)
            color: white
      .price
        display: inline-block
        vertical-align: top
        font-size: 16px
        margin-top: 12px
        padding-right: 12px
        box-sizing: border-box
        color: rgba(255,255,255,0.4)
        font-weight: 700
        line-height: 24px
        border-right: 1px solid rgba(255,255,255,0.1)
        &.active
          color: white
      .desc
        position: relative
        display: inline-block
        vertical-align: top
        margin: 12px 0 0 12px
        font-size: 10px
        color: rgba(255,255,255,0.4)
        line-height: 24px
        font-weight: 700
    .content-right
      flex: 0 0 105px
      width: 105px
      font-size: 12px
      font-weight: 700
      background: #2b343c
      color: rgba(255,255,255,0.4)
      line-height: 48px
      text-align: center
      &.enough
        background: #00b43c
        color: white
  .ball-container
   .ball
     position fixed
     left 32px
     bottom 22px
     z-index 200
     &.drop-enter,&.drop-enter-active
       transition all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
       .inner
         width 16px
         height 16px
         border-radius 50%
         background rgb(0,160,220)
         transition all 0.4s linear
</style>