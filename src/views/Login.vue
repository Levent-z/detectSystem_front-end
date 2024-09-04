<template>
  <div class="login-background">
    <div class="login-container">
      <el-card class="login-card" shadow="hover">
        <div class="login-content">
          <img
            class="login-image"
            src="@/assets/login-image.png"
            alt="Login Image"
          />
          <div class="login-form-container">
            <h3 class="login-title">登录 钢铁表面缺陷检测系统</h3>
            <el-form
              :model="loginForm"
              :rules="rules"
              ref="loginFormRef"
              label-width="0px"
              class="login-form"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  prefix-icon="user"
                  size="large"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  prefix-icon="lock"
                  size="large"
                  show-password
                  clearable
                ></el-input>
              </el-form-item>
              <div class="forgot-password">
                <el-link @click="goToForget">忘记密码？</el-link>
              </div>
              <el-button
                type="primary"
                @click="handleLogin"
                block
                class="login-button"
                >登录</el-button
              >
              <div class="register-link">
                没有账号？<el-link type="primary" @click="goToRegister">立即注册</el-link>
              </div>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"
import { loginService } from "@/api/login"
import { useUserStore } from "@/store/user"

const router = useRouter();
const userStore = useUserStore();

const loginForm = ref({
  username: "",
  password: "",
});

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 12, message: "密码长度必须为 6 至 12", trigger: "change" },
  ],
};

const loginFormRef = ref(null)

const handleLogin = async () => {
  // 表单校验
  await loginFormRef.value.validate()
  const res = await loginService(loginForm.value.username, loginForm.value.password)  
  console.log(res);
  userStore.setUserInfo(loginForm.value.username, res.data['csrf-token'], res.data.email)
  ElMessage.success('登录成功，欢迎')
  router.push('/home')
};

const goToForget = () => {
  router.push('/forget')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-background {
  background-image: url("@/assets/background-image.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  width: 800px; /* 设定更宽的容器 */
}

.login-card {
  padding: 40px;
  border-radius: 10px;
}

.login-content {
  display: flex;
  flex-direction: row; /* 设置为水平方向 */
  align-items: center;
}

.login-image {
  width: 50%; /* 左侧图片占一半宽度 */
  height: auto;
  margin-right: 20px; /* 图片与表单之间的间距 */
}

.login-form-container {
  width: 50%; /* 表单部分占一半宽度 */
  margin-right: 20px;
}

.login-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 35px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-button {
  height: 40px;
  width: 150px; /* 设置按钮宽度 */
  margin: 0 auto;
  display: block;
}

.forgot-password {
  text-align: right;
  margin-bottom: 15px;
}

.register-link {
  font-size: 15px;
  text-align: center;
  margin-top: 16px;
}
</style>
