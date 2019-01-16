const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'test-367dae'
})

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('todos').where({
      done: true
    }).remove()
  } catch (e) {
    console.error(e)
  }
}
