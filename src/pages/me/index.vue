<template>
  <div class="container">
    me
  </div>
</template>

<script>

  export default {
    mounted() {
      wx.cloud.callFunction({
        name: 'login',
      }).then(res => {
        console.log('me/login', res)
      })
    }
  }
</script>

<style scoped>
</style>
