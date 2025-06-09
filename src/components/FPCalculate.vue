<template>
  <div>
    <el-card>
      <h2 style="margin-bottom: 30px">
        Function Point Calculator
        <Popover></Popover>
      </h2>

      <el-form :inline="true" label-width="220px" class="fp-form">
        <el-form-item label="External Inputs (EI)">
          <el-input-number v-model="fp.EI[0]" :min="0" /> Low
          <el-input-number v-model="fp.EI[1]" :min="0" class="ml-2" /> Avg
          <el-input-number v-model="fp.EI[2]" :min="0" class="ml-2" /> High
        </el-form-item>

        <el-form-item label="External Outputs (EO)">
          <el-input-number v-model="fp.EO[0]" :min="0" /> Low
          <el-input-number v-model="fp.EO[1]" :min="0" class="ml-2" /> Avg
          <el-input-number v-model="fp.EO[2]" :min="0" class="ml-2" /> High
        </el-form-item>

        <el-form-item label="External Queries (EQ)">
          <el-input-number v-model="fp.EQ[0]" :min="0" /> Low
          <el-input-number v-model="fp.EQ[1]" :min="0" class="ml-2" /> Avg
          <el-input-number v-model="fp.EQ[2]" :min="0" class="ml-2" /> High
        </el-form-item>

        <el-form-item label="Internal Logical Files (ILF)">
          <el-input-number v-model="fp.ILF[0]" :min="0" /> Low
          <el-input-number v-model="fp.ILF[1]" :min="0" class="ml-2" /> Avg
          <el-input-number v-model="fp.ILF[2]" :min="0" class="ml-2" /> High
        </el-form-item>

        <el-form-item label="External Interface Files (EIF)">
          <el-input-number v-model="fp.EIF[0]" :min="0" /> Low
          <el-input-number v-model="fp.EIF[1]" :min="0" class="ml-2" /> Avg
          <el-input-number v-model="fp.EIF[2]" :min="0" class="ml-2" /> High
        </el-form-item>
      </el-form>

      <el-divider>Weight Table</el-divider>
      <el-table :data="tableData" style="width: 60%; margin: 0 auto">
        <el-table-column prop="type" label="Function Type" />
        <el-table-column prop="low" label="Low Weight" />
        <el-table-column prop="avg" label="Avg Weight" />
        <el-table-column prop="high" label="High Weight" />
      </el-table>

      <el-divider>Calculation Breakdown</el-divider>
<!--      <div v-for="(values, key) in fp" :key="key" class="calc-item">-->
<!--        <p>-->
<!--          {{ key }}:-->
<!--          <span v-for="(count, i) in values" :key="i">-->
<!--            {{ count }} × {{ weights[key][i] }} = {{ count * weights[key][i] }}-->
<!--            <span v-if="i < 2"> + </span>-->
<!--          </span>-->
<!--          → subtotal = {{ subtotal(key) }}-->
<!--        </p>-->
<!--      </div>-->
<!--      <el-divider>Function Type Contribution</el-divider>-->
      <BarChart :data="chartValues" :labels="chartLabels" />

      <el-divider />

      <h3>Total Function Points: <el-tag type="success">{{ totalFP }}</el-tag></h3>
    </el-card>
  </div>
</template>

<script>
import BarChart from '@/components/BarChart.vue';
import Popover from "@/components/Popover.vue";
export default {
  name: 'FPCalculate',
  components: {Popover, BarChart },
  data() {
    return {
      fp: {
        EI: [0, 0, 0],
        EO: [0, 0, 0],
        EQ: [0, 0, 0],
        ILF: [0, 0, 0],
        EIF: [0, 0, 0]
      },
      weights: {
        EI: [3, 4, 6],
        EO: [4, 5, 7],
        EQ: [3, 4, 6],
        ILF: [7, 10, 15],
        EIF: [5, 7, 10]
      }
    };
  },
  computed: {
    totalFP() {
      let total = 0;
      for (const key in this.fp) {
        for (let i = 0; i < 3; i++) {
          total += this.fp[key][i] * this.weights[key][i];
        }
      }
      return total;
    },
    tableData() {
      return Object.keys(this.weights).map(key => ({
        type: key,
        low: this.weights[key][0],
        avg: this.weights[key][1],
        high: this.weights[key][2]
      }));
    },
    chartLabels() {
      return Object.keys(this.fp);
    },
    chartValues() {
      return this.chartLabels.map(key =>
          this.fp[key].reduce((sum, val, i) => sum + val * this.weights[key][i], 0)
      );
    }
  },
};
</script>

<style scoped>
.fp-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ml-2 {
  margin-left: 10px;
}
.calc-item {
  margin-bottom: 8px;
  font-size: 15px;
}
</style>
