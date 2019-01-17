# mpvue_books

##踩坑

> 小程序·云开发 

现在小程序推出了云开发, 之前后端的实现是配合腾讯云管理数据库, 现在采用云开发需要掌握`云函数` `存储` `数据库` 三个概念及使用方法
<ul>
<li><code>云函数</code>: 云函数是一段运行在云端的代码，无需管理服务器，在开发工具内编写、一键上传部署即可运行后端代码。</li>
<li><code>存储: 云开发提供了一块存储空间，提供了上传文件到云端、带权限管理的云端下载能力，开发者可以在小程序端和云函数端通过 API 使用云存储功能。</code></li>
<li><code>数据库</code>: 云开发提供了一个 JSON 数据库，顾名思义，数据库中的每条记录都是一个 JSON 格式的对象。一个数据库可以有多个集合（相当于关系型数据中的表），集合可看做一个 JSON 数组，数组中的每个对象就是一条记录，记录的格式是 JSON 对象。</li>
</ul>

####云函数
使用方法:

`小程序端`
<pre>
wx.cloud.callFunction({
  name: 'cloudFunction-name'
}).then(res=>{
  console.log('login云传过来的', res)
})
</pre>
`云函数端`
<pre>
const cloud = require('wx-server-sdk')

exports.main = async (event, context) => await cloud.callFunction({
  name: 'sum',
  data: {
    x: 1,
    y: 2,
  }
})
</pre>

######需要注意
云函数控制台创建了两个环境的话在云函数中初始化的时候最好要传入`env`参数, 也就是`环境ID`, 
确保每次操作的环境正确  
只有一个环境的话可以不传

####存储
小程序端上传
<pre>
wx.cloud.uploadFile({
  cloudPath: 'example.png', // 上传至云端的路径
  filePath: '', // 小程序临时文件路径
  success: res => {
    // 返回文件 ID
    console.log(res.fileID)
  },
  fail: console.error
})
</pre>
######上传成功后会获得文件唯一标识符，即文件 ID，后续操作都基于文件 ID 而不是 URL。

小程序端下载
<pre>
wx.cloud.downloadFile({
  fileID: '', // 文件 ID
  success: res => {
    // 返回临时文件路径
    console.log(res.tempFilePath)
  },
  fail: console.error
})
</pre>

小程序端删除
<pre>
wx.cloud.deleteFile({
  fileList: ['a7xzcb'],
  success: res => {
    // handle success
    console.log(res.fileList)
  },
  fail: console.error
})
</pre>

####数据库

<li>云函数操作数据库的时候不支持回调函数 只支持`promise`</li>
<li>小程序端不支持`where`查询</li>
<li>云函数查询不到时添加数据:</li>
<pre>
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'test-367dae'
})
const db = cloud.database()
exports.main = async (event, context) => {
  const {OPENID, APPID} = cloud.getWXContext()
  let userdata = await db.collection('userList').where({
    openid: OPENID
  }).get()
  if (userdata.data.length === 0) {
    return await db.collection('userList').add({
      data: {
        openid: OPENID
      }
    })
  } else {
    return {
      event,
    }
  }
}
</pre>
