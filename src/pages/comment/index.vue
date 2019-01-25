<template>
  <div class="container">
    <div class="title">
      我的评论
    </div>
    <div v-if="hasLogin">
      <div v-if="myComments.length">
        <comment-list :list="myComments" :navigateble="true"></comment-list>
      </div>
      <div v-else class="nocomments">
        您还没有评论过图书
      </div>
    </div>
    <div v-else class="nocomments">
      您还没有登录, 请先登录
    </div>
    <div class="title">
      我的图书
    </div>
    <div v-if="hasLogin">
      <div v-if="myBooks.length">
        <Card v-for="(book, index) in myBooks" :key="book.id" :book="book"></Card>
      </div>
      <div v-else class="nocomments">
        您还没有添加过图书
      </div>
    </div>
    <div v-else class="nocomments">
      您还没有登录, 请先登录
    </div>
  </div>
</template>

<script>
  import Card from "@/components/Card"
  import CommentList from '@/components/CommentList'

  export default {
    components: {
      Card,
      CommentList
    },
    data() {
      return {
        myComments: [],
        myBooks: [],
        hasLogin: false,
        userinfo: {}
      }
    },
    methods: {
      checkLoginStatus() {
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userInfo']) {
              this.hasLogin = true
              const userinfo = wx.getStorageSync('userinfo')
              if (userinfo) {
                this.userinfo = userinfo
              } else {
                wx.getUserInfo({
                  success: (res) => {
                    //console.log('login', res)
                    this.userinfo = res.userInfo
                  }
                })
              }
              this.init()
            }
          }
        })
      },
      init() {
        wx.showNavigationBarLoading()
        this.getMyComments()
        this.getMyBooks()
        wx.hideNavigationBarLoading()
      },
      async getMyBooks() {
        const res = await wx.cloud.callFunction({
          name: 'getMyBooks',
          data: {
            openId: this.userinfo.openId
          }
        })
        //console.log('getMyBooks-cloud', res)
        this.myBooks = res.result.code === 1 ? res.result.myBooks : []
      },
      async getMyComments() {
        const res = await wx.cloud.callFunction({
          name: 'getMyComments',
          data: {
            openId: this.userinfo.openId
          }
        })
        //console.log('getMyComments-cloud', res)
        this.myComments = res.result.code === 1 ? res.result.myComments : []
      }
    },
    onShow() {
      this.checkLoginStatus()
    }
  }
</script>

<style lang="less" scoped>
  @import '~styles/variables.less';

  .container {
    padding: 15px 15px;

    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .nocomments {
      font-size: 14px;
      line-height: 1.2;
      text-align: center;
      color: @color;
    }
  }
</style>
