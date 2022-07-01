import axios from 'axios'
import {Message} from 'element-ui'
import da from "element-ui/src/locale/lang/da";

// create an axios instance
const service = axios.create({
    baseURL: '/api', // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000 // request timeout
})

service.interceptors.response.use(
    response => {
        const data = response.data;
        if (data.code === '10403') {
            window.localStorage.removeItem('userName');
            console.log('remove key')
            this.$vs.notification({
                color: 'danger',
                position: 'top-center',
                text: '登录过期，请重新登录'
            })
            this.$route.path === '/login'
        }
        return response;
    },
    error => {
        Message({
            message: '服务器错误！',
            type: 'error'
        })
        return Promise.reject(error)
    }
)

export default service
