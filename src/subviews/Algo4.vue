<template>
  <div>
    <div style="display: flex; width: 100%; height: 32vh">
      <div>
        <el-table :data="tableData" style="width: 100%" max-height="400">
          <el-table-column prop="id" label="Task ID" width="150" />

          <el-table-column label="Duration (Days)" width="200">
            <template #default="scope">
              <el-input-number
                  v-model="scope.row.duration"
                  :min="0"
                  style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column label="Resource Demand" width="200">
            <template #default="scope">
              <el-input-number
                  v-model="scope.row.demand"
                  :min="0"
                  style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column label="Earliest Start (ES)" width="250">
            <template #default="scope">
              <el-date-picker
                  v-model="scope.row.es"
                  type="date"
                  style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column label="Latest Start (LS)" width="250">
            <template #default="scope">
              <el-date-picker
                  v-model="scope.row.ls"
                  type="date"
                  style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="Operations" min-width="150">
            <template #default="scope">
              <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index)"
              >
                Remove
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" class="mt-4" style="width: 100%" @click="onAddItem">
          Add Task
        </el-button>
      </div>
      <el-card style="margin-left:30px;height: 70%; width: 50%;" shadow="hover">

        <BarChart style="height: 270px; width: 80%" :head_title="'Resource Demand'" :data="chartData" :labels="chartLabels"/>

      </el-card>
    </div>


    <div style="margin: 10px auto; width: 100%; text-align: right">
      <el-button @click="refresh()" type="default">Refresh</el-button>
      <el-button @click="test()" type="primary">Optimize</el-button>
    </div>


    <el-divider></el-divider>

    <!-- 甘特图区域 -->
    <div style="display: flex;">
      <el-card style="height: 43vh; width: 49%; padding: 0;" shadow="hover">
        <div class="gantt-container" v-if="ganttData.tasks.length > 0">
          <!-- 甘特图标题 -->
          <div class="gantt-header">
            <h3>Original Tasks</h3>
            <div class="gantt-legend">
        <span class="legend-item">
          <span class="legend-color es-bar"></span>
          Earliest Start Schedule
        </span>
              <span class="legend-item">
          <span class="legend-color ls-bar"></span>
          Latest Start Schedule
        </span>
            </div>
          </div>

          <!-- ✅ 整体横向滚动区域：包括时间轴和任务条 -->
          <div class="gantt-scroll-wrapper">
            <div class="gantt-scroll-area" :style="{ width: timelineWidth + 150 + 'px' }">
              <!-- 时间轴 header -->
              <div class="timeline-header">
                <div class="task-names-header">Tasks</div>
                <div class="timeline-dates">
                  <div
                      v-for="week in ganttData.timelineWeeks"
                      :key="week.weekStart"
                      class="timeline-week"
                      :style="{ width: weekWidth + 'px' }"
                  >
                    {{ formatWeek(week.weekStart) }}
                  </div>
                </div>
              </div>

              <!-- 甘特图主体 -->
              <div class="gantt-body">
                <div
                    v-for="(task, index) in ganttData.tasks"
                    :key="task.id"
                    class="gantt-row"
                >
                  <!-- 任务名称 -->
                  <div class="task-name">
                    Task {{ task.id }}
                    <small>{{ task.duration }}day(s)</small>
                  </div>

                  <!-- ✅ 取消单独横向滚动，让它跟随外层滚 -->
                  <div class="task-timeline">
                    <div
                        class="task-bar es-bar"
                        :style="{
              left: task.esOffset + 'px',
              width: task.barWidth + 'px'
            }"
                        :title="`ES: ${formatDate(task.esDate)} - ${formatDate(task.esEndDate)}`"
                    >
                      <span class="task-bar-text">ES</span>
                    </div>
                    <div
                        class="task-bar ls-bar"
                        :style="{
              left: task.lsOffset + 'px',
              width: task.barWidth + 'px'
            }"
                        :title="`LS: ${formatDate(task.lsDate)} - ${formatDate(task.lsEndDate)}`"
                    >
                      <span class="task-bar-text">LS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <p>No tasks to display. Add some tasks to see the Gantt chart.</p>
        </div>
      </el-card>

      <el-card style="height: 43vh; width: 49%; padding: 0; margin-left: 2%" shadow="hover">
        <div class="gantt-container" v-if="ganttResultData.tasks.length > 0">
          <!-- 甘特图标题 -->
          <div class="gantt-header">
            <h3>Result</h3>
            <div class="gantt-legend">
        <span class="legend-item">
          <span class="legend-color es-bar"></span>
          Earliest Start Schedule
        </span>
              <span class="legend-item">
          <span class="legend-color ls-bar"></span>
          Latest Start Schedule
        </span>
            </div>
          </div>

          <!-- ✅ 整体横向滚动区域：包括时间轴和任务条 -->
          <div class="gantt-scroll-wrapper">
            <div class="gantt-scroll-area" :style="{ width: resultTimelineWidth + 150 + 'px' }">
              <!-- 时间轴 header -->
              <div class="timeline-header">
                <div class="task-names-header">Tasks</div>
                <div class="timeline-dates">
                  <div
                      v-for="week in ganttResultData.timelineWeeks"
                      :key="week.weekStart"
                      class="timeline-week"
                      :style="{ width: weekWidth + 'px' }"
                  >
                    {{ formatWeek(week.weekStart) }}
                  </div>
                </div>
              </div>

              <!-- 甘特图主体 -->
              <div class="gantt-body">
                <div
                    v-for="(task, index) in ganttResultData.tasks"
                    :key="task.id"
                    class="gantt-row"
                >
                  <!-- 任务名称 -->
                  <div class="task-name">
                    Task {{ task.id }}
                    <small>{{ task.duration }}day(s)</small>
                  </div>

                  <!-- ✅ 取消单独横向滚动，让它跟随外层滚 -->
                  <div class="task-timeline">
                    <div
                        class="task-bar result-es-bar"
                        :style="{
              left: task.esOffset + 'px',
              width: task.barWidth + 'px'
            }"
                        :title="`ES: ${formatDate(task.esDate)} - ${formatDate(task.esEndDate)}`"
                    >
                      <span class="task-bar-text">ES</span>
                    </div>
