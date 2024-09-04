import axios from 'axios'
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus'
import router from '@/router';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 1000,
});

instance.defaults.withCredentials = true;

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const userStore = useUserStore()
  if( userStore.token) {
    config.headers['X-CSRFToken'] = userStore.token;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  ElMessage.error(error.message || '服务异常')
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  //下文的status和message都要根据具体命名修改
  const res = response.data

  //如果状态码不正确
  if(res.status !== 'success') {
    // 提示错误
    ElMessage.error(res.msg|| '服务异常')
    //抛出一个错误的promise，相当于中断了接下来的操作
    return Promise.reject(res)
  }
  return res;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if(error.response?.status === 401) {
    // 权限不足或者 token 过期
    router.push('/login')
  }
  // console.log(error);
  
  ElMessage.error(error.message || '服务异常')
  return Promise.reject(error);
});

export default instance