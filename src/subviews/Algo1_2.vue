<template>
  <div style="width: 100%; height: 40vh">
    <el-card style="height: 100%">
      <template #header>
        <div class="card-header">
          <span>Project Evaluation Parameters</span>
        </div>
      </template>

      <el-form
          :model="formData"
          label-width="200px"
          style="height: calc(100% - 60px);"
          :rules="rules"
          ref="paramForm"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Function Points" prop="function_points">
              <el-input-number
                  v-model="formData.function_points"
                  :min="1"
                  :step="1"
                  style="width: 100%"
                  placeholder="Enter number of function points"
              />
            </el-form-item>

            <el-form-item label="Number of Modules" prop="modules_count">
              <el-input-number
                  v-model="formData.modules_count"
                  :min="1"
                  :step="1"
                  style="width: 100%"
                  placeholder="Enter number of modules"
              />
            </el-form-item>

            <el-form-item label="Number of Interfaces" prop="interfaces_count">
              <el-input-number
                  v-model="formData.interfaces_count"
                  :min="1"
                  :step="1"
                  style="width: 100%"
                  placeholder="Enter number of interfaces"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Technical Difficulty" prop="technical_difficulty">
              <el-rate
                  v-model="formData.technical_difficulty"
                  :max="5"
                  show-score
                  text-color="#ff9900"
                  score-template="{value} points"
              />
              <div style="font-size: 12px; color: #909399; margin-left: 20px;">
                1 - Lowest difficulty | 5 - Highest difficulty
              </div>
            </el-form-item>

            <el-form-item label="Team Experience" prop="team_experience">
              <el-rate
                  v-model="formData.team_experience"
                  :max="5"
                  show-score
                  text-color="#67c23a"
                  score-template="{value} points"
              />
              <div style="font-size: 12px; color: #909399; margin-left: 20px;">
                1 - Least experienced | 5 - Most experienced
              </div>
            </el-form-item>

            <el-form-item label="Expected Delivery Time" prop="expected_delivery_time">
              <el-input-number
                  v-model="formData.expected_delivery_time"
                  :min="0.5"
                  :step="0.5"
                  :precision="1"
                  style="width: 70%"
                  placeholder="Enter duration in months"
              />
              <span style="margin-left: 10px; color: #909399;">months</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item style="margin-top: 20px;">
          <el-button type="primary" @click="calculateEstimate">Calculate Estimate</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

  <div style="display: flex; height: 40vh; margin-top: 3vh">
    <el-card style="width: 49%; height: 100%">
      <template #header>
        <div class="card-header">
          <span>Heuristic Estimation</span>
        </div>
      </template>

      <div style="width: 80%; margin: 0 auto">
        <div class="analysis-item">
          <span class="label">Delphi Estimate:</span>
          <span class="value">{{ Number(Delphi_data).toLocaleString() }}</span>
        </div>
        <div class="analysis-item">
          <span class="label">Expert Estimate:</span>
          <span class="value">{{ Number(Expert_data).toLocaleString() }}</span>
        </div>
      </div>


    </el-card>

    <el-card style="width: 49%; height: 100%; margin-left: 2%">
      <template #header>
        <div class="card-header">
          <span>Analytical Mathematical Models</span>
        </div>
      </template>

      <div v-if="Regression_data" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(500px, 1fr)); gap: 12px;">
        <div style="width: 80%; margin: 0 auto">
          <div class="analysis-item" v-for="(value, key) in Regression_data" :key="key">
            <span class="label">{{ key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }}:</span>
            <span class="value">{{ Number(value).toLocaleString() }}</span>
          </div>
        </div>
      </div>
      <div v-else style="color: #999;">No regression result yet. Click "Calculate Estimate".</div>

    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request.js";

export default {
  name: "Algo1_2",
  data() {
    return {
      formData: {
        function_points: 100,
        modules_count: 20,
        interfaces_count: 50,
        technical_difficulty: 3,
        team_experience: 3,
        expected_delivery_time: 6
      },
      rules: {
        function_points: [
          {required: true, message: 'Please input', trigger: 'blur'}
        ],
        modules_count: [
          {required: true, message: 'Please input', trigger: 'blur'}
        ],
        interfaces_count: [
          {required: true, message: 'Please input', trigger: 'blur'}
        ],
        expected_delivery_time: [
          {required: true, message: 'Please input', trigger: 'blur'}
        ]
      },
      estimationResult: null,
      paramAnalysis: null,
      Delphi_data: '',
      Expert_data: '',
      Regression_data: ''
    }
  },
  mounted() {
    this.setCurrentPath('Cost Estimation Module / Advanced consumption analysis')
  },
  inject: ['currentPath', 'setCurrentPath'],

  methods: {
    calculateEstimate() {
      request.post('/cost/Delphi/', this.formData).then(res=>{
        console.log(res.msg)
        this.Delphi_data = res.msg
      })
      request.post('/cost/Expert/', this.formData).then(res=>{
        console.log(res.msg)
        this.Expert_data = res.msg
      })
      request.post('/cost/Regression/', this.formData).then(res=>{
        console.log(res.msg)
        this.Regression_data = res
      })
    },
    resetFormData() {
      for (const key in this.formData) {
        if (Object.prototype.hasOwnProperty.call(this.formData, key)) {
          this.formData[key] = null;
        }
      }
    },

    resetForm() {
      // this.$refs.paramForm.resetFields();
      this.resetFormData()
      this.estimationResult = null;
      this.paramAnalysis = null;
      this.$message.info('Form reset');
    },
  }
}
</script>

<style scoped>
.card-header {
  font-weight: bold;
  font-size: 16px;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.analysis-item .label {
  color: #666;
  font-weight: 500;
}

.analysis-item .value {
  color: #409eff;
  font-weight: bold;
}

</style>