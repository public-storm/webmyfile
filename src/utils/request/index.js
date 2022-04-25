import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL:  '/api', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})


export default service
