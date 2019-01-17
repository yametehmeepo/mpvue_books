<template>
  <div class="container">
    <div class="userinfo">
      <img v-if="hasLogin" class="avatar" :src="userinfo.avatarUrl" alt="">
      <div class="nickname">{{userinfo.nickName}}</div>
    </div>
    <p class="loginbtn" v-if="!hasLogin">
      <button open-type="getUserInfo" @getuserinfo="authorization">点击登录</button>
    </p>
    <YearProgress></YearProgress>
    <button v-if="hasLogin" class="commonBtn btn" @click="scanBook">添加图书</button>
  </div>
</template>

<script>
  import {showSuccess} from "@/utils/util"
  import YearProgress from '@/components/YearProgress'

  export default {
    components: {
      YearProgress
    },
    data() {
      return {
        userinfo: {},
        hasLogin: false
        //canIUse: wx.canIUse('button.open-type.getUserInfo')
      }
    },
    mounted() {
      this.checkLoginStatus()
    },
    methods: {
      checkLoginStatus() {
        wx.showLoading()
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userInfo']) {
              this.hasLogin = true
              wx.getUserInfo({
                success: (res) => {
                  // showSuccess('登录成功')
                  wx.hideLoading()
                  this.hasLogin = true
                  this.userinfo = res.userInfo
                }
              })
            } else {
              wx.hideLoading()
              this.hasLogin = false
              this.userinfo = {}
            }
          }
        })
      },
      authorization(e) {
        let userInfo = e.mp.detail.userInfo
        if (userInfo) {
          wx.showLoading()
          wx.cloud.callFunction({
            name: 'login'
          }).then(res => {
            console.log('login云传过来的', res)
            this.hasLogin = true
            this.userinfo = userInfo
            wx.hideLoading()
          })
          //wx.setStorageSync('userinfo', userInfo);
        }
      },
      scanBook() {
        wx.scanCode({
          success(res) {
            console.log(res)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    padding: 80px 10px 0;

    .userinfo {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 115px;

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 10px;
      }
    }

    .loginbtn {
      width: 100px;
      margin: 20px auto 0;

      button {
        font-size: 15px;
        line-height: 30px;
        color: #000;
        border: 1px solid #ccc;
        padding: 0;
        margin: 0;
      }
    }

    .btn {
      margin-top: 100px;
    }
  }
</style>
