import axios from "axios";
import Vue from 'vue'

//更换部署服务器时更改这两个常量
//接口地址

// const api_url = process.env.API_ROOT;//配置地址线上线上线下自动切换线下http://localhost:8080走代理，线上http://qr.yoyis.win:60
var url = window.location.href
var index=url.lastIndexOf("/#/")
url=url.substring(0,index);

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = url;
//request拦截器
axios.interceptors.request.use(
    config => {
        // 在header上带上token
        // if (store.get("peruser")) {
        //     config.headers['token'] = store.get("peruser").token;
        // } 
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//response拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    function(error) {
        return Promise.reject(error);
    }
);
Vue.prototype.$http = axios;
export const API_URL = url;
export const webUrl = url;
