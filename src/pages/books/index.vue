<template>
  <div class="container">
    <Card v-for="(book, index) in list" :key="book.id" :book="book"></Card>
  </div>
</template>

<script>

  import Card from "@/components/Card"

  export default {
    components: {
      Card
    },
    data() {
      return {
        list: []
      }
    },
    methods: {
      showLoading() {
        wx.showNavigationBarLoading()
      },
      hideLoading() {
        wx.hideNavigationBarLoading()
      },
      getBooks() {
        wx.showNavigationBarLoading()
        wx.cloud.callFunction({
          name: 'getBooks',
        }).then(res => {
          console.log('getBooks-cloud', res)
          this.list = (res.result.data && res.result.data) ? res.result.data : []
          wx.hideNavigationBarLoading()
        })
      }
    },
    mounted() {
      this.getBooks()
    }
  }
</script>

<style lang="less" scoped>
  @import '~styles/variables.less';

  .container {
    padding: 0 15px;
  }
</style>
