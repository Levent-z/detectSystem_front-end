<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :default-active="route.path"
    text-color="#fff"
    :collapse="menuStore.isCollapse"
    router
  >
    <el-menu-item index="/home/detect">
      <el-icon><Failed /></el-icon>
      <span>故障检测</span>
    </el-menu-item>
    <el-menu-item index="/home/dataAnalyze">
      <el-icon><DataAnalysis /></el-icon>
      <span>数据分析</span>
    </el-menu-item>
    <el-menu-item index="/home/history">
      <el-icon><document /></el-icon>
      <span>历史记录</span>
    </el-menu-item>
    <el-sub-menu index="4">
      <template #title>
        <el-icon><User /></el-icon>
        <span>个人中心</span>
      </template>
        <el-menu-item index="/home/user">基本资料</el-menu-item>
        <el-menu-item index="/home/reset">重置密码</el-menu-item>
        <el-menu-item  @click="handleLogOut">退出登录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { useMenuStore } from '@/store/menu'
import { useUserStore } from '@/store/user'
import {useRouter, useRoute} from 'vue-router'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const userStore = useUserStore()

const handleLogOut = () => {
  ElMessageBox.confirm(
    '你确定退出系统吗？',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '退出登录成功',
      })
      userStore.removeUserInfo()
      router.push("/login")
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '退出登录取消',
      })
    })

}
</script>

<style>
.el-menu {
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu-item.is-active {
      background-color: #1990ffe0 !important;
      color: #fff;
      span {
        font-size: 15px;
        font-weight: 600;
        color: #fff !important;
      }
    }
</style>