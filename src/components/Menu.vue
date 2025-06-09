<script>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
export default {
  name: "Menu",
  components: {
    Document, IconMenu, Location, Setting
  },
  methods: {
    go2Item(index){
      this.$router.push("/main/algo" + index)
    },
  }

}
</script>

<template>
  <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      text-color="#fff"
      default-active="1"
      @open="handleOpen"
      @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Cost Estimation Module</span>
      </template>

      <el-menu-item index="1-1" @click="go2Item('1')">Empirical Estimation</el-menu-item>
      <el-menu-item index="1-2" @click="go2Item('2')">Heuristic Estimation</el-menu-item>
      <el-menu-item index="1-3" @click="go2Item('3')">Analytical Mathematical Models</el-menu-item>


    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <span>Navigator Two</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><document /></el-icon>
      <span>Navigator Three</span>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <span>Navigator Four</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>

</style>