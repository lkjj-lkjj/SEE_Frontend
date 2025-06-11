<template>
  <div class="container">
    <div class="header">
      <h2>COCOMO Estimator</h2>
    </div>

    <div class="main-content">
      <!-- 输入区域 -->
      <div class="input-section">
        <div class="card">
          <h3>Project Parameters</h3>

          <div class="form-group">
            <label>Project Size (KLOC)</label>
            <el-input-number v-model="kloc" :min="0" :step="0.1" style="width: 200px" />
          </div>

          <div class="form-group">
            <label>
              Project Type
              <el-popover :width="1000" trigger="hover">
                <template #reference>
                  <el-icon style="margin-left: 8px; cursor: help">
                    <Bell />
                  </el-icon>
                </template>
                <template #default>
                  <CocomoModeTable />
                </template>
              </el-popover>
            </label>
            <el-select v-model="projectType" style="width: 200px">
              <el-option label="Organic" value="organic" />
              <el-option label="Semi-detached" value="semidetached" />
              <el-option label="Embedded" value="embedded" />
            </el-select>
          </div>

          <div class="form-group">
            <label>Monthly Salary ($)</label>
            <el-input-number v-model="salary" :min="0" style="width: 200px" />
          </div>
        </div>

        <div class="card">
          <h3>Cost Drivers</h3>
          <div class="drivers-container">
            <div
                v-for="(levels, driver) in costDrivers"
                :key="driver"
                class="driver-item"
            >
              <label>{{ driver }}</label>
              <el-select v-model="selectedDrivers[driver]" style="width: 200px">
                <el-option
                    v-for="(value, level) in levels"
                    :key="level"
                    :label="`${level} (${value})`"
                    :value="level"
                />
              </el-select>
            </div>
          </div>
        </div>
      </div>

      <!-- 结果区域 -->
      <div class="result-section">
        <div class="card">
          <h3>Results</h3>

          <div class="result-grid">
            <div class="result-item">
              <div class="result-label">Adjusted Effort</div>
              <div class="result-value">{{ adjustedEffort.toFixed(2) }} PM</div>
            </div>

            <div class="result-item">
              <div class="result-label">Development Time</div>
              <div class="result-value">{{ time.toFixed(2) }} months</div>
            </div>

            <div class="result-item">
              <div class="result-label">Team Size</div>
              <div class="result-value">{{ people.toFixed(2) }} people</div>
            </div>

            <div class="result-item total-cost">
              <div class="result-label">Total Cost</div>
              <div class="result-value">${{ totalCost.toLocaleString() }}</div>
            </div>
          </div>

          <div class="details">
            <div class="detail-item">
              <span>Basic Effort (E):</span>
              <span>{{ effort.toFixed(2) }} PM</span>
            </div>
            <div class="detail-item">
              <span>EAF Factor:</span>
              <span>{{ eaf.toFixed(3) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      kloc: 10,
      projectType: "organic",
      salary: 15000,
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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8fafc;
  min-height: 87vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  margin: 0;
  color: #333;
  font-weight: 500;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.card h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #666;
  display: flex;
  align-items: center;
}

.drivers-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.driver-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.driver-item label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.result-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.result-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.result-item.total-cost {
  background: #e8f5e8;
  grid-column: 1 / -1;
}

.result-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.result-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.total-cost .result-value {
  color: #2d5016;
}

.details {
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.detail-item span:first-child {
  color: #666;
}

.detail-item span:last-child {
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .drivers-container {
    grid-template-columns: 1fr;
  }

  .result-grid {
    grid-template-columns: 1fr;
  }
}
</style>