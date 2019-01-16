// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'test-367dae'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('todos').add({
    data: {
      description: 'learn cloud database',
      tags: [
        'cloud',
        'database'
      ],
      location: new db.Geo.Point(113, 23),
      done: false
    }
  })
}
