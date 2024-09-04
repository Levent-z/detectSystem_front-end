<template>
  <div class="table-box">
    <el-table
      :data="tableData"
      style="width: 100%"
      stripe
      v-loading="loading"
      element-loading-text="正在加载..."
    >
      <el-table-column type="index" width="180" align="center" :index="indexMethod"/>
      <el-table-column label="文件名称" align="center">
        <template #default="scope">
            <span>{{ scope.row.record_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="scope">
            <el-icon><timer /></el-icon>
            <span style="margin-left: 10px">{{ scope.row.record_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            @click="handleDownload(scope.$index, scope.row)"
          >
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="demo-pagination-block">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      size="default"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getRecordService } from "@/api/detect";
import { getDownloadService } from "@/api/download";

onMounted(() => {
  getTableData();
});
const indexMethod = (index) => {
  return (currentPage.value-1)*pageSize.value + index + 1
}
const getTableData = async () => {
  loading.value = true
  const res = await getRecordService(currentPage.value, pageSize.value);
  console.log(res);
  tableData.value = res.data.page_record_list;
  total.value = res.data.record_count;
  loading.value = false
};
const tableData = ref([]);
const pageSize = ref(10);
const currentPage = ref(1);
const total = ref(0);
const loading = ref(false);
const handleSizeChange = () => {
  getTableData();
};
const handleCurrentChange = () => {
  getTableData();
};
const handleDownload = async(index, row) => {
  console.log(index, row.id);
  const res = await getDownloadService(row.id)
  const temp = res?.headers?.["content-disposition"]?.split(";")?.[1]?.split("filename=")?.[1];
  const fileName = decodeURIComponent(temp);
  let blob = new Blob([res?.data], { type: 'application/octet-stream' }) // 处理文档流
    const elink = document.createElement('a') // 创建a标签
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob) // 创建blob地址
    document.body.appendChild(elink) // 将a标签添加到body中
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL对象
    document.body.removeChild(elink) // 从body中移除a标签
};
</script>

<style scoped>
.table-box {
  margin-top: 0;
  padding: 20px 40px;
}
.demo-pagination-block {
  padding: 20px 40px;
  display: flex;
  justify-content: flex-end;
  /* flex-direction: column; 如果希望纵向对齐 */
}
</style>