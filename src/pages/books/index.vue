<template>
  <div class="container">
    books
  </div>
</template>

<script>

  export default {
    mounted() {
      wx.cloud.callFunction({
        name: 'login',
      }).then(res => {
        console.log('books/login', res)
      })
    }
  }
</script>

<style scoped>
</style>
