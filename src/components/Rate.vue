<template>
  <div class="wrap">
    <span class="up" :style="style">★★★★★</span>
    <span class="down">☆☆☆☆☆</span>
  </div>
</template>

<script>
  export default {
    name: "Rate",
    props: {
      value: {
        type: [Number, String],
        default: 0
      }
    },
    computed: {
      style() {
        return `width: ${this.value * 10}%`
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~styles/variables.less';

  .wrap {
    display: inline-block;
    position: relative;
    color: @color;

    .up {
      display: inline-block;
      position: absolute;
      width: 2em;
      left: 0;
      top: 0;
      overflow: hidden;
    }
  }
</style>
