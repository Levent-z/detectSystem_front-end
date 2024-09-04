import { defineStore } from "pinia";
import { ref } from "vue";
import Cookies from "js-cookie";

export const useUserStore = defineStore('user', () => {
  // 声明数据 state
  // 声明操作数据的方法 actions
  // 声明基于数据派生出的计算属性 getters
  const userId = ref('')
  const token = ref('')
  const email = ref('')

  const setUserInfo = (id, t, e) => {
    console.log(id,t);
    Cookies.set('csrftoken', t);
    userId.value = id;
    token.value = t;
    email.value = e;
  }

  const removeUserInfo = () => {
    userId.value = '';
    token.value = '';
    Cookies.remove('csrftoken');
  }
  return {
    userId,
    token,
    email,
    setUserInfo,
    removeUserInfo
  }
},
  {
    persist: true
  })