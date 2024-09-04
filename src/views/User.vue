<template>
  <div class="user-box">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>基本资料</span>
        </div>
      </template>
      <div class="info-box">
        <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" disabled size="large"/>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="form.email" disabled size="large"/>
        </el-form-item>
      </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted,ref } from "vue";
import { useUserStore } from "@/store/user"
const store = useUserStore()
const form = ref({
  name: store.userId,
  email: store.email,
});

</script>

<style scoped>
.user-box {
  padding: 20px 40px;
}
.info-box {
  padding-left: 20px;
}
</style>