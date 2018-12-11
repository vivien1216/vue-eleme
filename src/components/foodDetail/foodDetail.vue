<template>
  <transition name="move">
     <div class="foodWrapper" v-show="showDetail" ref="foodWrapper"> 
       <div class="foodDetail">
         <div class="header-img">
           <img :src="food.image" class="food-img" />
           <div class="back" @click="hide">
             <i class="iconfont back-arrow">&#xe64e;</i>
           </div>
         </div>
         <div class="info">
           <h1 class="title">{{food.name}}</h1>
           <div class="desc">
             <span>月售{{food.sellCount}}</span>
             <span>好评率{{food.rating}}%</span>
           </div>
           <div class="price">
             <span class="newPrice">¥{{food.price}}</span>
             <span class="oldPrice" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
           </div>
           <div class="shopCart">
             <transition name="fade">
               <div class="text" @click="addCart($event)" v-show="!food.count">加入购物车</div>
             </transition>
           </div>
            <div class="cartcontrol-wrapper">
             <cartcontrol :food="food"></cartcontrol>
           </div>
          </div>
         <div class="divider"></div>
         <div class="food-info" v-show="food.info">
           <h2>商品介绍</h2>
           <p class="text">{{food.info}}</p>
         </div>
         <div class="divider"></div>
         <div class="evalution">
           <h2>商品评价</h2>
            <selectRatings
            @select="selectRating"
            @toggle="toggleContent"
            :selectType="selectType"
            :onlyContent="onlyContent" :desc="desc"
            :ratings="food.ratings">
            </selectRatings>
            <div class="rating-wrapper">
              <ul v-show="food.ratings && food.ratings.length">
                <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img class="avatar" width="12" height="12" :src="rating.avatar" />
                  </div>
                  <div class="time">{{rating.rateTime}}</div>
                  <p class="text">
                     <i class="iconfont" v-show="rating.rateType===1">&#xe6a4;</i>
                     <i class="iconfont icon-thumb_up" v-show="rating.rateType===0">&#xe602;</i>
                     <span>{{rating.text}}</span>
                  </p>
                </li>
              </ul>  
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
                暂无评价
              </div>           
            </div>
         </div>
       </div>
     </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import selectRatings from 'components/selectRatings/selectRatings'

const ALL = 2;

export default {
  name: 'foodDetail',
  props: {
    food: Object
  },
  data() {
    return {
      showDetail: false,
       selectType: ALL,
       onlyContent: true,
       desc: {
         all: '全部',
         positive: '推荐',
         negative: '吐槽'
       }
    }
  },
  methods: {
    show () {
      this.showDetail = true;
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        this._initScroll()
      })
    },
    hide () {
      this.showDetail = false
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    },
    addCart(event) {
      Vue.set(this.food, 'count', 1);
    },
    _initScroll() {
      if (!this.foodWrapper) {
        this.foodWrapper = new BScroll(this.$refs.foodWrapper, {
          click: true
        });
      } else {
        this.foodWrapper.refresh()
      }
    },
    selectRating(type) {
      this.selectType = type;
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent;
    }
  },
  components: {
    cartcontrol,
    selectRatings
  }
}
</script>

<style lang="stylus" scoped>
@import '~style/mixin.styl'
.foodWrapper
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  z-index: 30
  width: 100%
  background-color: #fff
  transition: all .4s ease
  &.move-enter-avtive,&.move-leave-active
    transform: translate3d(0,0,0)
  &.move-enter,&.move-leave-active
    transform: translate3d(100%,0,0)
  .foodDetail
    .header-img
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      .food-img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 10px
        color: #fff
        font-size: 24px
    .info
      position: relative
      width: 100%
      box-sizing: border-box
      padding: 18px
      .title
        font-size: 14px
        line-height: 14px
        font-weight: 700
        color: rgb(7,27,27)
      .desc
        display: flex
        font-size: 10px
        padding-top: 8px
        line-height: 10px
        color: rgb(147,153,159)
        span:last-child
          padding-left: 12px
      .price
        display: flex
        padding-top: 18px
        font-size: 14px
        font-weight: 700
        color: rgb(240,20,20)
        line-height: 24px
        .oldPrice
          padding-left: 12px
          font-weight: normal
          font-size: 10px
          color: rgb(147,153,159)
          text-decoration: line-through
      .shopCart
        position: absolute
        right: 18px
        bottom: 18px
        height:24px
        text-align: center
        z-index: 2
        &.fade-enter-active,&.fade-leave-active
          transition: opacity .3s
        &.fade-enter,&.fade-leave-to
          opacity: 0
        .text
          height: 100%
          line-height: 24px
          color: #fff
          font-size: 10px
          padding: 0 12px
          border-radius: 12px
          box-sizing: border-box
          background-color: rgb(0,160,220)
      .cartcontrol-wrapper
        position: absolute
        right: 23px
        bottom: 16px
    .food-info,.evalution
      padding: 18px
      h2
        font-size: 18px
        font-weight: 700
        margin-bottom: 6px
      .text
        font-size: 12px
        font-weight: 200
        color: rgb(77,85,93)
        line-height: 24px
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
         .text
           line-height: 16px
           font-size: 12px
           color: rgb(7, 17, 27)
           .iconfont
             margin-right: 4px
             line-height: 16px
             font-size: 12px
           .icon-thumb_up
             color: rgb(0, 160, 220)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>