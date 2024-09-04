<template>
  <el-container>
    <!-- 卡片容器 -->
    <el-row :gutter="20">
      <el-col :span="8" v-for="item in stats" :key="item.title">
        <el-card shadow="hover">
          <div class="stat-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.value }}</p>
            <p class="stat-trend">{{ item.trend }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表容器 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <div id="line-chart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div id="pie-chart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script setup>
import { onMounted } from 'vue';
import * as echarts from 'echarts';

const stats = [
  { title: '指标一', value: '1,156', trend: '↑2.6%' },
  { title: '指标二', value: '256,887', trend: '↑1.8%' },
  { title: '指标三', value: '119,568', trend: '↑0.56%' },
  { title: '指标四', value: '4,789', trend: '↓0.89%' },
  { title: '指标五', value: '1,156', trend: '↑2.6%' },
  { title: '指标六', value: '119,568', trend: '↑0.56%' }
];

onMounted(() => {
  // 折线图初始化
  const lineChart = echarts.init(document.getElementById('line-chart'));
  const lineChartOption = {
    xAxis: { type: 'category', data: ['06-01', '06-02', '06-03', '06-04', '06-05', '06-06', '06-07'] },
    yAxis: { type: 'value' },
    series: [{ data: [10, 22, 28, 43, 49, 62, 50], type: 'line' }]
  };
  lineChart.setOption(lineChartOption);

  // 饼图初始化
  const pieChart = echarts.init(document.getElementById('pie-chart'));
  const pieChartOption = {
    series: [{
      type: 'pie',
      data: [
        { value: 1048, name: 'A类' },
        { value: 735, name: 'B类' },
        { value: 580, name: 'C类' }
      ]
    }]
  };
  pieChart.setOption(pieChartOption);
});
</script>

<style scoped>
.stat-card {
  text-align: center;
}

.stat-trend {
  color: #f56c6c;
}
</style>
