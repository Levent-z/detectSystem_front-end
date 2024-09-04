<template>
  <div class="layout">
    <div class="content-wrapper">
      <!-- 图片展示区域 -->
      <div class="image-section">
        <img :src="pictureUrl" alt="检测图像" class="detect-image" />
      </div>
      <!-- 操作区域 -->
      <div class="operation-panel">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          drag
          action="#"
          multiple
          ref="uploadRef"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-preview="handlePreview"
          :auto-upload="false"
          accept=".png, .jpg"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件到此处或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </template>
        </el-upload>
        <el-button
          type="primary"
          class="action-button"
          size="large"
          @click="handleUpload"
          >开始分析</el-button
        >
        <el-button class="action-button" size="large" @click="handleOutput"
          >导出</el-button
        >
      </div>
    </div>
    <div class="data-table">
      <div class="tip" v-show="upload_length !== detect_length">
        共上传{{ upload_length }}张图片，检测出{{ detect_length }}张图像存在缺陷
      </div>
      <el-table
        :data="tableData"
        ref="tableRef"
        border
        style="width: 100%"
        stripe
        show-overflow-tooltip
        highlight-current-row
        @current-change="handleCurrentChange"
        v-loading="loading"
        :element-loading-text="loadingText"
      >
        <el-table-column
          prop="id"
          label="序号"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="imageName"
          label="图片名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="detect_result"
          label="识别结果"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="target_num"
          label="目标数目"
          align="center"
        ></el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          size="default"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { uploadService, getResultService } from "@/api/detect";
import { getDownloadService } from "@/api/download";
import { ElMessage } from "element-plus";

const start = ref(false);
const upload_length = ref(0);
const detect_length = ref(0);
const fileDownloadId = ref();
const pictureUrl = ref(require("@/assets/null.jpg"));
const fileList = ref([]);
const uploadRef = ref(null);
const tableRef = ref(null);
const loading = ref(false);
const loadingText = ref("正在分析...");
const showPicture = (file) => {
  let tempUrl = window.URL.createObjectURL(file);
  pictureUrl.value = tempUrl;
};
const setCurrent = (row) => {
  console.log("row" + row);
  if (tableRef && tableRef.value) {
    tableRef.value.setCurrentRow(row);
  }
};
const handlePreview = (file) => {
  showPicture(file.raw);
};

const handleChange = (file, files) => {
  if (start.value) {
    tableData.value = [];
    currentPage.value = 1;
    total.value = 0;
    start.value = false;
    if (fileDownloadId.value) {
      // ElMessage.success("上轮检测结果已保存，可到 *历史记录* 下载")
      ElNotification({
        title: "Success",
        message: "上轮检测结果已保存，可到 *历史记录* 页面下载",
        type: "success",
      });
    }
  }
  console.log("change");
  const isIMAGE =
    file.raw.type === "image/jpeg" || file.raw.type === "image/png";
  const isLt500kb = file.size / 1024 < 500;
  if (!isIMAGE) {
    ElMessage.error("只能上传jpg/png图片!");
    uploadRef.value.handleRemove(file.raw);
    return false;
  }
  if (!isLt500kb) {
    ElMessage.error("上传文件大小不能超过 500kb!");
    uploadRef.value.handleRemove(file.raw);
    return false;
  }
  showPicture(file.raw);
  // if (start.value) {
  //   ElMessageBox.confirm(
  //     "重新上传图像将无法在此页面导出本次检测结果（历史记录 页面仍可下载检测结果）确认重新上传吗？",
  //     "温馨提示",
  //     {
  //       confirmButtonText: "确认",
  //       cancelButtonText: "取消",
  //       type: "warning",
  //     }
  //   )
  //     .then(() => {
  //       tableData.value = [];
  //       currentPage.value = 1;
  //       total.value = 0;
  //       start.value = false;
  //       console.log("change");
  //       const isIMAGE =
  //         file.raw.type === "image/jpeg" || file.raw.type === "image/png";
  //       const isLt500kb = file.size / 1024 < 500;
  //       if (!isIMAGE) {
  //         ElMessage.error("只能上传jpg/png图片!");
  //         uploadRef.value.handleRemove(file.raw);
  //         return false;
  //       }
  //       if (!isLt500kb) {
  //         ElMessage.error("上传文件大小不能超过 500kb!");
  //         uploadRef.value.handleRemove(file.raw);
  //         return false;
  //       }
  //       showPicture(file.raw);
  //     })
  //     .catch(() => {
  //       console.log("tableData:");
  //       console.log(tableData.value[0]);
  //       ElMessage({
  //         type: "info",
  //         message: "取消上传成功",
  //       });
  //       uploadRef.value.handleRemove(file.raw);
  //       return false;
  //     });
  // } else {
  //   console.log("change");
  //   const isIMAGE =
  //     file.raw.type === "image/jpeg" || file.raw.type === "image/png";
  //   const isLt500kb = file.size / 1024 < 500;
  //   if (!isIMAGE) {
  //     ElMessage.error("只能上传jpg/png图片!");
  //     uploadRef.value.handleRemove(file.raw);
  //     return false;
  //   }
  //   if (!isLt500kb) {
  //     ElMessage.error("上传文件大小不能超过 500kb!");
  //     uploadRef.value.handleRemove(file.raw);
  //     return false;
  //   }
  //   showPicture(file.raw);
  // }
};
const handleRemove = (file, files) => {
  // files是变化后的文件列表
  // 此时fileList是变化前的文件列表
  console.log("remove");
  console.log(file, files);
  console.log(fileList.value);

  if (files.length === 0) {
    // if(!start.value)
    pictureUrl.value = require("@/assets/null.jpg");
  } else {
    showPicture(files[files.length - 1].raw);
  }
};

