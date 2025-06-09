import {createRouter, createWebHistory} from "vue-router";

import Login from "@/components/Login.vue";
import Main_view from "@/views/Main_view.vue";
import Algo1 from "@/subviews/Algo1.vue";
import Algo2 from "@/subviews/Algo2.vue";

const routes = [
    {
        path: '/',
        redirect: '/login'  // ⬅️ 添加重定向
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/main',
        component: Main_view,
        redirect: '/main/algo1',
        children: [
            {
                path: 'algo1',
                component: Algo1
            },
            {
                path: 'algo2',
                component: Algo2
            }
        ]
    }
]





const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach((to, from) => {
    const toDepth = to.path.split('/').length;
    const fromDepth = from.path.split('/').length;
    to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left';
});

export default router