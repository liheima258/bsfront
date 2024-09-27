import axios from 'axios'
import router from "@/router";


const request = axios.create({
    baseURL: 'http://localhost:7000',
    timeout: 300000000
})
// request拦截器
// 可以自请求发送前端请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    let user = JSON.parse(localStorage.getItem("honey-user") || '{}')
    config.headers['token'] = user.token  // 设置请求头
    return config
}, error => {
    console.error('request error: ' + error)
    return Promise.reject(error)
});
//response拦截器
//可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        //兼容服务端返回的字符串数据
        if (typeof res === 'String') {
            res = res ? JSON.parse(res) : res
        }
        if(res.code === '401'){
            router.push("/login")
        }
        return res;
    },
    error => {
        console.error('response error:' + error) // for debug
        return Promise.reject(error)
    }
)
export default request

