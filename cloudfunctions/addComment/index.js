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
  const {id, comment, location, phone} = event
  const data = {
    id,
    comment,
    location,
    phone,
    openid: wxContext.OPENID
  }
  try {
    await db.collection('comments').add({
      data,
    }).then(res => {
      console.log('添加评论成功', res)
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
