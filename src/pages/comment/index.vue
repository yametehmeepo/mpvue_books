<template>
  <div class="container">
    comment
  </div>
</template>

<script>

  export default {
    mounted() {
      wx.cloud.callFunction({
        name: 'login',
      }).then(res => {
        console.log('comment/login', res)
      })
    }
  }
</script>

<style scoped>
</style>
