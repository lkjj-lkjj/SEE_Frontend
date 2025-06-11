<template>
  <div style="display: flex">
    <div style="width: 47%">
      <FPCalculate></FPCalculate>
    </div>

    <div style="width: 47%; margin-left: 7vh">
      <COCOMOEstimator></COCOMOEstimator>
    </div>
  </div>

</template>

<script>
import FPCalculate from "@/components/FPCalculate.vue";
import COCOMOEstimator from "@/components/COCOMOEstimator.vue";

export default {
  name: "Algo1",
  components: {FPCalculate, COCOMOEstimator},
  data(){
    return{
      form: {}
    }
  },
  mounted() {
    this.setCurrentPath('Cost Estimation Module / Empirical Estimation')
  },
  inject: ['currentPath', 'setCurrentPath'],
}
</script>


<style scoped>

</style>