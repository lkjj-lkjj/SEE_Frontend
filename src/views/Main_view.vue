<template>

  <div class="common-layout">
    <el-container style="height: 100vh">
        <el-aside width="300px">
          <div class="title">
            <h1 class="art-title">SCES</h1>
            <h2 class="title_attach">Software Cost Estimation System</h2>
          </div>
          <Menu style="height: 90vh"></Menu>
        </el-aside>
        <el-container>
          <el-header style="height: 7vh">
            <h1 style="margin: 2vh; font-size: 22px">
              {{currentPath}}
            </h1>
          </el-header>
          <el-main style="margin: 1vh 3vh">
            <router-view />
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
    </el-container>
  </div>


</template>

<script>
import Menu from "@/components/Menu.vue";
export default {
  name: "Main_view",
  components: {
    Menu
  },
  mounted() {
    this.currentPath = 'Empirical Estimation'
  },
  data() {
    return {
      currentPath: ''
    }
  },
  provide() {
    return {
      currentPath: this.currentPath,
      setCurrentPath: this.setCurrentPath
    }
  },
  methods: {
    setCurrentPath(newPath) {
      this.currentPath = newPath
    }
  }
}
</script>

<style scoped>
.common-layout {
  height: 100vh;

}
.el-header{
  background-color: rgba(227, 234, 233, 0.75);
}
.title{
  height: 10vh;
  background-color: #545c64;
  border-right: 1px solid #dcdfe6;
  text-align: center;
}

.art-title {
  font-size: 50px;
  font-weight: 800;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
  font-family: "Segoe UI", "Helvetica Neue", sans-serif;
  letter-spacing: 2px;
  padding-top: 0.5vh;
}
.title_attach{
  font-size: 15px;
  color: white;
}
</style>