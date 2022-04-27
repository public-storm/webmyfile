import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/views/Home"

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }
]

const router = new Router({
    modes: 'history',
    routes
})


export default router
