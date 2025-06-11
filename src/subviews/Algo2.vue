<template>
  <div style="display: flex">
    <div style="width: 49%; height: 80vh">
      <el-card style="height: 100%; overflow-y: auto">
        <template #header>
          <div class="card-header">
            <span>Investment Parameters</span>
          </div>
        </template>

        <el-form :model="form" label-width="150px" label-position="left">
          <!-- Initial Investment -->
          <el-form-item label="Initial Investment">
            <el-input-number
                v-model="form.initial_investment"
                :min="0"
                :precision="2"
                :step="1000"
                style="width: 100%"
                placeholder="Enter initial investment amount"
            />
          </el-form-item>

          <!-- Discount Rate -->
          <el-form-item label="Discount Rate">
            <el-input-number
                v-model="form.discount_rate"
                :min="0"
                :max="1"
                :precision="4"
                :step="0.01"
                style="width: 100%"
                placeholder="Enter discount rate (e.g., 0.08 for 8%)"
            />
            <div style="font-size: 12px; color: #909399; margin-top: 4px">
              Current rate: {{ (form.discount_rate * 100).toFixed(2) }}%
            </div>
          </el-form-item>

          <!-- Annual Returns Table -->
          <el-form-item label="Annual Returns">
            <div style="width: 100%">
              <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center">
                <span style="font-weight: 500">Year-by-Year Returns</span>
                <el-button
                    type="primary"
                    size="small"
                    icon="Plus"
                    @click="addYear"
                >
                  Add Year
                </el-button>
              </div>

              <el-table
                  :data="form.annual_returns"
                  style="width: 100%"
                  size="small"
                  border
              >
                <el-table-column prop="year" label="Year" width="80" align="center">
                  <template #default="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>

                <el-table-column label="Return Amount" min-width="120">
                  <template #default="scope">
                    <el-input-number
                        v-model="scope.row.return"
                        :min="0"
                        :precision="2"
                        :step="100"
                        size="small"
                        style="width: 100%"
                        placeholder="Enter return amount"
                    />
                  </template>
                </el-table-column>

                <el-table-column label="Action" width="80" align="center">
                  <template #default="scope">
                    <el-button
                        size="small"
                        type="danger"
                        icon="Delete"
                        @click="removeYear(scope.$index)"
                        :disabled="form.annual_returns.length <= 1"
                    />
                  </template>
                </el-table-column>
              </el-table>

              <div style="margin-top: 10px; font-size: 12px; color: #909399">
                Total {{ form.annual_returns.length }} year(s) of returns configured
              </div>
            </div>
          </el-form-item>

          <!-- Summary -->
          <el-form-item label="Summary">
            <el-card style="background-color: #f5f7fa; border: 1px solid #e4e7ed">
              <div style="font-size: 14px">
                <div><strong>Initial Investment:</strong> ${{ form.initial_investment?.toLocaleString() || 0 }}</div>
                <div><strong>Discount Rate:</strong> {{ (form.discount_rate * 100).toFixed(2) }}%</div>
                <div><strong>Total Returns:</strong> ${{ totalReturns.toLocaleString() }}</div>
                <div><strong>Return Period:</strong> {{ form.annual_returns.length }} years</div>
              </div>
            </el-card>
          </el-form-item>
          <el-form-item label="Action">
            <el-button type="primary" @click="submit">Submit</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div style="width: 49%; margin-left: 3vh">
      <el-card style="height: 49%">
        <template #header>
          <div class="card-header">
            <span>Calculations</span>
          </div>
        </template>
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #909399">
          Calculation results will be displayed here
        </div>
      </el-card>

      <el-card style="height: 49%; margin-top: 2%">
        <template #header>
          <div class="card-header">
            <span>Charts & Analysis</span>
          </div>
        </template>
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #909399">
          Charts and analysis will be displayed here
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Algo2",
  data() {
    return {
      form: {
        initial_investment: 10000,
        annual_returns: [
          { return: 3000 },
          { return: 4000 },
          { return: 5000 },
          { return: 6000 }
        ],
        discount_rate: 0.08
      }
    }
  },
  computed: {
    totalReturns() {
      return this.form.annual_returns.reduce((sum, item) => sum + (item.return || 0), 0)
    }
  },
  methods: {
    addYear() {
      this.form.annual_returns.push({ return: 0 })
    },
    removeYear(index) {
      if (this.form.annual_returns.length > 1) {
        this.form.annual_returns.splice(index, 1)
      }
    },
    submit(){
      console.log(this.form)
    }
  },
  mounted() {
    this.setCurrentPath('Budget Track')
  },
  inject: ['currentPath', 'setCurrentPath'],
}
</script>

<style scoped>
.card-header {
  font-weight: 600;
  font-size: 16px;
}

.el-form-item {
  margin-bottom: 20px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>