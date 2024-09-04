<template>
  <div class="card-box">
    <el-row :gutter="20">
      <!-- 上方的卡片布局 -->
      <el-col :span="6" v-for="(item, index) in stats" :key="index">
        <el-card class="static-card">
          <div class="stat-title">{{ item.title }}</div>
          <div class="stat-number">{{ item.number }}</div>
          <!-- <div class="stat-footer">{{ item.change }}</div> -->
        </el-card>
      </el-col>
    </el-row>
  </div>

  <div class="chart-box">
    <!-- 下方的图表布局 -->
    <el-row :gutter="20" class="charts">
      <el-col :span="12">
        <el-card>
          <div ref="lineChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div ref="pieChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getDataService } from "@/api/detect";
import * as echarts from "echarts";

const cardData = ref({});
const lineData = ref([]);
const stats = ref([]);
const lineChart = ref(null);
const pieChart = ref(null);

const initCharts = () => {
  // 初始化折线图
  const lineChartInstance = echarts.init(lineChart.value);
  lineChartInstance.setOption({
    title: { text: "最近7次检测总故障频次结果" },
    xAxis: { type: "category", data: ["1", "2", "3", "4", "5", "6", "7"] },
    yAxis: { type: "value" },
    series: [
      {
        data: lineData.value,
        type: "line",
        smooth: true,
      },
    ],
  });

  // 初始化饼图
  const pieChartInstance = echarts.init(pieChart.value);
  pieChartInstance.setOption({
    title: { text: "故障发生频次各类型占比", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        name: "故障类型",
        type: "pie",
        radius: "50%",
        data: [
          { value: cardData.value.rolled_in_scale, name: "扎痕积压(RS)" },
          { value: cardData.value.patches, name: "面片(Pa)" },
          { value: cardData.value.crazing, name: "银纹(Cr)" },
          { value: cardData.value.pitted_surface, name: "点蚀面积(PS)" },
          { value: cardData.value.inclusion, name: "夹杂(In)" },
          { value: cardData.value.scratches, name: "划痕(Sc)" },
        ],
      },
    ],
    // roseType: 'area',
  });
};

onMounted(async () => {
  const res = await getDataService();
  console.log(res);
  cardData.value = res.data.broken_counts;
  console.log(cardData.value);
  stats.value = [
    {
      title: "扎痕积压(RS)",
      number: cardData.value.rolled_in_scale,
      change: "↑ 相比昨日增加2.6%",
    },
    {
      title: "面片(Pa)",
      number: cardData.value.patches,
      change: "↑ 相比昨日增加1.8%",
    },
    {
      title: "银纹(Cr)",
      number: cardData.value.crazing,
      change: "↓ 相比昨日减少0.56%",
    },
    {
      title: "点蚀面积(PS)",
      number: cardData.value.pitted_surface,
      change: "↓ 相比昨日减少0.89%",
    },
    {
      title: "夹杂(In)",
      number: cardData.value.inclusion,
      change: "↑ 相比昨日增加2.6%",
    },
    {
      title: "划痕(Sc)",
      number: cardData.value.scratches,
      change: "↑ 相比昨日增加1.8%",
    },
    {
      title: "总故障频次",
      number: cardData.value.total,
      change: "↓ 相比昨日减少0.56%",
    },
  ];
  lineData.value = res.data.last7_totals;
  initCharts();
});
</script>

<style scoped>
.stat-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #5b5b5b;
}
.stat-number {
  font-size: 28px;
  color: #409eff;
  text-align: center;
  margin-top: 20px;
}
.stat-footer {
  font-size: 14px;
  text-align: center;
  color: #888;
  margin-top: 15px;
}

.card-box {
  margin: 0 40px;
}
.chart-box {
  margin: 20px 40px;
}
.static-card {
  max-width: 230px;
  height: 130px;
  margin: 20px 0px;
  padding: 20px 0px;
}
</style>
