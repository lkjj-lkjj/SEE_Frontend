<template>
  <div>
    <el-card style="height: 82vh">
      <h2 style="margin-bottom: 30px">
        Function Point Calculator
        <el-popover
            :width="600"
            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
        >
          <template #reference>
            <el-icon size="large">
              <Bell/>
            </el-icon>
          </template>

          <template #default>
            <div style="display: flex; gap: 12px; flex-direction: column">
              <p style="margin: 0; font-weight: 500">Function Point Input Guide</p>

              <ul style="margin: 0; font-size: 13px; color: var(--el-color-info); padding-left: 18px">
                <el-table :data="tableData" style="width: 90%; margin: 0 auto">
                  <el-table-column prop="type" label="Function Type"/>
                  <el-table-column prop="low" label="Low Weight"/>
                  <el-table-column prop="avg" label="Avg Weight"/>
                  <el-table-column prop="high" label="High Weight"/>
                </el-table>
              </ul>
            </div>
          </template>
        </el-popover>
      </h2>

      <el-form :inline="true" label-width="220px" class="fp-form">
        <el-form-item label="External Inputs (EI)">
          <el-input-number v-model="fp.EI[0]" :min="0"/>
          Low
          <el-input-number v-model="fp.EI[1]" :min="0" class="ml-2"/>
          Avg
          <el-input-number v-model="fp.EI[2]" :min="0" class="ml-2"/>
          High
        </el-form-item>

        <el-form-item label="External Outputs (EO)">
          <el-input-number v-model="fp.EO[0]" :min="0"/>
          Low
          <el-input-number v-model="fp.EO[1]" :min="0" class="ml-2"/>
          Avg
          <el-input-number v-model="fp.EO[2]" :min="0" class="ml-2"/>
          High
        </el-form-item>

        <el-form-item label="External Queries (EQ)">
          <el-input-number v-model="fp.EQ[0]" :min="0"/>
          Low
          <el-input-number v-model="fp.EQ[1]" :min="0" class="ml-2"/>
          Avg
          <el-input-number v-model="fp.EQ[2]" :min="0" class="ml-2"/>
          High
        </el-form-item>

        <el-form-item label="Internal Logical Files (ILF)">
          <el-input-number v-model="fp.ILF[0]" :min="0"/>
          Low
          <el-input-number v-model="fp.ILF[1]" :min="0" class="ml-2"/>
          Avg
          <el-input-number v-model="fp.ILF[2]" :min="0" class="ml-2"/>
          High
        </el-form-item>

        <el-form-item label="External Interface Files (EIF)">
          <el-input-number v-model="fp.EIF[0]" :min="0"/>
          Low
          <el-input-number v-model="fp.EIF[1]" :min="0" class="ml-2"/>
          Avg
          <el-input-number v-model="fp.EIF[2]" :min="0" class="ml-2"/>
          High
        </el-form-item>
      </el-form>


      <el-divider>Calculation Breakdown</el-divider>
      <BarChart :data="chartValues" :labels="chartLabels"/>
      <h3>Total Function Points:
        <el-tag type="success">{{ totalFP }}</el-tag>
      </h3>
      <el-divider>Calculate Technical Complexity Factor</el-divider>

      <div style="display: flex; ">
        <div>
          <el-form :inline="false" label-width="250px">
            <el-form-item
                v-for="(item, index) in influenceFactors"
                :key="index"
                :label="item.label"
            >
              <el-rate
                  v-model="item.value"
                  :max="5"
                  :allow-half="false"
                  show-score
                  score-template="{value} / 5"
              />
            </el-form-item>
          </el-form>
        </div>

        <div style="margin-left: 70px">
          <h3>Total Degree of Influence:
            <el-tag type="warning">{{ totalInfluence }}</el-tag>
          </h3>
          <h3>Value Adjustment Factor (VAF):
            <el-tag type="info">{{ VAF.toFixed(2) }}</el-tag>
          </h3>

          <h3>Adjusted Function Points:
            <el-tag type="danger">{{ adjustedFP.toFixed(2) }}</el-tag>
          </h3>
          <el-divider/>
          <el-select
              v-model="FP_lang"
              placeholder="Choose your develop lang"
              style="width: 240px"
          >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <h3>Total KLOC:
            <el-tag type="success">{{ (adjustedFP * FP_lang / 1000).toFixed(2) }}</el-tag>
          </h3>
        </div>
      </div>


    </el-card>
  </div>
</template>

<script>
import BarChart from '@/components/BarChart.vue';
import {Bell} from "@element-plus/icons";

export default {
  name: 'FPCalculate',
  components: {Bell, BarChart},
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
      },
      FP_lang: 'Java',
      options: [
        {
          value: 53,
          label: 'Java',
        },
        {
          value: 21,
          label: 'Python',
        },
        {
          value: 128,
          label: 'C',
        },
        {
          value: 54,
          label: 'JavaScript',
        },
      ],
      influenceFactors: [
        { label: '1. Performance requirements', value: 0 },
        { label: '2. Online data entry', value: 0 },
        { label: '3. Online update', value: 0 },
        { label: '4. Complex processing', value: 0 },
        { label: '5. Installation ease', value: 0 },
      ],
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
    },
    totalInfluence() {
      return this.influenceFactors.reduce((sum, f) => sum + f.value, 0);
    },
    VAF() {
      return 0.65 + 0.01 * this.totalInfluence;
    },
    adjustedFP() {
      return this.totalFP * this.VAF;
    },
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
