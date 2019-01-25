// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'test-367dae'
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = event.openId || wxContext.OPENID

  try {
    const comments = await db.collection('comments').where({
      openId
    }).get()
    return {
      code: 1,
      msg: "获取我的评论成功",
      myComments: comments.data
    }
  } catch (e) {
    return {
      code: -1,
      msg: "获取我的评论失败"
    }
  }
}
