<script>
import {Bell} from "@element-plus/icons";

export default {
  name: "Popover",
  components: {Bell}
}
</script>

<template>
  <el-popover
      :width="300"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
  >
    <template #reference>
      <el-icon><Bell /></el-icon>
    </template>

    <template #default>
      <div style="display: flex; gap: 12px; flex-direction: column">
        <p style="margin: 0; font-weight: 500">Function Point Input Guide</p>

        <ul style="margin: 0; font-size: 13px; color: var(--el-color-info); padding-left: 18px">
          <li><b>EI</b> (External Input): Count user inputs that update internal data. E.g., forms, uploads.</li>
          <li><b>EO</b> (External Output): Count processed outputs like reports or exports.</li>
          <li><b>EQ</b> (External Query): Count simple data lookups with no data changes.</li>
          <li><b>ILF</b> (Internal Logical File): Count internal files the system maintains, like user tables.</li>
          <li><b>EIF</b> (External Interface File): Count files from other systems the app reads but doesn’t update.</li>
        </ul>
      </div>
    </template>
  </el-popover>
</template>

<style scoped>

</style>