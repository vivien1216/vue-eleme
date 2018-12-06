<template>
  <div class="cartcontrol">
    <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
      <i class="iconfont">&#xe728;</i>
    </div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add" @click="addCart">
      <i class="iconfont">&#xe61a;</i>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'cartcontrol',
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      if (!event._constructed) {
        return;
      }
      if (!this.food.count) {
       Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit('add', event.target);
    },
    decreaseCart (event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.cartcontrol
  display: flex
  flex-direction: row
  .cart-decrease
    font-size: 24px
    color: rgb(0,160,220)
  .cart-count
    font-size: 12px
    line-height: 24px
    margin-right: 8px
    margin-left: 8px
  .cart-add
    font-size: 24px
    color: rgb(0,160,220)

</style>