<template>
  <div>
	  <div class="shopcart">
	    <div class="content">
	      <div class="content-left" @click="listToggle">
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
	      <div class="content-right" @click.stop.prevent="pay">
	        <div class="pay" :class="payClass">
              {{payDesc}}
	        </div>
	      </div>
	    </div>
        
        <!--小球动画-->
        <div class="ball-container">
         <transition name="drop" v-on:before-enter="beforeEnter"
	        v-on:enter="enter" v-on:after-enter="afterEnter"
	        v-for="(ball,index) in balls">
	        <div class="ball" v-show="ball.show">
	          <div class="inner inner-hook"></div>
	        </div>
	      </transition>
        </div>

        <!--购物车详情-->
        <transition name="transHeight">
          <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
              <h1 class="title">购物车</h1>
              <span class="empty" @click="setEmpty">清空</span>
            </div>
            <div class="list-content" ref="foodList">
              <ul>
                <li class="food" v-for="food in selectFoods">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>¥{{food.price * food.count}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
	                <cartcontrol  @add="addFood" :food="food"></cartcontrol>
	              </div>
                </li>
              </ul>
            </div>
          </div>
        </transition>

	  </div>

	  <transition name="fade">
	    <div class="list-mask" @click="hideList" v-show="listShow"></div>
	  </transition>

  </div>
</template>

<script>
import cartcontrol from 'components/Cartcontrol/cartcontrol';
import BScroll from 'better-scroll';

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
      listShow: false
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
  },
  payClass() {
    if (this.totalPrice < this.minPrice) {
      return 'not-enough';
    } else {
      return 'enough';
    }
  }
 },
 methods: {
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return;
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
    },

    setEmpty() {
      this.selectFoods.forEach((food) => {
        food.count = 0
      }),
      this.listShow = false
    },
    hideList() {
      this.listShow = false
    },
    _initScroll() {
      this.foodlistScroll = new BScroll(this.$refs.foodList, {
        click: true
      });
    },
    listToggle() {
      if (!this.selectFoods.length) {
        return;
      }
      this.listShow = !this.listShow;
      if (this.listShow) {
        this.$nextTick(() => {
          if (!this.foodlistScroll) {
            this._initScroll()
          } else {
            this.foodlistScroll.refresh()
          }
        })
      }
    },
    addFood(target) {
      this.drop(target);
    },
    pay() {
	  if (this.totalPrice < this.minPrice) {
	    return;
	  }
	  this.listShow = true
	},
 },
 components: {
   cartcontrol
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
      .pay
        height: 48px
        line-height: 48px
        text-align: center
        font-size: 12px
        font-weight: 700
        &.not-enough
          background: #2b333b
        &.enough
          background: #00b43c
          color: #fff
  .ball-container
   .ball
     position: fixed
     left: 32px
     bottom: 22px
     z-index: 200
     &.drop-enter,&.drop-enter-active
       transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
       .inner
         width: 16px
         height: 16px
         border-radius: 50%
         background: rgb(0,160,220)
         transition: all 0.4s linear
  .shopcart-list
    position: absolute
    top: 0
    left: 0
    width: 100%
    background: white
    transform: translate3d(0,-100%,0)
    z-index: -1
    &.transHeight-enter-active,&.transHeight-leave-active
      transition: all 0.5s
    &.transHeight-enter,&.transHeight-leave-active
      transform: translate3d(0,0,0)
    .list-header
      height: 40px
      line-height: 40px
      background: #f3f5f7
      border-bottom: 1px solid rgba(7,17,27,0.1)
      .title
        display: inline-block
        font-size: 14px
        font-weight: 200
        color: rgb(7,17,27)
        padding-left: 18px
      .empty
        position: absolute
        right: 8px
        font-size: 12px
        color: rgb(0,160,220)
        padding: 0 10px
    .list-content
      max-height: 217px
      overflow: hidden
      .food
        position: relative
        display: flex
        height: 48px
        margin: 0 18px
        border-bottom: 1px solid rgba(7,17,27,0.1)
        .name
          flex: 1
          font-size: 14px
          color: rgb(7,17,27)
          line-height: 48px
          font-weight: 700
        .price
          font-size: 14px
          font-weight: 700
          color: rgb(240,20,20)
          padding: 0 12px 0 18px
          line-height: 48px
        .cartcontrol-wrapper
          font-size: 14px
          margin-top: 6px
.list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>