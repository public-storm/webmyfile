import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/views/Home"
import Login from "@/views/Login"
import File from "@/views/File"
import Favorite from "@/views/Favorite"

Vue.use(Router);
// 这个是为了避免一个报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/Home',
        name: 'home',
        component: Home,
        meta: {
            requireAuth: false
        },
        children: [
            {
                path: '/File',
                name: 'file',
                component: File,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/Favorite',
                name: 'favorite',
                component: Favorite,
                meta: {
                    requireAuth: true
                }
            },
        ]
    },
]

const router = new Router({
    modes: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (window.localStorage.getItem('userName')) {
            next();
        } else {
            next({
                path: '/',
            })
        }
    } else {
        next();
    }
});

export default router
