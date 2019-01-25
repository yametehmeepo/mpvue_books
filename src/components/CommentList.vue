<template>
  <div class="container">
    <div v-for="item in list" :key="item.id" class="item" @click="handleClick(item)">
      <div class="info">
        <div class="left">
          <img :src="item.avatarUrl" alt="">
          {{item.nickName}}
        </div>
        <div class="right">
          {{item.location}} -- {{item.phone}}
        </div>
      </div>
      <div class="comment">
        {{item.comment}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommentList",
    props: {
      list: Array,
      navigateble: Boolean
    },
    methods: {
      handleClick(item) {
        if (this.navigateble) {
          wx.navigateTo({
            url: '/pages/detail/main?id=' + item.id
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~styles/variables.less';

  .container {
    .item {
      width: 100%;
      font-size: 14px;
      line-height: 1.2;
      margin-bottom: 10px;

      .info {
        display: flex;
        flex-direction: row;
        align-items: center;

        .left {
          flex: 1;
          .ellipse1;

          img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            vertical-align: middle;
          }
        }

        .right {

        }
      }

      .comment {
        margin-top: 5px;
        width: 100%;
        color: #999;
        .ellipse2;
      }
    }


  }
</style>
