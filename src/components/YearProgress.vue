<template>
  <div class="container">
    <progress :percent="percent" color="#EA5149"/>
    <div class="text">
      {{year}}年已经过去 <span class="red">{{dayPassed}}</span> 天, <span class="red">{{percent}}</span> %
    </div>
  </div>
</template>

<script>
  export default {
    name: "YearProgress",
    computed: {
      passTime() {
        return new Date().getTime() - new Date(`${this.year}-01-01`).getTime()
      },
      year() {
        return new Date().getFullYear()
      },
      percent() {
        const nextYearTime = new Date(`${this.year + 1}-01-01`).getTime() - new Date(`${this.year}-01-01`).getTime()
        return (100 * this.passTime / nextYearTime).toFixed(2)
      },
      dayPassed() {
        return Math.ceil(this.passTime / (1000 * 60 * 60 * 24))
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    margin-top: 10px;

    .progress-bar {
      background-color: #ebebeb;

      .progress-bar-inner {
        height: 5px;
        background-color: #EA5149;
        width: 10%;
      }
    }

    .text {
      font-size: 15px;
      line-height: 1;
      margin-top: 10px;
      text-align: center;

      .red {
        color: #EA5149;
      }
    }
  }
</style>
