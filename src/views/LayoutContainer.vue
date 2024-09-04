<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="collapse"><CommonAside/></el-aside>
      <el-container>
        <el-header><CommonHeader/></el-header>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CommonHeader from '@/components/CommonHeader.vue'
import CommonAside from '@/components/CommonAside'
import {useMenuStore} from '@/store/menu'
const menuStore = useMenuStore()

</script>

<style>
.el-container {
  height: 100vh;
}

.el-main {
  padding: 0 0;
  background-color: #F5F5F5;
}

.el-header {
  padding: 0 0;
  height: 50px;
}
</style>