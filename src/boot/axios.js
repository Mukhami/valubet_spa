import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
  }
})

export default ({ Vue }) => {
  Vue.prototype.$axios = instance
}

instance.interceptors.response.use(
  response => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      location.reload()
    }
    return Promise.reject(error.response)
  })

export { instance }
