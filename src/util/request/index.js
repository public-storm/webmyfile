import axios from 'axios'

const service = axios.create({
  baseURL: '/api', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
  validateStatus: function(status) {
    return status >= 200 && status < 600 // 默认的
  }
})

export default service
