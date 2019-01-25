<template>
  <div class="container">
    <div class="title">评论列表</div>
    <div class="list" v-if="list.length">
      <div v-for="item in list" :key="item.id" class="item">
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
    <div v-else class="nocomments">
      还没有任何评论
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommentList",
    props: {
      list: Array
    }
  }
</script>

<style lang="less" scoped>
  @import '~styles/variables.less';

  .container {
    width: 100%;
    padding: 10px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin: 20px 0 20px;

    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .list {
      /*max-height: 500px;
      overflow-y: auto;*/

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

    .nocomments {
      font-size: 14px;
      line-height: 1.2;
      text-align: center;
      color: @color;
    }
  }
</style>
