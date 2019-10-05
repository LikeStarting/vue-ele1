<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import vHeader from '@/components/Header.vue'
export default {
  data () {
    return {
      seller: {}
    }
  },
  created () {
    this.axios.get('assets/data.json').then(res => {
      this.seller = res.data.seller
    })
  },
  components: {
    vHeader
  }
}
</script>

<style lang="scss">
  @import '@/common/scss/index';

  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    @include border-1px(rgba(7,17,27,0.1));
    .tab-item {
      flex: 1;
      text-align: center;
      a {
          display: block;
          font-size: 14px;
          color: #4d555d;
          &.active {
            color: #f01414;
          }
      }
    }
  }
</style>
