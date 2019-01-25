<template>
  <div class="container">
    <div class="head">
      <div v-if="book.image" class="head-background" :style="{backgroundImage:'url(' + book.image + ')'}"></div>
      <div class="head-img">
        <img v-if="book.image" :src="book.image" alt="" mode="aspectFit">
      </div>
      <div class="title">
        {{book.title}}
      </div>
      <div class="author">
        {{book.author}}
      </div>
    </div>
    <div class="bookinfo">
      <div class="contributor">
        <div class="name">
          <img v-if="book.contributor.avatarUrl" :src="book.contributor.avatarUrl" alt="" mode="widthFix">
          {{book.contributor.nickName}}
        </div>
        <div class="rating">
          {{book.rating}}分
          <Rate :value="book.rating"></Rate>
        </div>
      </div>
      <div class="publisher-count">
        <div class="publisher">
          出版社: {{book.publisher}}
        </div>
        <div class="count">
          {{book.price}}
        </div>
      </div>
      <div class="tags">
        <span v-for="(item, tagIndex) in book.tags" :key="item" class="tag">{{item}}</span>
      </div>
      <div class="summary">
        <!--{{book.summary}}-->
        <p v-for="(item, index) in book.summary" :key="index">{{item}}</p>
      </div>
      <div class="commentslist">
        <div class="title">评论列表</div>
        <div v-if="commentsList.length">
          <comment-list :list="commentsList"></comment-list>
        </div>
        <div v-else class="nocomments">
          还没有任何评论
        </div>
      </div>
      <div class="comments">
        <div v-if="hasLogin">
          <div v-if="canComment">
            <div class="title">发表评论</div>
            <textarea
              class="textarea"
              v-model.trim="comment_text"
              placeholder="请输入评论"
              placeholder-class="placeholder-textarea"
              maxlength="100"
              @keyup.enter="addComments"
              @confirm="addComments"
            ></textarea>
            <div class="location">
              位置:
              <switch color="#EA5149" :checked="locationChecked" @change="locationSwitch"/>
              {{location}}
            </div>
            <div class="phone">
              手机:
              <switch color="#EA5149" @change="phoneSwitch"/>
              {{phone}}
            </div>
            <!--<button :loading="addLoading" class="button" @click="addComments">评论</button>-->
          </div>
          <div v-else class="cannotComment">
            您已评论过
          </div>
        </div>
        <div v-else class="cannotComment">
          您还没有登录，不能评论
        </div>
      </div>
      <div class="btns" v-if="book.title">
        <button class="transmit" open-type="share">转发给好友</button>
        <button class="back" @click="back">返回列表</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Rate from '@/components/Rate'
  import CommentList from '@/components/CommentList'

  export default {
    components: {
      Rate,
      CommentList
    },
    data() {
      return {
        id: '',
        userinfo: {},
        book: {
          image: '',
          contributor: {
            avatarUrl: '',
            nickName: ''
          }
        },
        backgroundImage: {},
        location: "",
        locationChecked: false,
        phone: '',
        locationAuthorized: true,
        comment_text: '',
        addLoading: false,
        commentTrigger: false,
        hasLogin: false,
        canComment: true,
        commentsList: []
      }
    },
    computed: {
      /*canComment(){
        return this.hasLogin ||
      }*/
    },
    methods: {
      getDetail() {
        //console.log('id', this.id)
        let book = wx.getStorageSync(this.id)
        if (book) {
          this.book = book
          wx.setNavigationBarTitle({
            title: book.title || ''
          })
          //console.log(book)
          return
        }
        wx.showLoading()
        wx.cloud.callFunction({
          name: 'getDetail',
          data: {
            id: this.id
          }
        }).then(res => {
          console.log('获取图书详情', res)
          this.book = res.result.book ? res.result.book : {}
          wx.setStorageSync(this.id, res.result.book)
          wx.setNavigationBarTitle({
            title: this.book.title || ''
          })
          wx.hideLoading()
        })
      },
      getComments() {
        wx.cloud.callFunction({
          name: 'getComments',
          data: {
            id: this.id
          }
        }).then(res => {
          console.log('getComments-cloud', res)
          if (res.result.code === 1) {
            this.commentsList = res.result.commentsList
            this.canComment = !res.result.commented
          }
        })
      },
      back() {
        wx.navigateBack({
          delta: 1
        })
      },
      addComments() {
        if (this.comment_text !== '') {
          if (this.commentTrigger) {
            return
          }
          wx.showLoading()
          this.commentTrigger = true
          this.addLoading = true
          wx.cloud.callFunction({
            name: 'addComment',
            data: {
              id: this.id,
              comment: this.comment_text,
              location: this.location || '未知地点',
              phone: this.phone || '未知型号',
              user: this.userinfo
            }
          }).then(res => {
            wx.hideLoading()
            console.log('addComment-cloud', res)
            if (res.result.code === 1) {
              wx.showToast({
                title: '添加评论成功',
                icon: 'none'
              })
              this.comment_text = ''
              this.canComment = false
              this.commentTrigger = false
              this.getComments()
            } else {
              wx.showToast({
                title: '添加评论失败',
                icon: 'none'
              })
              this.commentTrigger = false
            }
          }).catch(err => {
            wx.showToast({
              title: '添加评论失败',
              icon: 'none'
            })
            this.commentTrigger = false
            wx.hideLoading()
          })
        }
      },
      getLocationData(latitude, longitude) {
        //const ak = 'OfhWyvaVhXf0kvrupzF4NO9Rc6uEuQje'浏览器
        const ak = 'TOP6yqv0DKH9cCjOV6kcWP46jceR6DCM'
        const url = `http://api.map.baidu.com/geocoder/v2/?callback=&location=${latitude},${longitude}&output=json&pois=1&ak=${ak}`
        wx.request({
          url,
          success: res => {
            this.location = res.data.result.addressComponent.city
          }
        })
      },
      locationSwitch(e) {
        if (e.target.value) {
          this.locationChecked = true
          wx.getLocation({
            type: 'wgs84',
            success: (res) => {
              console.log(res.latitude, res.longitude)
              this.callFunctionLocation(res.latitude, res.longitude)
            },
            fail: err => {
              console.log('用户拒绝授权', err)
              this.showAuthorizeModal()
              this.locationAuthorized = false
              this.locationChecked = false
            }
          })
        } else {
          this.location = ''
          this.locationChecked = false
        }
      },
      callFunctionLocation(latitude, longitude) {
        wx.cloud.callFunction({
          name: 'getLocation',
          data: {
            latitude,
            longitude
          }
        }).then(res => {
          console.log('getLocation-res', res)
          if (res.result.code === 1) {
            this.location = res.result.location || '未知地点'
          } else {
            this.location = '未知地点'
          }
        })
        //this.getLocationData(res.latitude, res.longitude)
      },
      showAuthorizeModal() {
        if (!this.locationAuthorized) {
          wx.showModal({
            title: '',
            content: '检测到您没打开定位权限，是否去设置打开?',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    console.log(res.authSetting)
                    // res.authSetting = {
                    //   "scope.userInfo": true,
                    //   "scope.userLocation": true
                    // }
                  }
                })
              } else if (res.cancel) {
                console.log('用户拒绝授权')
              }
            },
            fail: err => {
              console.log('fail用户拒绝授权')
            }
          })
        }
      },
      phoneSwitch(e) {
        //console.log(wx.getSystemInfoSync())
        this.phone = e.target.value ? wx.getSystemInfoSync().model : ''
      },
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
            }
          }
        })
      }
    },
    mounted() {
      this.id = this.$root.$mp.query.id
      this.checkLoginStatus()
      this.getDetail()
      this.getComments()
    },
    onShareAppMessage(res) {
      console.log('点击转发')
    }
  }
