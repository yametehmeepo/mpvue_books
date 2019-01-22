// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'test-367dae'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {id} = event
  try {
    const res = await db.collection('books').where({id}).get()
    let book = res.data[0] || []
    await db.collection('books').where({id}).update({
      data: {
        count: res.data[0].count ? res.data[0].count + 1 : 1
      }
    })
    return {
      code: 1,
      msg: '获取图书详情成功',
      book
    }
  } catch (e) {
    return {
      code: -1,
      msg: '获取图书详情失败'
    }
  }
}