<!--                    <div-->
<!--                        class="task-bar ls-bar"-->
<!--                        :style="{-->
<!--              left: task.lsOffset + 'px',-->
<!--              width: task.barWidth + 'px'-->
<!--            }"-->
<!--                        :title="`LS: ${formatDate(task.lsDate)} - ${formatDate(task.lsEndDate)}`"-->
<!--                    >-->
<!--                      <span class="task-bar-text">LS</span>-->
<!--                    </div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <p>No tasks to display. Add some tasks to see the Gantt chart.</p>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import dayjs from "dayjs";
import BarChart from "@/components/BarChart.vue";
import request from "@/utils/request.js";

export default {
  name: "Algo4",
  components: {BarChart},
  inject: ["currentPath", "setCurrentPath"],
  data() {
    return {
      now: new Date(),
      idCounter: 1,
      tableData: [],
      resultData: [],
      weekWidth: 80, // 每周的像素宽度
    };
  },
  mounted() {
    this.setCurrentPath("Resource Allocation & Optimization");
    this.onAddItem(); // 便于初始测试
    this.onAddItem(); // 添加第二个任务用于演示

    // 为演示设置一些初始数据
    this.$nextTick(() => {
      if (this.tableData.length >= 2) {
        this.tableData[0].duration = 3;
        this.tableData[0].demand = 5;
        this.tableData[1].duration = 2;
        this.tableData[1].demand = 3;
        this.tableData[1].es = dayjs(this.now).add(1, 'day').format("YYYY-MM-DD");
        this.tableData[1].ls = dayjs(this.now).add(2, 'day').format("YYYY-MM-DD");
      }
    });
  },
  computed: {
    chartData() {
      return this.tableData.map(item => item.duration);
    },
    chartLabels() {
      return this.tableData.map(item => item.id);
    },
    ganttData() {
      if (this.tableData.length === 0) {
        return { tasks: [], timelineWeeks: [], startDate: null, endDate: null };
      }

      const tasks = this.tableData.map(item => {
        const esDate = dayjs(item.es);
        const lsDate = dayjs(item.ls);
        const duration = item.duration || 0;

        return {
          id: item.id,
          duration: duration,
          demand: item.demand,
          esDate: esDate.toDate(),
          esEndDate: esDate.add(duration, 'day').toDate(),
          lsDate: lsDate.toDate(),
          lsEndDate: lsDate.add(duration, 'day').toDate(),
        };
      });

      // 计算总的时间范围
      const allDates = tasks.reduce((dates, task) => {
        dates.push(task.esDate, task.esEndDate, task.lsDate, task.lsEndDate);
        return dates;
      }, []);

      if (allDates.length === 0) {
        return { tasks: [], timelineWeeks: [], startDate: null, endDate: null };
      }

      const startDate = dayjs(Math.min(...allDates)).startOf('day');
      const endDate = dayjs(Math.max(...allDates)).endOf('day');

      // 生成时间轴周数
      const timelineWeeks = [];
      let current = startDate;
      while (current.isBefore(endDate) || current.isSame(endDate)) {
        timelineWeeks.push({
          weekStart: current.toDate(),
        });
        current = current.add(1, 'day');
      }

      // 计算每个任务的位置和宽度
      const tasksWithPosition = tasks.map(task => {
        const esWeeksDiff = dayjs(task.esDate).diff(startDate, 'day', true);
        const lsWeeksDiff = dayjs(task.lsDate).diff(startDate, 'day', true);

        return {
          ...task,
          esOffset: Math.round(esWeeksDiff * this.weekWidth),
          lsOffset: Math.round(lsWeeksDiff * this.weekWidth),
          barWidth: Math.round(task.duration * this.weekWidth),
        };
      });
      return {
        tasks: tasksWithPosition,
        timelineWeeks,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      };

    },
    timelineWidth() {
      return this.ganttData.timelineWeeks.length * this.weekWidth;
    },
    resultTimelineWidth(){
      return this.ganttResultData.timelineWeeks.length * this.weekWidth;
    },
    ganttResultData() {
      const tableData = this.resultData || [];

      if (tableData.length === 0) {
        return { tasks: [], timelineWeeks: [], startDate: null, endDate: null };
      }

      const tasks = tableData.map(item => {
        const esDate = dayjs(item.es);
        const lsDate = dayjs(item.ls);
        const duration = item.duration || 0;

        return {
          id: item.id,
          duration: duration,
          demand: item.demand,
          esDate: esDate.toDate(),
          esEndDate: esDate.add(duration, 'day').toDate(),
          lsDate: lsDate.toDate(),
          lsEndDate: lsDate.add(duration, 'day').toDate(),
        };
      });

      // 计算总的时间范围
      const allDates = tasks.reduce((dates, task) => {
        dates.push(task.esDate, task.esEndDate, task.lsDate, task.lsEndDate);
        return dates;
      }, []);

      if (allDates.length === 0) {
        return { tasks: [], timelineWeeks: [], startDate: null, endDate: null };
      }

      const startDate = dayjs(Math.min(...allDates)).startOf('day');
      const endDate = dayjs(Math.max(...allDates)).endOf('day');

      // 生成时间轴周数
      const timelineWeeks = [];
      let current = startDate;
      while (current.isBefore(endDate) || current.isSame(endDate)) {
        timelineWeeks.push({
          weekStart: current.toDate(),
        });
        current = current.add(1, 'day');
      }

      // 计算每个任务的位置和宽度
      const tasksWithPosition = tasks.map(task => {
        const esWeeksDiff = dayjs(task.esDate).diff(startDate, 'day', true);
        const lsWeeksDiff = dayjs(task.lsDate).diff(startDate, 'day', true);

        return {
          ...task,
          esOffset: Math.round(esWeeksDiff * this.weekWidth),
          lsOffset: Math.round(lsWeeksDiff * this.weekWidth),
          barWidth: Math.round(task.duration * this.weekWidth),
        };
      });
      return {
        tasks: tasksWithPosition,
        timelineWeeks,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      };
    },
  },
  methods: {
    deleteRow(index) {
      this.tableData.splice(index, 1);
    },
    onAddItem() {
      const dateStr = dayjs(this.now).format("YYYY-MM-DD");
      this.tableData.push({
        id: this.idCounter++,
        duration: 1,
        demand: 1,
        es: dateStr,
        ls: dateStr,
      });
    },
    test() {
      // 优化算法的实现
      const clonedTableData = this.tableData.map(item => {
        const clonedItem = JSON.parse(JSON.stringify(item));

        // 判断是否是 Date 对象（即为完整时间格式），才格式化为 YYYY-MM-DD
        if (item.es instanceof Date) {
          clonedItem.es = dayjs(item.es).format('YYYY-MM-DD');
        }

        if (item.ls instanceof Date) {
          clonedItem.ls = dayjs(item.ls).format('YYYY-MM-DD');
        }

        return clonedItem;
      });
      request.post('/optimize/smooth/', clonedTableData).then(res=>{
        if(res.code === 200){
          this.resultData = res.msg
        }
      })

      console.log(clonedTableData);
    },
    formatWeek(date) {
      return dayjs(date).format('MM/DD');
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD');
    },
    refresh(){
      this.tableData = []
      this.resultData = []
    }
  },
};
</script>

