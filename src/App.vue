<script>
  export default {
    // created() {
    //   console.log('created')
    // },
    // mounted() {
    //   console.log('mounted')
    // },
    onLaunch(options) {


    }
  }
</script>

<style lang="less">
  @import '~styles/variables.less';

  .commonBtn {
    width: 100%;
    text-align: center;
    background-color: @color;
    color: #fff;
    font-size: 14px;
    line-height: 36px;
    border-radius: 4px;
  }

  .commonBtn:active {
    background-color: #FA5149;
  }
</style>