const tableData = ref([]);
const pageSize = ref(10);
const currentPage = ref(1);
const total = ref(0);
const refreshData = (t, size, list) => {
  tableData.value = [];
  total.value = t;
  for (let i = 0; i < size; i++) {
    const item = list[i];
    tableData.value.push({
      id: i + 1,
      imageName: item.picture_path.substring(
        item.picture_path.lastIndexOf("/") + 1
      ),
      detect_result: item.detect_result,
      target_num: item.target_num,
      path: item.picture_path,
    });
  }
  setCurrent(tableData.value[0]);
  if (t === 0) {
    pictureUrl.value = require("@/assets/null.jpg");
  }
};
const handleUpload = async () => {
  if (fileList.value.length === 0) {
    ElMessage.error("请至少选择一张检测图片");
    return;
  }
  // console.log(fileList.value.length);
  loadingText.value = "正在分析...";
  loading.value = true;
  const res = await uploadService(fileList.value, pageSize.value);
  console.log(res);
  fileDownloadId.value = res.data.id;
  upload_length.value = fileList.value.length;
  detect_length.value = res.data.file_detect_count;
  fileList.value = [];
  await refreshData(
    res.data.file_detect_count,
    res.data.page_file_count,
    res.data.page_file_list
  );
  loading.value = false;
  ElMessage.success(res.msg);
  start.value = true;
};
const handleCurrentChange = (val) => {
  console.log("currnet change" + val);

  if (val) {
    pictureUrl.value = val.path;
  } else {
    console.log("total" + total.value);

    if (total >= 1) setCurrent(tableData.value[0]);
    else setCurrent();
  }
};
const handlePageChange = async () => {
  loadingText.value = "正在加载...";
  loading.value = true;
  const res = await getResultService(currentPage.value, pageSize.value);
  console.log(res);
  await refreshData(
    res.data.file_detect_count,
    res.data.page_file_count,
    res.data.page_file_list
  );
  loading.value = false;
};
const handleSizeChange = async () => {
  if (total.value === 0) {
    return;
  }
  loadingText.value = "正在加载...";
  loading.value = true;
  const res = await getResultService(currentPage.value, pageSize.value);
  await refreshData(
    res.data.file_detect_count,
    res.data.page_file_count,
    res.data.page_file_list
  );
  loading.value = false;
};

const handleOutput = async () => {
  if (!start.value) {
    ElMessage.error("请先上传数据开始分析");
    return;
  }
  if (!fileDownloadId.value) {
    ElMessage.warning("本次检测结果为空");
    return;
  }
  console.log("output " + fileDownloadId.value);
  const res = await getDownloadService(fileDownloadId.value);
  console.log(res);
  const temp = res?.headers?.["content-disposition"]
    ?.split(";")?.[1]
    ?.split("filename=")?.[1];
  const fileName = decodeURIComponent(temp);
  let blob = new Blob([res?.data], { type: "application/octet-stream" }); // 处理文档流
  const elink = document.createElement("a"); // 创建a标签
  elink.download = fileName;
  elink.style.display = "none";
  elink.href = URL.createObjectURL(blob); // 创建blob地址
  document.body.appendChild(elink); // 将a标签添加到body中
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL对象
  document.body.removeChild(elink); // 从body中移除a标签
};
</script>

<style scoped>
.content-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 20px 40px;
}

.image-section {
  width: 60%;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.detect-image {
  max-width: 100%;
  /* border: 4px solid red; */
}

.operation-panel {
  width: 35%;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.upload-demo {
  margin-bottom: 20px;
}

.action-button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
.el-button + .el-button {
  margin-left: 0px;
}
.data-table {
  padding: 0 40px;
  margin-bottom: 30px;
}
.demo-pagination-block {
  padding: 20px 0;
  display: flex;
  justify-content: flex-end;
  /* flex-direction: column; 如果希望纵向对齐 */
}
.tip {
  margin-bottom: 10px;
}
</style>
