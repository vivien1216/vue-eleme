<template>
  <div class="goods">

    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current':index ===currentIndex}" @click="selectMenu(index, $event)">
          <span class="text  border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>

    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="foods-list food-list-hook" ref="foodList">
           <h1 class="title">{{item.name}}</h1>
           <ul>
             <li v-for="food in item.foods" class="food-item">
               <div class="food-icon">
                  <img :src="food.icon" />
               </div>
               <div class="content">
                 <h2 class="name">{{food.name}}</h2>
                 <p class="desc">{{food.description}}</p>
                 <div class="extra">
                   <span>月售{{food.sellCount}}份</span>
                   <span>好评率{{food.rating}}%</span>
                 </div>
                 <div class="price">
                    <span class="newPrice">¥{{food.price}}</span>
                    <span class="oldPrice" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                 </div>
               </div>
             </li>
           </ul>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import Bscroll from 'better-scroll'

export default {
  name: 'homeGoods',
  data () {
    return {
      goods: [],
      listHeight: [],
	  scrollY: 0
    }
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
    return 0;
    }
  },
  created () {
    axios.get('/api/goods.json').then((res) => {
      res = res.data
      if(res.ret && res.data){
        this.goods = res.data
        this.$nextTick(() => {
	      this._initScroll(); // 初始化scroll
	      this._calculateHeight(); // 初始化列表高度列表
	    })
      }
    });
    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
  },
  methods: {
    selectMenu (index, event) {
      if(!event._constructed) {
        return
      }
      let foodList = this.$refs.foodList;
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el,300)
    },

     _initScroll() {
      this.menuWrapper = new Bscroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodsScroll = new Bscroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });
      // 监控滚动事件
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
     },
    _calculateHeight() {
        let foodList = this.$refs.foodList;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/style/mixin.styl'
.goods
  position: absolute
  top: 174px
  bottom: 46px
  display: flex
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background-color: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 56px
      line-height: 14px
      padding: 0 12px
      text-align: left
      &.current
        position: relative
        margin-top: -1px
        z-index: 10
        background-color: #fff
        color: red
        font-weight: 700
        .text
          border: none
      .text
        display: table-cell
        width: 56px
        vertical-align: middle
        font-size: 12px
        border-1px(rgba(7,17,27,.1))
        .icon
          display: inline-block
          width: 12px
          height: 12px
          vertical-align: top
          margin-right: 4px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')        
  .foods-wrapper
    flex: 1
    text-align: left
    .title
      font-size: 12px
      height: 26px
      line-height: 26px
      padding-left: 14px
      color: rgb(147,153,169)
      border-left: 2px solid #d9dde1
      background-color: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7,17,27,.1))
      &:last-child
        border-none()
        margin-bottom: 0
      .food-icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          font-size: 14px
          line-height: 14px
          color: rgb(7,17,27)
          margin: 2px 0 8px 0
        .desc
          font-size: 10px
          color: rgb(147,153,159)
          line-height: 10px
          margin-bottom: 8px
        .extra
          font-size: 10px
          color: rgb(147,153,159)
          line-height: 10px
          margin-bottom: 8px 
        .price
          font-size: 10px
          color: rgb(147,153,159)
          line-height: 24px
          .newPrice
            color: red
            font-size: 14px
            font-weight: 700
            margin-right: 8px
          .oldPrice
            text-decoration: line-through
</style>