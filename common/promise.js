const app = getApp()
// 封装post请求
const post = (url, data, loading) => {
  if (loading) {
    app.showLoaing('加载中..')
  }
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {//服务器返回数据
        wx.hideLoading()
        if (res.statusCode == 200) {
          resolve(res);
        } else {//返回错误提示信息
          reject(res.data);
        }
      },
      fail: function () {
        app.showTost('网络错误')
      }
    })
  });
  return promise;
}
// 封装get请求
const get = (url, data, loading) => {
  if (loading) {
    app.showLoaing('加载中..')
  }
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {//服务器返回数据
        wx.hideLoading()
        if (res.statusCode == 200) {
          resolve(res);

        } else {//返回错误提示信息
          reject(res.data);
        }
      },
      fail: function (e) {
        app.showTost('网络错误')
      }
    })
  });
  return promise;
}

module.exports = {
  post,
  get,
}