<style scoped>
.mt-4 {
  margin-top: 16px;
}

.gantt-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.gantt-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.gantt-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.gantt-legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.gantt-timeline {
  border-bottom: 2px solid #dcdfe6;
  background: white;
}

.timeline-header {
  display: flex;
}

.task-names-header {
  width: 150px;
  padding: 12px 16px;
  font-weight: 600;
  color: #303133;
  border-right: 1px solid #e4e7ed;
  background: #f5f7fa;
  display: flex;
  align-items: center;
}

.timeline-dates {
  display: flex;
  flex: 1;
}

.timeline-week {
  padding: 12px 8px;
  border-right: 1px solid #e4e7ed;
  font-size: 12px;
  font-weight: 500;
  color: #606266;
  text-align: center;
  background: #f5f7fa;
  white-space: nowrap;
  flex-shrink: 0;
}

.gantt-body {
  flex: 1;
  overflow-y: auto;
  background: white;
}

.gantt-row {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  min-height: 60px;
  position: relative;
}

.gantt-row:hover {
  background: #f9f9f9;
}

.task-name {
  width: 150px;
  padding: 16px;
  border-right: 1px solid #e4e7ed;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: 500;
  color: #303133;
}

.task-name small {
  color: #909399;
  font-weight: normal;
  font-size: 11px;
  margin-top: 2px;
}

