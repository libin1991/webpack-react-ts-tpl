// import Axios from "axios"
// import {}
// const service = axios.create({
//   baseURL,
//   timeout: 20000  ,
//    validateStatus(status) {
//       switch (status) {
//       case 400:
//           Toast.info('请求出错', 1)
//           break
//       case 401:
//           Toast.info('授权失败，请重新登录',1)
//           window.location.href = loginUrl
//           break
//       case 403:
//           Toast.info('拒绝访问,请重新登录',1)
//           window.location.href = loginUrl
//           break
//       case 404:
//           Toast.info('请求错误,未找到该资源',1)
//           break
//       case 500:
//           Toast.info('服务端错误',1)
//           break
//       default:
//           break   
//       }
//       return status >= 200 && status <= 300
//   }                // 请求超时时间
// });