<template>
  <div class="container">
    comment
  </div>
</template>

<script>

  export default {
    data() {
      return {
        start: ''
      }
    },
    mounted() {
      //console.log('onLaunch-options', wx.getLaunchOptionsSync())
    },
    onShow() {
      this.start = new Date().getTime()
    },
    onHide() {
      // const end = (new Date().getTime() - this.start) / 1000
      // console.log(end)
    }
  }
</script>

<style scoped>
</style>
