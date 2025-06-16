<template>
  <div style="display: flex; height: 85vh">
    <div style="width: 20%; height: 100%">
      <el-card class="revenue-card" shadow="always" style="height: 100%">
        <template #header>
          <span>Risk Management Input</span>
        </template>

        <!-- 输入部分 -->
        <el-form label-position="top" class="input-form">
          <el-form-item label="User Revenue">
            <el-input-number v-model="user_revenue" :min="0" />
          </el-form-item>
          <el-form-item label="User Cost">
            <el-input-number v-model="user_cost" :min="0" />
          </el-form-item>
        </el-form>

        <div style="height: 20%">
        </div>
        <el-button type="primary" @click="submit">Submit</el-button>
      </el-card>

    </div>

    <div style="height: 100%; width: 80%; display: flex; flex-direction: column;">
      <el-card style="flex: 6; display: flex; flex-direction: column;">
        <div class="image-container" style="flex: 1;">
          <img
              v-if="pic1_url !== ''"
              :src="pic1_url"
              alt="Result Image"
              class="result-image"
          />
        </div>
      </el-card>
      <el-card
          style="display: flex; margin-top: 1%; height: 39%; width: 100%; overflow-y: auto"
      >
        <!-- ✅ 添加一个横向排列的容器 -->
        <div style="display: flex; width: 100%; justify-content: space-between;">
          <div v-if="pic2_url !== ''" style="width: 49%;">
            <img :src="pic2_url" alt="Result Image" class="result-image" />
          </div>
          <div v-if="pic3_url !== ''" style="width: 49%;">
            <img :src="pic3_url" alt="Result Image" class="result-image" />
          </div>
        </div>
      </el-card>
    </div>

  </div>

</template>

<script>
import request from "@/utils/request.js";
import { ElLoading } from 'element-plus'

export default {
  name: "Algo3",
  inject: ["currentPath", "setCurrentPath"],
  mounted() {
    this.setCurrentPath("Risk Management Module");
  },
  data() {
    return {
      user_revenue: 1000,
      user_cost: 500,
      pic1_url: '',
      pic2_url: '',
      pic3_url: '',
    }
  },

  methods:{
    submit() {
      const data = {
        'user_revenue': this.user_revenue,
        'user_cost': this.user_cost
      }

      // 开启 loading 效果（整张卡片上）
      const loading = ElLoading.service({
        target: this.$el,   // 只覆盖当前组件区域
        lock: true,
        text: 'Submitting...',
        background: 'rgba(255, 255, 255, 0.7)'
      })

      request.post('/risk/pic/', data).then(res=>{
        loading.close()

        this.pic1_url = 'http://localhost:8000/' + res.msg[0]
        this.pic2_url = 'http://localhost:8000/' + res.msg[1]
        this.pic3_url = 'http://localhost:8000/' + res.msg[2]
      })
    }
  }
}
</script>

<style scoped>
.revenue-card {
  width: 350px;
  padding: 10px;
  font-size: 16px;
  line-height: 1.8;
}
.input-form {
  margin-bottom: 20px;
}
.image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex; /* 添加flex布局 */
}

.result-image {
  max-width: 100%;     /* 控制宽度显示为容器的 80% */
  max-height: 80%;    /* 同时限制高度（防止太高） */
  display: block;
  margin: 0 auto;     /* 居中 */
  object-fit: contain;
}
</style>