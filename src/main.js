import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/global.css';
import VueGantt3 from 'vue-gantt-3';
import 'vue-gantt-3/es/vue-gantt-3.css';

createApp(App).use(router).use(ElementPlus).use(VueGantt3).mount('#app')
