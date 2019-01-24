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
  const {latitude, longitude} = event
  try {
    const res = await getLocation(latitude, longitude)
    return {
      code: 1,
      msg: '获取地理位置成功',
      location: res.result.addressComponent.city
    }
  } catch (e) {
    return {
      code: -1,
      msg: '获取地理位置失败'
    }
  }
  //return await getLocation(latitude, longitude)
}

function getLocation(latitude, longitude) {
  return new Promise((resolve, reject) => {
    //浏览器: OfhWyvaVhXf0kvrupzF4NO9Rc6uEuQje 微信小程序: TOP6yqv0DKH9cCjOV6kcWP46jceR6DCM
    //用浏览器的ak才可以, 或许是因为云函数不属于小程序端
    const ak = 'OfhWyvaVhXf0kvrupzF4NO9Rc6uEuQje'
    //const ak = 'TOP6yqv0DKH9cCjOV6kcWP46jceR6DCM'
    const url = `http://api.map.baidu.com/geocoder/v2/?callback=&location=${latitude},${longitude}&output=json&pois=1&ak=${ak}`
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(JSON.parse(body))
      } else {
        reject(error)
      }
    })
  })
}
