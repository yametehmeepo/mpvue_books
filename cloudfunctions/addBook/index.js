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
  const {OPENID, APPID} = cloud.getWXContext()
  let userObj = await db.collection('userList').where({
    openId: OPENID
  }).get()
  userObj = userObj.data[0]
  //userObj['nickName'] = userObj.nickName || '佚名'

  let bookinfoDB = await db.collection('books').where({
    isbn
  }).get()
  bookinfoDB = bookinfoDB.data
  if (bookinfoDB.length) {
    return {
      msg: '图书已存在',
      code: 1,
      bookinfo: {
        ...bookinfoDB[0]
      }
    }
  }

  try {
    let bookinfo = await getBook(isbn)
    bookinfo.tags = bookinfo.tags.map(tag => {
      let count = (tag.count && tag.count.toString().length >= 5) ? tag.count.toString().slice(0, -3) + 'K' : tag.count
      return `${tag.name} ${count}`
    })
    bookinfo.author = bookinfo.author.length ? bookinfo.author.join('/') : '佚名'
    await db.collection('books').add({
      data: {
        alt: bookinfo.alt,
        author: bookinfo.author,
        id: bookinfo.id,
        image: bookinfo.image,
        isbn: bookinfo.isbn13,
        price: bookinfo.price,
        pubdate: bookinfo.pubdate,
        publisher: bookinfo.publisher,
        rating: bookinfo.rating.average,
        subtitle: bookinfo.subtitle,
        summary: bookinfo.summary,
        title: bookinfo.title,
        tags: bookinfo.tags,
        url: bookinfo.url,
        count: 0,
        contributor: {
          nickName: userObj.nickName,
          avatarUrl: userObj.avatarUrl
        }
      }
    })
    return {
      msg: `《${bookinfo.title}》添加成功`,
      code: 0,
      bookinfo: {
        ...bookinfo,
        contributor: userObj.nickName
      }
    }
  } catch (e) {
    console.log('错误信息', e)
    return {
      msg: '添加图书失败',
      code: -1
    }
  }
}

function getBook(isbn) {
  return new Promise((resolve, reject) => {
    //http://t.yushu.im/v2/book/isbn/
    //https://api.douban.com/
    request('https://api.douban.com/v2/book/isbn/' + isbn, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(JSON.parse(body))
      } else {
        reject(error)
      }
    })
  })
}
