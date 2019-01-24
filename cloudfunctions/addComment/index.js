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
  const {id, comment, location, phone, user} = event
  const data = {
    id,
    comment,
    location,
    phone,
    openId: wxContext.OPENID,
    nickName: user.nickName,
    avatarUrl: user.avatarUrl
  }
  try {
    await db.collection('comments').add({
      data,
    })
    return {
      code: 1,
      msg: '添加评论成功',
      data
    }
  } catch (e) {
    return {
      code: -1,
      msg: '添加评论失败'
    }
  }
}