</script>

<style lang="less" scoped>
  @import '~styles/variables.less';

  .container {
    padding: 0 0 10px;

    .head {
      position: relative;
      padding: 10px 10px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 200px;
      box-sizing: border-box;
      overflow: hidden;

      .head-background {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-color: rgba(0, 0, 0, 0.05);
        filter: blur(20px);
      }

      .head-img {
        min-height: 130px;

        img {
          height: 130px;
        }
      }

      .title {
        font-size: 16px;
        color: #fff;
        line-height: 1.2;
        margin-top: 2px;
        text-align: center;
      }

      .author {
        font-size: 12px;
        color: #fff;
        line-height: 1.2;
        margin-top: 5px;
        text-align: center;
      }
    }

    .bookinfo {
      margin-top: 15px;
      padding: 0 10px;

      .contributor {
        display: flex;
        width: 100%;
        flex-direction: row;

        .name {
          flex: 1;
          white-space: nowrap;
          font-size: 14px;
          line-height: 1;
          .ellipse1;

          img {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            vertical-align: middle;
          }
        }

        .rating {
          padding-top: 4px;
          font-size: 14px;
          line-height: 1;
          color: @color;
        }
      }

      .publisher-count {
        display: flex;
        width: 100%;
        margin-top: 12px;
        flex-direction: row;
        font-size: 14px;
        line-height: 1;

        .publisher {
          flex: 1;
        }

        .count {
          margin-left: 20px;
        }
      }

      .tags {
        margin: 10px 0 0 -10px;

        .tag {
          display: inline-block;
          border: 1px solid @color;
          font-size: 14px;
          line-height: 30px;
          border-radius: 10px;
          padding: 0 5px;
          color: @color;
          margin: 0 0 10px 10px;
        }
      }

      .summary {
        text-indent: 28px;
        font-size: 14px;
        line-height: 21px;
      }

      .commentslist {
        width: 100%;
        padding: 10px 0;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin: 20px 0 20px;

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

      .comments {
        margin-top: 20px;

        .cannotComment {
          font-size: 14px;
          line-height: 1.2;
          text-align: center;
          color: @color;
        }

        .title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .textarea {
          border: 1px solid #eee;
          font-size: 14px;
          line-height: 1.2;
          width: 100%;
          box-sizing: border-box;
          padding: 5px;
        }

        .location {
          margin-top: 5px;
          font-size: 14px;
        }

        .phone {
          margin-top: 5px;
          font-size: 14px;
        }

        .button {
          margin-top: 5px;
          .commonBtn;
        }
      }

      .btns {
        margin-top: 10px;

        button {
          margin-bottom: 10px;
          .commonBtn;
        }
      }
    }
  }
</style>
