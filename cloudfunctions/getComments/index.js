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
  const openId = wxContext.OPENID
  try {
    const list = await db.collection('comments').where({
      id: event.id
    }).get()
    const user_comment = await db.collection('comments').where({
      openId,
      id: event.id
    }).get()
    return {
      code: 1,
      msg: '获取评论成功',
      commented: user_comment.data.length !== 0,
      commentsList: list.data
    }
  } catch (e) {
    return {
      code: -1,
      msg: '获取评论失败',
      data: e
    }
  }
}
