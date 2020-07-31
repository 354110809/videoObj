// import Vue from 'vue'
import router from './index'

router.beforeEach((to, from, next) => {
    // console.log("路由跳转之前")
    if(to.name == 'studyPlay' && !Vue.ls.get('Refresh-Token')){
        next('/')
    }else{
        next()
    }
    // console.log(from)
})

router.afterEach(() => {
    // console.log("路由跳转之后")
    // window.scrollTo(0,0)
})