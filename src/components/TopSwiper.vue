<template>
  <div class="top">
    <swiper
      :indicator-dots="indicatorDots"
      :indicator-color="indicatorColor"
      :indicator-active-color="indicatorActiveColor"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      :circular="circular"
      :display-multiple-items="displayMultipleItems"
    >
      <block v-for="(top, topsIndex) in topsList" :key="topsIndex">
        <swiper-item>
          <div class="slide-image">
            <img v-for="item in top" :key="item.id" :src="item.image" @click="onSwipeImgClick(item)"/>
          </div>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script>
  export default {
    name: "TopSwiper",
    props: {
      tops: Array
    },
    data() {
      return {
        indicatorDots: true,
        interval: 5000,
        circular: true,
        autoplay: true,
        duration: 800,
        indicatorColor: '#b0b0b0',
        indicatorActiveColor: '#EA5149',
        displayMultipleItems: 1
      }
    },
    computed: {
      topsList() {
        let list = []
        for (let i = 0; i < 3; i++) {
          let item = this.tops.slice(3 * i, 3 * (i + 1))
          list.push(item)
        }
        return list
      }
    },
    methods: {
      onSwipeImgClick(item) {
        wx.navigateTo({
          url: '/pages/detail/main?id=' + item.id
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .top {
    padding: 10px 0 0;
    margin: 0 -15px 20px;
    min-height: 100px;

    .slide-image {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 15px;

      img {
        width: 95px;
        height: 125px
      }
    }
  }
</style>
