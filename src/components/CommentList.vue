<template>
  <div class="container">
    <div class="title">评论列表</div>
    <div class="list">
      <div v-for="item in list" :key="item.id">
        list
      </div>
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
    margin: 20px 0;

    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .list {
      /*max-height: 500px;
      overflow-y: auto;*/
    }
  }
</style>
