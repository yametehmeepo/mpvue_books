// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
cloud.init({
  traceUser: true,
  env: 'test-367dae'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {isbn} = event
  const bookinfoDB = await db.collection('books').where({
    isbn
  }).get()

  if (bookinfoDB.data.length) {
    return {
      msg: '图书已存在',
      code: 1,
      bookinfo: {
        ...bookinfoDB.data[0]
      }
    }
  } else {
    try {
      const bookinfo = await getBook(isbn)
      await db.collection('books').add({
        data: bookinfo
      })
      return {
        msg: `《${bookinfo.title}》添加成功`,
        code: 0,
        bookinfo
      }
    } catch (e) {
      return {
        msg: '添加图书失败',
        code: -1
      }
    }
  }
}

function getBook(isbn) {
  return new Promise((resolve, reject) => {
    request('http://t.yushu.im/v2/book/isbn/' + isbn, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(JSON.parse(body))
      } else {
        reject(error)
      }
    })
  })
}
