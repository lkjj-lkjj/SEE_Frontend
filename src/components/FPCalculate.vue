<template>
  <div class="fp-container">
    <div class="header">
      <h2>Function Point Calculator</h2>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧：功能点输入 + 柱状图 -->
      <div class="input-section">
        <div class="section-card">
          <div class="section-header">
            <h3>Function Point Inputs</h3>
            <el-popover
                :width="500"
                popper-style="border-radius: 8px; padding: 20px;"
            >
              <template #reference>
                <el-button size="small" circle>
                  <el-icon><QuestionFilled /></el-icon>
                </el-button>
              </template>
              <template #default>
                <div class="help-content">
                  <h4>Weight Reference</h4>
                  <el-table :data="tableData" size="small">
                    <el-table-column prop="type" label="Type" width="80"/>
                    <el-table-column prop="low" label="Low" width="60" align="center"/>
                    <el-table-column prop="avg" label="Avg" width="60" align="center"/>
                    <el-table-column prop="high" label="High" width="60" align="center"/>
                  </el-table>
                </div>
              </template>
            </el-popover>
          </div>

          <div class="input-groups">
            <div v-for="(key, index) in Object.keys(fp)" :key="key" class="input-row">
              <div class="input-label">{{ getDisplayName(key) }}</div>
              <div class="input-controls">
                <div class="control-item">
                  <span class="control-label">Low</span>
                  <el-input-number v-model="fp[key][0]" :min="0" size="small" />
                </div>
                <div class="control-item">
                  <span class="control-label">Avg</span>
                  <el-input-number v-model="fp[key][1]" :min="0" size="small" />
                </div>
                <div class="control-item">
                  <span class="control-label">High</span>
                  <el-input-number v-model="fp[key][2]" :min="0" size="small" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 图表 -->
        <div class="section-card">
          <div class="section-header">
            <h3>Function Points Breakdown</h3>
          </div>
          <BarChart :head_title="'FP Distribution'" :data="chartValues" :labels="chartLabels"/>
        </div>
      </div>

      <!-- 右侧：技术复杂度 + 结果展示 -->
      <div class="results-section">
        <!-- 技术复杂度 -->
        <div class="section-card">
          <div class="section-header">
            <h3>Technical Complexity Factors</h3>
          </div>
          <div class="tcf-list">
            <div v-for="(item, index) in influenceFactors" :key="index" class="tcf-item">
              <span class="tcf-label">{{ item.label }}</span>
              <el-rate
                  v-model="item.value"
                  :max="5"
                  show-score
                  score-template="{value}"
              />
            </div>
          </div>
        </div>

        <!-- 计算结果 -->
        <div class="section-card">
          <div class="section-header">
            <h3>Results</h3>
          </div>

          <div class="results-grid">
            <div class="result-box">
              <div class="result-label">Function Points</div>
              <div class="result-value primary">{{ totalFP }}</div>
            </div>
            <div class="result-box">
              <div class="result-label">Influence Total</div>
              <div class="result-value warning">{{ totalInfluence }}</div>
            </div>
            <div class="result-box">
              <div class="result-label">VAF</div>
              <div class="result-value info">{{ VAF.toFixed(2) }}</div>
            </div>
            <div class="result-box">
              <div class="result-label">Adjusted FP</div>
              <div class="result-value success">{{ adjustedFP.toFixed(2) }}</div>
            </div>
          </div>

          <div class="language-section">
            <div class="lang-row">
              <label>Programming Language:</label>
              <el-select v-model="FP_lang" style="width: 200px">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </div>
            <div class="kloc-display">
              <span class="kloc-label">Estimated KLOC:</span>
              <span class="kloc-value">{{ (adjustedFP * FP_lang / 1000).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/BarChart.vue';
import { QuestionFilled } from "@element-plus/icons";

export default {
  name: 'FPCalculate',
  components: { BarChart, QuestionFilled },
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
      FP_lang: 53,
      options: [
        { value: 53, label: 'Java' },
        { value: 21, label: 'Python' },
        { value: 128, label: 'C' },
        { value: 54, label: 'JavaScript' },
        { value: 55, label: 'C#' },
        { value: 49, label: 'PHP' },
      ],
      influenceFactors: [
        { label: 'Performance requirements', value: 0 },
        { label: 'Online data entry', value: 0 },
        { label: 'Online update', value: 0 },
        { label: 'Complex processing', value: 0 },
        { label: 'Installation ease', value: 0 },
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
      return Object.keys(this.fp).map(key => this.getDisplayName(key));
    },
    chartValues() {
      return Object.keys(this.fp).map(key =>
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
  methods: {
    getDisplayName(key) {
      const names = {
        EI: 'External Inputs',
        EO: 'External Outputs',
        EQ: 'External Queries',
        ILF: 'Internal Logical Files',
        EIF: 'External Interface Files'
      };
      return names[key] || key;
    }
  }
};
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 30px;
}
.fp-container {
  height: 87vh;
  background-color: #f8fafc;
  padding: 16px;
  overflow-y: auto;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  height: 90%;
}

.input-section,
.results-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.section-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h3 {
  margin: 0;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
}

.input-groups {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-row {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.input-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.input-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

.tcf-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tcf-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
}

.tcf-label {
  color: #374151;
  font-size: 0.85rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.result-box {
  text-align: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.result-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 6px;
}

.result-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.result-value.primary { color: #3b82f6; }
.result-value.warning { color: #f59e0b; }
.result-value.info { color: #06b6d4; }
.result-value.success { color: #10b981; }

.language-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.lang-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.lang-row label {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.kloc-display {
  text-align: center;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  border: 1px solid #0ea5e9;
}

.kloc-label {
  color: #0369a1;
  font-weight: 500;
  margin-right: 8px;
  font-size: 0.9rem;
}

.kloc-value {
  color: #0369a1;
  font-size: 1.1rem;
  font-weight: 700;
}

.help-content h4 {
  margin: 0 0 12px 0;
  color: #374151;
}

/* 响应式 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
    height: auto;
  }

  .fp-container {
    height: auto;
    min-height: 89vh;
  }
}

@media (max-width: 768px) {
  .fp-container {
    padding: 12px;
  }

  .section-card {
    padding: 12px;
  }

  .input-controls {
    grid-template-columns: 1fr;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .lang-row {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
}
</style>