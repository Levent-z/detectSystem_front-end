import axios from 'axios'
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus'
import router from '@/router';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 1000,
});

instance.defaults.withCredentials = true;

// download
export const getDownloadService = (id) => {
  const userStore = useUserStore()
  if (!userStore.token) {
    ElMessage.error("登录已过期，请重新登录")
    router.push('/login')
    return
  }
  return instance.get(`/app/downloadRecord/?id=${id}`,{
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-CSRFToken': userStore.token,
    },
    timeout: 60000,
    responseType: 'blob'
  })
}