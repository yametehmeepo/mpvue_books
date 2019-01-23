// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'test-367dae'
})
const db = cloud.database()
const MAX_LIMIT = 9
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let res = await db.collection('books').orderBy('count', 'desc').limit(MAX_LIMIT).get()
    const tops = res.data
    return {
      code: 1,
      msg: '获取热门图书成功',
      tops
    }
  } catch (e) {
    return {
      code: -1,
      msg: '获取热门图书失败'
    }
  }
}
