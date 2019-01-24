// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  traceUser: true,
  env: 'test-367dae'
})
const db = cloud.database()
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 *
 * event 参数包含小程序端调用传入的 data
 *
 */
exports.main = async (event, context) => {
  //console.log(event)
  //console.log(context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const {OPENID, APPID} = cloud.getWXContext()

  let userdata = await db.collection('userList').where({
    openId: OPENID
  }).get()

  if (userdata.data.length === 0) {
    try {
      const data = Object.assign({}, event.user, event.userInfo)
      await db.collection('userList').add({
        data
      })
      return {
        code: 0,
        msg: '登录成功',
        data
      }
    } catch (e) {
      return {
        code: -1,
        msg: '登录失败',
        data
      }
    }
  } else {
    return {
      code: 1,
      msg: '登录成功',
      data: userdata.data[0]
    }
  }
}
