<template>
  <div ref="chartRef" style="min-height: 270px; width: 100%"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'BarChart',
  props: {
    head_title: String,
    data: Array,
    labels: Array
  },
  mounted() {
    this.initChart();
  },
  watch: {
    data: 'updateChart',
    labels: 'updateChart'
  },
  beforeUnmount() {
    this.chartInstance?.dispose();
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chartRef);
      this.setChartOption();
    },
    updateChart() {
      if (this.chartInstance) {
        this.setChartOption();
      }
    },
    setChartOption() {
      const option = {
        title: {
          text: this.head_title,
          left: 'center'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: this.labels
        },
        yAxis: {
          type: 'value',
          name: 'Points',
          minInterval: 1
        },
        series: [
          {
            name: 'Points',
            type: 'bar',
            data: this.data,
            barWidth: '40%',
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      };
      this.chartInstance.setOption(option);
    }
  }
};
</script>
