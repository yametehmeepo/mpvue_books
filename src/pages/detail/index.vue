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
        <span v-for="(item, index) in book.tags" :key="index" class="tag">{{item}}</span>
      </div>
      <div class="summary">
        <!--{{book.summary}}-->
        <p v-for="(item, index) in book.summary" :key="index">{{item}}</p>
      </div>
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
      <div class="btns" v-if="book.title">
        <button class="transmit" open-type="share">转发给好友</button>
        <button class="back" @click="back">返回列表</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Rate from '@/components/Rate'

  export default {
    components: {
      Rate
    },
    data() {
      return {
        id: '',
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
        locationAuthorized: true
      }
    },
    computed: {},
    methods: {
      getDetail() {
        //console.log('id', this.id)
        const book = wx.getStorageSync(this.id)
        if (book) {
          book.summary = book.summary.split('\n')
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
      back() {
        wx.navigateBack({
          delta: 1
        })
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
            this.location = res.result.location || '未知位置'
          } else {
            this.location = '未知位置'
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
      }
    },
    mounted() {
      this.id = this.$root.$mp.query.id
      this.getDetail()
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
