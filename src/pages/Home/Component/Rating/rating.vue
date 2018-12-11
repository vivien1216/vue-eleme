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
       <selectRatings
        @select="selectRating"
        @toggle="toggleContent"
        :selectType="selectType"
        :onlyContent="onlyContent" :desc="desc"
        :ratings="ratings"
       ></selectRatings>
       <div class="eval-list">
         <ul>
           <li class="eval" v-for="item in ratings"
            v-show="needShow(item.rateType, item.text)">
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
                 <i class="iconfont" v-show="item.rateType===1">&#xe6a4;</i>
                 <i class="iconfont icon-thumb_up" v-show="item.rateType===0">&#xe602;</i>
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
import BScroll from 'better-scroll'
import star from 'components/Star/star'
import selectRatings from 'components/selectRatings/selectRatings'

const ALL = 2;

export default {
  name: 'homeRating',
  data () {
    return {
      ratings: [],
      seller: {},
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      },
      evelflag: true
    }
   },
  methods: {
   getHomeRatings () {
     axios.get('/api/rating.json')
      .then( (res) => {
        res = res.data
        if(res.ret && res.data) {
          this.ratings = res.data
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
  selectRating(type) {
    this.selectType = type;
    this.$nextTick(() => {
      this.scroll.refresh();
    });
  },
  toggleContent() {
    this.onlyContent = !this.onlyContent;
    this.$nextTick(() => {
      this.scroll.refresh();
    });
  }
},
  created () {
    this.getHomeRatings();
    this.getHomeSeller();
  },
  components: {
    star,
    selectRatings
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
          .icon-thumb_up
             color: rgb(0, 160, 220)
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