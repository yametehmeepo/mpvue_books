<template>
  <div class="container">
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <p>标题: {{item.title}}</p>
        <p>作者: {{item.author}}</p>
        <p>国家: {{item.publishInfo.country}}</p>
        <p>年份: {{item.publishInfo.year}}年</p>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
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
        this.showLoading()
        //云函数获取书籍
        wx.cloud.callFunction({
          name: 'getBooks',
        }).then(res => {
          console.log('getBooks-cloud', res)
          this.list = (res.result.data && res.result.data.books) ? res.result.data.books : []
          this.hideLoading()
        })
        //小程序获取书籍
        /*const db = wx.cloud.database()
        db.collection('books').doc('XD1Se3kPDdDCJ3YM').get().then(res => {
          console.log('getBooks-wx', res)
          this.list = (res.data && res.data.books) ? res.data.books : []
          this.hideLoading()
        })*/
      }
    },
    mounted() {
      this.getBooks()
    }
  }
</script>

<style scoped>
</style>
