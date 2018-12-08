<template>
  <div class="ratingsWrapper" ref="ratingsWrapper">
     <div class="ratings-content">
       <div class="info">
         <div class="mark">
           <div class="num">{{seller.score}}</div>
           <div class="text">综合评分</div>
           <div class="contrast">高于周边商家{{seller.rankRate}}%</div>
         </div>
         <div class="stars">
           <div class="serviceScore">
             <span class="text">服务态度</span>
             <star :size="24" :score="seller.serviceScore"></star>
             <span class="num">{{seller.serviceScore}}</span>
           </div>

           <div class="foodScore">
             <span class="text">服务态度</span>
             <star :size="24" :score="seller.foodScore"></star>
             <span class="num">{{seller.foodScore}}</span>
           </div>

           <div class="deliveryTime">
             <span class="text">送达时间</span>
             <span class="time">{{seller.deliveryTime}}分钟</span>
           </div>

         </div>
       </div>

     <div class="divider"></div>
     
     <div class="evalution">
       <div class="classify">
          <span class="item" v-for="(item,index) in classifyArr"  :class="{'active':item.active,'bad':index==2,'badActive':item.active&&index==2}" @click="filterEvel(item)">{{item.name}} {{item.count}}</span>
       </div>
       <div class="switch">
         <span class="iconfont">&#xe65d;</span>
         <span class="text">只看有内容的评价</span>
       </div>
       <div class="eval-list">
         <ul>
           <li class="eval" v-for="item in ratings">
             <div class="avatar">
               <img :src="item.avatar" width="28" height="28" />
             </div>
             <div class="content">
               <div class="user">
                 <span class="name">{{item.username}}</span>
                 <span class="rateTime">{{item.rateTime}}</span>
               </div>
               <div class="star-wrapper">
                 <star :size="24" :score="item.score"></star>
                 <span class="deliveryTime">{{item.deliveryTime}}分钟送达</span>
               </div>
               <div class="text">
                 {{item.text}}
               </div>
               <div class="recommend">
                 <span class="iconfont" v-show="item.recommend.length">&#xe602;</span>
                 <span class="dish"  v-for="dish in item.recommend">{{dish}}</span>
               </div>
             </div>
           </li> 
         </ul>
       </div>
      </div>
     </div>
  </div>
</template>

<script>
import axios from 'axios'
import star from 'components/Star/star'
import BScroll from 'better-scroll'
export default {
  name: 'homeRating',
  data () {
    return {
      ratings: [],
      seller: {},
      classifyArr: [{
        name: '全部',
        count: 0,
        active: true
      }, {
        name: '推荐',
        count: 0,
        active: false
      }, {
        name: '吐槽',
        count: 0,
        active: false
      }],
      evelflag: true
    }
   },
  computed: {
    evelArr() {
      let selectIndex = 0
      this.classifyArr.forEach((data, index) => {
        if (data.active) {
          selectIndex = index
        }
      })
      if (this.scroll) {
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
      return selectIndex ? this.ratings.filter((data) => this.evelflag ? data.rateType === selectIndex - 1 && data.text : data.rateType === selectIndex - 1) : this.ratings.filter((data) => this.evelflag ? data.text : true)
    }
  },
  methods: {
   getHomeRatings () {
     axios.get('/api/rating.json')
      .then( (res) => {
        res = res.data
        if(res.ret && res.data) {
          this.ratings = res.data
          this._initClassifyArr()
           this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratingsWrapper, {
              click: true
            })
          })
        }
      })
   },
    getHomeSeller () {
     axios.get('/api/seller.json')
      .then( (res) => {
        res = res.data
        if(res.ret && res.data) {
          this.seller = res.data
        }
      })
   },
    _initClassifyArr() {
      this.classifyArr.forEach((data, index) => {
        if (index) {
          data.count = this.ratings.filter((temp) => temp.rateType === index - 1).length
        } else {
          data.count = this.ratings.length
        }
      })
    },
    filterEvel(item) {
      this.classifyArr.forEach((data) => {
        data.active = false
      })
      item.active = true
    }
  
  },
  created () {
    this.getHomeRatings();
    this.getHomeSeller();
  },
  components: {
    star
  }
}
</script>

<style lang="stylus" scoped>
.ratingsWrapper
  position: absolute
  top: 174px
  bottom: 0
  left: 0
  width: 100%
  overflow: hidden
  .ratings-content
    .info
      display: flex
      .mark
        flex: 0 0 138px
		margin: 18px 0
		border-right: 1px solid rgba(7,17,27,0.1)
		text-align: center
		.num
		  font-size: 24px
		  color: rgb(255,153,0)
		  line-height: 28px
		.text
		  padding: 6px 0 8px 0
		  font-size: 12px
		  color: rgb(7,17,27)
		  line-height: 12px
		.contrast
		  font-size: 10px
		  color: rgb(7,17,27)
		  line-height: 10px
		  margin-bottom: 6px
	  .stars
	    padding: 0 24px
	    .serviceScore,.foodScore,.deliveryTime
	      display: flex
	      flex-direction: row
	      margin-bottom: 8px
	      .text
	        font-size: 12px
	        color: rgb(7,17,27)
	        line-height: 18px
	        margin-right: 12px
	        margin-top: -6px
	      .num
	        font-size: 12px
	        line-height: 18px
	        color: rgb(255,153,0)
	        padding-left: 12px
	    .deliveryTime
	      margin-bottom: 0
	      .time
	        font-size: 12px
	        color: rgb(147,153,159)
	        line-height: 18px
	.evalution
	  padding: 18px 0
	  position: relative
	  .classify
	    padding-bottom: 18px
	    margin: 0 18px
	    .item
          display: inline-block
          font-size: 12px
          padding: 8px 12px
          line-height: 16px
          background: rgba(0,160,220,0.2)
          color: rgb(77,85,95)
          margin-right: 8px
          &.active
            color: white
            background: rgb(0,169,220)
          &.bad
            background: rgba(77,85,93,0.2)
          &.badActive
            background: #4d555d
    .switch
        font-size: 12px
        width: 100%
        padding: 12px 0 12px 18px
        color: rgb(147,153,159)
        border-bottom: 1px solid rgba(7,17,27,0.1)
        text-align: left
        .iconfont
          font-size: 16px
	      vertical-align: middle
	.eval-list
    .eval
      display: flex
      padding: 18px 0
      margin: 0 18px
      border-bottom: 1px solid rgba(7,17,27,.1)
      text-align: left
      .avatar
        flex: 0 0 28px
        margin-right: 12px
        img
          border-radius: 50%
      .content
        flex: 1
        .user
          font-size: 10px
          color: rgb(7,17,27)
          line-height: 12px
          .rateTime
            position: absolute
            font-weight: 200
            right: 18px
            color: rgb(147,153,159)
        .star-wrapper
          font-size: 0
          padding-top: 4px
          margin-bottom: 6px
          .star
            display: inline-block
          .deliveryTime
            font-size: 10px
            padding-left: 6px
            font-weight: 200
            color: rgb(147,153,159)
        .text
          font-size: 12px
          color: rgb(7,17,27)
          line-height: 18px
        .recommend
          padding-top: 4px
          .icon
            font-size: 12px
            color: rgb(0,160,220)
            line-height: 16px
          .dish
            display: inline-block
            font-size: 9px
            color: rgb(147,153,159)
            line-height: 16px
            border: 1px solid rgba(7,17,27,0.1)
            padding: 2px 6px
            margin-right: 8px
            white-space: normal
            margin-top: 4px

</style>