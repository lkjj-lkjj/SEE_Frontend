import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/global.css';

createApp(App).use(router).use(ElementPlus).mount('#app')
