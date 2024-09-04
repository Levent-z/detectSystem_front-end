<template>
  <div class="user-box">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>重置密码</span>
        </div>
      </template>
      <div class="info-box">
        <el-form
          ref="changeForm"
          :model="form"
          label-width="auto"
          style="max-width: 600px"
          :rules="rules"
        >
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="form.newPwd" size="large" clearable show-password/>
          </el-form-item>
          <el-form-item label="确认新密码" prop="againPwd">
            <el-input v-model="form.againPwd" size="large" clearable show-password/>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="submitForm()" size="large">
              修改密码
            </el-button>
            <el-button @click="resetForm()" size="large">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { resetPwdService } from "@/api/login"
import { useUserStore } from "@/store/user"
import { ElMessage } from "element-plus";
const store = useUserStore()
const form = ref({
  newPwd: "",
  againPwd: "",
});
const rules = ref({
  newPwd: [
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
  againPwd: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.newPwd) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});
const changeForm = ref(null)
const submitForm = async () => {  
  await changeForm.value.validate()
  const res = await resetPwdService(form.value.newPwd)
  ElMessage.success("修改成功")  
  changeForm.value.resetFields()
}
const resetForm = () => {
  changeForm.value.resetFields()
}
</script>

<style>
.user-box {
  padding: 20px 40px;
}
.info-box {
  padding-left: 20px;
}
</style>