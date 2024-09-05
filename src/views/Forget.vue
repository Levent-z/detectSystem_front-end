<template>
  <div class="forgot-password-background">
    <div class="forgot-password-container">
      <el-card class="forgot-password-card" shadow="hover">
        <h3 class="forgot-password-title" style="margin-bottom: 30px">
          重置密码
        </h3>
        <!-- <p class="forgot-password-description">
          请输入您的账号和邮箱地址，系统将发送验证码到您的邮箱。
        </p> -->

        <el-form
          :model="forgotPasswordForm"
          :rules="rulesStep1"
          ref="forgotPasswordFormRef"
          label-width="0px"
          class="forgot-password-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="forgotPasswordForm.username"
              placeholder="请输入账号"
              prefix-icon="user"
              class="custom-input"
              size="large"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="forgotPasswordForm.email"
              placeholder="请输入邮箱地址"
              prefix-icon="message"
              class="custom-input"
              size="large"
              clearable
            >
              <template #append>
                <el-button
                  style="primary"
                  @click="sendVerificationCode"
                  :disabled="isSendingCode"
                  >{{
                    isSendingCode ? `重新发送(${countdown}s)` : "发送验证码"
                  }}</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="forgotPasswordForm.code"
              placeholder="请输入验证码"
              prefix-icon="ticket"
              class="custom-input"
              size="large"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="newPassword">
            <el-input
              v-model="forgotPasswordForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              prefix-icon="lock"
              class="custom-input"
              size="large"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="forgotPasswordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              prefix-icon="lock"
              class="custom-input"
              size="large"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            @click="resetPassword"
            class="submit-button"
            size="large"
            >修改密码</el-button
          >
        </el-form>
        <div class="back-to-login">
          <el-link @click="goToLogin">返回登录</el-link>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { forgetPwdService, getCodeService } from "@/api/login"

const router = useRouter();

const forgotPasswordForm = ref({
  username: "",
  email: "",
  code: "",
  newPassword: "",
  confirmPassword: "",
});

const rulesStep1 = {
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
  code: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    // { type: 'number', message: '验证码为 6 位数字', trigger: "change" },
    // { min: 6, max: 6, message: '验证码为 6 位数字', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入新密码"));
        }

        // 检查密码长度
        if (value.length < 6) {
          return callback(new Error("密码长度不能少于6个字符"));
        }

        if (value.length > 16) {
          return callback(new Error("密码长度不能多于16个字符"));
        }

        // 检查是否包含大小写字母和数字或符号
        const hasLower = /[a-z]/.test(value);
        const hasUpper = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        const conditionsMet =
          (hasLower && hasUpper) ||
          (hasLower && hasNumber) ||
          (hasUpper && hasNumber) ||
          (hasLower && hasSpecial) ||
          (hasUpper && hasSpecial) ||
          (hasNumber && hasSpecial);

        if (!conditionsMet) {
          return callback(
            new Error("密码由6-16位数字、字母或符号组成，至少包含2钟字符")
          );
        }

        callback();
      },
    },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== forgotPasswordForm.value.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const isSendingCode = ref(false);
const countdown = ref(0);
const forgotPasswordFormRef = ref(null);

const sendVerificationCode = async () => {
  await forgotPasswordFormRef.value.validateField('email');
  // 发送验证码的 API 调用
  console.log("Sending verification code to", forgotPasswordForm.value.email);
  await getCodeService(forgotPasswordForm.value.email, "forget");
  isSendingCode.value = true;
  countdown.value = 60;
  // 开始倒计时
  const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
      isSendingCode.value = false;
    }
  }, 1000);
};

const resetPassword = async () => {
  await forgotPasswordFormRef.value.validate()
  const form = forgotPasswordForm.value
  await forgetPwdService(form.username, form.newPassword, form.email, form.code)
  ElMessage.success('修改密码成功')
  router.push("/login");
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
/* 样式与之前的保持一致 */
.forgot-password-background {
  background-image: url("@/assets/background-image.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.forgot-password-container {
  width: 550px;
}

.forgot-password-card {
  padding: 60px;
  border-radius: 10px;
}

.forgot-password-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.forgot-password-description {
  text-align: center;
  margin-bottom: 20px;
}

.custom-input .el-input__inner {
  border: none;
  border-bottom: 2px solid #dcdfe6;
  border-radius: 0;
  box-shadow: none;
}

.custom-input .el-input__inner:focus {
  border-bottom-color: #409eff;
}

.submit-button {
  width: 200px;
  margin: 0 auto;
  display: block;
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
}

/deep/ .el-input-group__append,
.el-input-group__prepend {
  align-items: center;
  background-color: #409eff;
  border-radius: var(--el-input-border-radius);
  color: #fff;
  display: inline-flex;
  justify-content: center;
  min-height: 100%;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
}

/deep/ .el-input-group__append:hover,
/deep/ .el-input-group__prepend:hover {
  background-color: #79bbff;
}
</style>
