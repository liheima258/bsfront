import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/interface',
        name: 'interface',
        component: () => import('../views/interface'),
        redirect: '/index',
        children: [
            { path: '/index', name: 'index', component: () => import('../views/interface/index') },
            { path: '/manager', name: 'manager', component: () => import('../views/interface/manager') },
            { path: '/floor', name: 'floor', component: () => import('../views/interface/floor') },
            { path: '/room', name: 'room', component: () => import('../views/interface/room') },
            { path: '/seat', name: 'seat', component: () => import('../views/interface/seat') },
            { path: '/appointment', name: 'appointment', component: () => import('../views/interface/appointment') },
            { path: '/user', name: 'user', component: () => import('../views/interface/user') },
            { path: '/remark', name: 'remark', component: () => import('../views/interface/remark') },
            { path: '/notice', name: 'notice', component: () => import('../views/interface/notice') },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login')
    },
    {
        path: '/',
        name: 'login',
        component: () => import('../views/login')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/register')
    },
    {
        path: '/forget',
        name: 'forget',
        component: () => import('../views/forget')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => err);
};

//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalReplace.call(this, location, onResolve, onReject);
    return originalReplace.call(this, location).catch(err => err);
};