.task-timeline {
  position: relative;
  flex: 1;
  min-height: 60px;
}

.task-bar {
  position: absolute;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.task-bar:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.es-bar {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  top: 12px;
  border: 1px solid #409eff;
}

.result-es-bar {
  background: linear-gradient(135deg, #22b11e, rgba(67, 165, 89, 0.8));
  top: 24px;
  border: 1px #4bb347;
}

.ls-bar {
  background: linear-gradient(135deg, #f56c6c, #f78989);
  top: 36px;
  border: 1px solid #f56c6c;
}

.task-bar-text {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  font-size: 14px;
}

.gantt-scroll-wrapper {
  overflow-x: auto;
  position: relative;
}

.gantt-scroll-area {
  display: inline-block;
  min-width: 100%;
}

.timeline-dates {
  display: flex;
}

/* 滚动条样式 */
.timeline-dates::-webkit-scrollbar,
.task-timeline::-webkit-scrollbar {
  height: 6px;
}

.timeline-dates::-webkit-scrollbar-track,
.task-timeline::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.timeline-dates::-webkit-scrollbar-thumb,
.task-timeline::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.timeline-dates::-webkit-scrollbar-thumb:hover,
.task-timeline::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gantt-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .gantt-legend {
    flex-direction: column;
    gap: 8px;
  }

  .task-names-header,
  .task-name {
    width: 120px;
  }
}
</style>