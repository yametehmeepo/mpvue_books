// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'test-367dae'
})

const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 10

// 云函数入口函数
exports.main = async (event, context) => {
  let res = await db.collection('books').get()
  let arr = res.data.slice(0)
  let books = arr.reverse()
  const start = event.start || 0
  return {
    books: books.slice(start, start + MAX_LIMIT),
    total: books.length,
    count: MAX_LIMIT
  }
}



