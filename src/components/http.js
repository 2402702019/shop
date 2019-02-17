// // 让axios变成Vue插件
// // 把axios相关代码封装成Vue的插件
// // 结果 在main.js可以Vue.use(axios)
// import axios from 'axios'

// const HttpServer = {}
// HttpServer.install = function (Vue, options) {
// // 插件要封装的功能
// // 独立功能->js->模块
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/' // 设置头部
//     //  const AUTH_TOKEN = localStorage.getItem("token")
//     //  axios.defaults.headers.common["Authorization"] = AUTH_TOKEN
//     // Vue.prototype.$http = axios

// axios.interceptors.request.use(function (config) {
//     return config;
// }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   });
// }

// export default HttpServer
import axios from 'axios'
const HttpServer = {}
HttpServer.install = function (Vue) {
  // 插件要封装的功能
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  axios.interceptors.request.use(function (config) {
    console.log(config)
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers.common['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
  Vue.prototype.$http = axios
}

export default HttpServer
