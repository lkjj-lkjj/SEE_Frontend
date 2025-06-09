<template>
  <div>
    <el-card>
      <h2 style="margin-bottom: 30px">
        COCOMO Estimator
        <Popover />
      </h2>

      <el-form label-width="220px" class="fp-form">
        <el-form-item label="Project Size (KLOC)">
          <el-input-number v-model="kloc" :min="0" :step="0.1" />
        </el-form-item>

        <el-form-item label="Project Type">
          <el-select v-model="projectType" placeholder="Select type">
            <el-option label="Organic" value="organic" />
            <el-option label="Semi-detached" value="semidetached" />
            <el-option label="Embedded" value="embedded" />
          </el-select>
        </el-form-item>
      </el-form>


      <el-divider>COCOMO Model Parameters</el-divider>
        <CocomoModeTable style="width: 100%; margin: 0 auto" />

      <el-divider>Estimation Result</el-divider>

      <div class="calc-item">
        <p><strong>Effort (PM):</strong> {{ effort.toFixed(2) }} person-months</p>
        <p><strong>Development Time (TDEV):</strong> {{ tdev.toFixed(2) }} months</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import Popover from '@/components/Popover.vue';
import CocomoModeTable from "@/components/CocomoModeTable.vue";

export default {
  name: 'COCOMOEstimator',
  components: {CocomoModeTable, Popover },
  data() {
    return {
      kloc: 0,
      projectType: 'organic',
      modes: {
        organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
        semidetached: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
        embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 }
      }
    };
  },
  computed: {
    effort() {
      const { a, b } = this.modes[this.projectType];
      return a * Math.pow(this.kloc, b);
    },
    tdev() {
      const { c, d } = this.modes[this.projectType];
      return c * Math.pow(this.effort, d);
    }
  }
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
