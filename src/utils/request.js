import {config} from "./config"

const request = (collection) => {
  const db = wx.cloud.database({
    env: config.env,
    traceUser: true
  })
}

export default request
