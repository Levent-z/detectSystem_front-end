<template>
  <div class="top-header">
    <!-- 左侧菜单折叠按钮 -->
    <el-button class="menu-button" @click="toggleSidebar">
      <template v-if="menuStore.isCollapse">
        <el-icon size="22px"><Expand /></el-icon>
      </template>
      <template v-else>
        <el-icon size="22px"><Fold /></el-icon>
      </template>
    </el-button>
    <!-- <el-icon class="header-icon">
        <search />
      </el-icon>
      <el-icon class="header-icon">
        <bell />
      </el-icon> -->
    <!-- 右侧功能图标和用户信息 -->
    <el-dropdown @command="handleCommand">
      <div class="header-right">
        <el-avatar
          class="user-avatar"
          size="default"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        ></el-avatar>
        <span class="username">{{
          store.userId ? store.userId : "默认用户666"
        }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="a"><el-icon><Postcard /></el-icon> 基本资料</el-dropdown-item>
          <el-dropdown-item command="b"><el-icon><EditPen /></el-icon> 重置密码</el-dropdown-item>
          <el-dropdown-item command="c"><el-icon><SwitchButton /></el-icon> 退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { useMenuStore } from "@/store/menu";
import { useRouter } from "vue-router";
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useUserStore();
const menuStore = useMenuStore();
const router = useRouter();
const toggleSidebar = () => {
  // 触发菜单折叠的逻辑
  // this.$emit('toggle-sidebar');
  if (menuStore.isCollapse) {
    menuStore.setCollapse(false);
  } else {
    menuStore.setCollapse(true);
  }
};
const handleCommand = (command) => {
  if(command === "a") {
    router.push("/home/user")
  } else if(command === "b") {
    router.push("/home/reset")
  } else {
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
      store.removeUserInfo()
      router.push("/login")
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '退出登录取消',
      })
    })
  }
}
</script>

<style scoped>
.top-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.menu-button {
  border: none;
  background-color: transparent;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-icon {
  margin: 0 10px;
  font-size: 20px;
  cursor: pointer;
}

.user-avatar {
  margin-left: 20px;
}

.username {
  margin-left: 10px;
  font-weight: bold;
}
</style>
