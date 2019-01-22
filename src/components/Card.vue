<template>
  <div class="item" @click="navigateToDetail">
    <div class="img">
      <img :src="book.image" alt="" mode="widthFix">
    </div>
    <div class="bookinfo">
      <div class="row">
        <div class="title">
          {{book.title}}
        </div>
        <div class="rating">
          {{book.rating}}
          <Rate :value="book.rating"></Rate>
        </div>
      </div>
      <div class="row authorRow">
        <div class="author">
          {{book.author}}
        </div>
        <div class="browse">
          浏览:15
        </div>
      </div>
      <div class="row publisherRow">
        <div class="publisher">
          {{book.publisher}}
        </div>
        <div class="contributor">
          {{book.contributor.nickName}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Rate from '@/components/Rate'

  export default {
    name: "Card",
    props: ['book'],
    components: {
      Rate
    },
    methods: {
      navigateToDetail() {
        wx.navigateTo({
          url: '/pages/detail/main?id=' + this.book.id
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~styles/variables.less';

  .item {
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;

    .img {
      width: 64px;
      margin-right: 15px;

      img {
        width: 100%;
        display: block;
      }
    }

    .bookinfo {
      width: 266px;

      .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 14px;
        line-height: 1;

        .rating {
          /*width: 80px;*/
          margin-left: 10px;
          padding-top: 3px;
          color: @color;
        }

        .title {
          flex: 1;
          padding-top: 3px;
          color: @color;
          .ellipse1
        }

        .author {
          line-height: 1.2;
          .ellipse2
        }

        .browse {
          margin-left: 10px;
          white-space: nowrap;
          color: @color;
        }

        .publisher {
          flex: 1;
          line-height: 1.2;
          .ellipse2
        }

        .contributor {
          max-width: 120px;
          margin-left: 10px;
          .ellipse1
        }
      }

      .authorRow {
        margin-top: 6px;
      }

      .publisherRow {
        margin-top: 6px;
      }
    }
  }
</style>
