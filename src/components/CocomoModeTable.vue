<template>
  <div style="margin-top: 20px">
      <el-table :data="cocomoParams" style="width: 100%">
        <el-table-column prop="mode" label="Development Mode" />
        <el-table-column prop="a" label="a (Effort)" />
        <el-table-column prop="b" label="b (Effort Exponent)" />
        <el-table-column prop="c" label="c (Time)" />
        <el-table-column prop="d" label="d (Time Exponent)" />
        <el-table-column prop="note" label="Typical Use Case" />
      </el-table>
  </div>
</template>

<script>
export default {
  name: 'CocomoModeTable',
  data() {
    return {
      cocomoParams: [
        {
          mode: 'Organic',
          a: 2.4,
          b: 1.05,
          c: 2.5,
          d: 0.38,
          note: 'Small, simple systems with experienced teams'
        },
        {
          mode: 'Semi-Detached',
          a: 3.0,
          b: 1.12,
          c: 2.5,
          d: 0.35,
          note: 'Intermediate size projects with mixed teams'
        },
        {
          mode: 'Embedded',
          a: 3.6,
          b: 1.20,
          c: 2.5,
          d: 0.32,
          note: 'Complex projects with tight hardware/software constraints'
        }
      ]
    };
  }
};
</script>

<style scoped>
h3 {
  font-weight: 500;
}
</style>
