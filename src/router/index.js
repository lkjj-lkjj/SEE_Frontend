import {createRouter, createWebHistory} from "vue-router";

import Login from "@/components/Login.vue";
import Main_view from "@/views/Main_view.vue";
import Algo2 from "@/subviews/Algo2.vue";
import Algo4 from "@/subviews/Algo4.vue";
import Algo1_1 from "@/subviews/Algo1_1.vue";
import Algo1_2 from "@/subviews/Algo1_2.vue";
import Algo3 from "@/subviews/Algo3.vue";

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
        redirect: '/main/algo1_1',
        children: [
            {
                path: 'algo1_1',
                component: Algo1_1
            },
            {
                path: 'algo1_2',
                component: Algo1_2
            },
            {
                path: 'algo2',
                component: Algo2
            },
            {
                path: 'algo3',
                component: Algo3
            },
            {
                path: 'algo4',
                component: Algo4
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