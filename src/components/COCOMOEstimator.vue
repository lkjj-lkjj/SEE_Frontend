<template>
  <div>
    <el-card style="height: 82vh">
      <h2 style="margin-bottom: 30px">COCOMO Estimator</h2>

      <el-form label-width="220px" class="fp-form">
        <!-- 项目规模 -->
        <el-form-item label="Project Size (KLOC)">
          <el-input-number v-model="kloc" :min="0" :step="0.1" />
        </el-form-item>

        <!-- 项目类型 -->
        <el-form-item>
          <template #label>
            <span style="margin-right: 6px">Project Type</span>
            <el-popover
                :width="1000"
                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
            >
              <template #reference>
                <el-icon style="cursor: pointer">
                  <Bell />
                </el-icon>
              </template>
              <template #default>
                <div style="display: flex; gap: 12px; flex-direction: column">
                  <p style="margin: 0; font-weight: 500">Project Type Guide</p>
                  <ul style="margin: 0; font-size: 13px; color: var(--el-color-info); padding-left: 18px">
                    <CocomoModeTable style="width: 100%; margin: 0 auto" />
                  </ul>
                </div>
              </template>
            </el-popover>
          </template>
          <el-select v-model="projectType" placeholder="Select type">
            <el-option label="Organic" value="organic" />
            <el-option label="Semi-detached" value="semidetached" />
            <el-option label="Embedded" value="embedded" />
          </el-select>
        </el-form-item>

        <!-- 成本驱动因子 -->
        <el-divider>Cost Drivers</el-divider>
        <div style="width: 60%">
          <el-form-item v-for="(levels, driver) in costDrivers" :key="driver" :label="driver.toUpperCase()">
            <el-select v-model="selectedDrivers[driver]">
              <el-option v-for="(value, level) in levels" :key="level" :label="`${level} (${value})`" :value="level" />
            </el-select>
          </el-form-item>
        </div>
        <!-- 工资 -->
        <el-form-item label="Monthly Salary (¥)">
          <el-input-number v-model="salary" :min="0" />
        </el-form-item>
      </el-form>

      <el-divider>Estimation Result</el-divider>

      <div class="calc-item">
        <p><strong>Basic Effort (E):</strong> {{ effort.toFixed(2) }} person-months</p>
        <p><strong>EAF (Effort Adjustment Factor):</strong> {{ eaf.toFixed(2) }}</p>
        <p><strong>Adjusted Effort:</strong> {{ adjustedEffort.toFixed(2) }} person-months</p>
        <p><strong>Time (T):</strong> {{ time.toFixed(2) }} months</p>
        <p><strong>People (P):</strong> {{ people.toFixed(2) }}</p>
        <p><strong>Total Cost:</strong> ¥{{ totalCost.toFixed(2) }}</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import CocomoModeTable from "@/components/CocomoModeTable.vue";
import { Bell } from "@element-plus/icons";

export default {
  name: "COCOMOEstimator",
  components: { Bell, CocomoModeTable },
  data() {
    return {
      kloc: 0,
      projectType: "organic",
      salary: 10000,
      selectedDrivers: {
        RELY: "Nominal",
        CPLX: "Nominal",
        ACAP: "Nominal",
        PCAP: "Nominal",
        AEXP: "Nominal",
        TOOL: "Nominal",
      },
      costDrivers: {
        RELY: { "Very Low": 0.75, Low: 0.88, Nominal: 1.00, High: 1.15, "Very High": 1.40 },
        CPLX: { "Very Low": 0.70, Low: 0.85, Nominal: 1.00, High: 1.15, "Very High": 1.30 },
        ACAP: { "Very Low": 1.46, Low: 1.19, Nominal: 1.00, High: 0.86, "Very High": 0.71 },
        PCAP: { "Very Low": 1.42, Low: 1.17, Nominal: 1.00, High: 0.86, "Very High": 0.70 },
        AEXP: { "Very Low": 1.29, Low: 1.13, Nominal: 1.00, High: 0.91, "Very High": 0.82 },
        TOOL: { "Very Low": 1.24, Low: 1.10, Nominal: 1.00, High: 0.91, "Very High": 0.82 },
      },
      modes: {
        organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
        semidetached: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
        embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 },
      },
    };
  },
  computed: {
    effort() {
      const { a, b } = this.modes[this.projectType];
      return a * Math.pow(this.kloc, b);
    },
    eaf() {
      return Object.entries(this.selectedDrivers).reduce((product, [driver, level]) => {
        return product * this.costDrivers[driver][level];
      }, 1);
    },
    adjustedEffort() {
      return this.effort * this.eaf;
    },
    time() {
      const { c, d } = this.modes[this.projectType];
      return c * Math.pow(this.adjustedEffort, d);
    },
    people() {
      return this.adjustedEffort / this.time;
    },
    totalCost() {
      return this.adjustedEffort * this.salary;
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
.calc-item {
  font-size: 16px;
  margin-top: 20px;
}
</style>
