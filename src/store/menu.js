import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore('menu', () => {
  // 声明数据 state
  // 声明操作数据的方法 actions
  // 声明基于数据派生出的计算属性 getters
  const isCollapse = ref(false)

  const setCollapse = (val) => {
    isCollapse.value = val;
  }

  return {
    isCollapse,
    setCollapse
  }
},
  {
    persist: true
  })