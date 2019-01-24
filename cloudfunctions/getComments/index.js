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
  try {
    const list = await db.collection('comments').get()
    return {
      code: 1,
      msg: '获取评论成功',
      comment: list.data
    }
  } catch (e) {
    return {
      code: 1,
      msg: '获取评论失败',
      data: e
    }
  }
}
