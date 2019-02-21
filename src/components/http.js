// 让axios变成Vue插件
// 把axios相关代码封装成Vue的插件
// 结果 在main.js可以Vue.use(axios)

import axios from 'axios'

import {
  Message
} from 'element-ui'

// Vue插件
const HttpServer = {};

HttpServer.install = function (Vue) {

  // 插件要封装的功能
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 除了登录之外的, 才需要下面2行代码
  // 登录的响应req和其他请求req一样
  // 拦截->axios拦截请求
  // 请求拦截器的代码
  // 100个请求
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log(config);

    // console.log("请求拦截器被触发----");

    // 1. headers请求头
    // 2. url 请求标识路径
    // console.log(config);
    // 如果请求是login, 直接发送请求
    // console.log(config.url);

    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem("token");
      // 给当前请求设置请求头
      // axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      config.headers["Authorization"] = AUTH_TOKEN;
    }
    // 当请求不是login, 先加头部,然后继续发送请求

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  //
  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    console.log("res拦截器被触发----");
    console.log(response);
    const {
      meta: {
        status,
        msg
      }
    } = response.data;
    if (status !== 200 && status !== 201) {
      Message.warning(msg);
    }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
  Vue.prototype.$http = axios
}
export default HttpServer;
