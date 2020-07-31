// import Vue from 'vue'
import axios from '../../utils/axiosAjax'
import { API , httpApi } from '../../utils/api'

const user = {
    state: {
        isLogin:false,  // 登录状态
        name: '',    // 用户名
        roles: [],  // 角色
        info: {}    // 用户信息
    },

    mutations: {
        SET_ISLOGIN: (state, isLogin) => {
            state.isLogin = isLogin
        },
        SET_NAME: (state, name ) => {
            state.name = name
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_INFO: (state, info) => {
            state.info = info
        }
    },
    actions: {
        // 登录
        Login({ commit },param) {
            return new Promise((resolve, reject) => {
                axios.post(API.user.Login, param,{
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(response => {
                    response.data.userDto.headPicture =response.data.userDto.headPicture.indexOf('https://')>-1?response.data.userDto.headPicture: httpApi+'/msb-video-user'+response.data.userDto.headPicture;
                    
                    // 设置登录状态为:已登录
                    commit('SET_ISLOGIN', true )
                    // 设置登录用户名
                    commit('SET_NAME', response.data.userDto.userName )
                    // 设置登录用户信息
                    commit('SET_INFO', response.data.userDto )

                    Vue.ls.set('Token',response.data.token , 10 * 60 * 1000) // 设置缓存 token 10分钟自动删除
                    Vue.ls.set('User-Info',response.data.userDto , 10 * 60 * 1000) // 设置缓存 用户信息

                    // 用户是否勾选10天免登陆操作
                    if(param.MemoryLogin){
                        Vue.ls.set('Refresh-Token',response.data.refreshToken ) // 设置缓存 token 10天自动删除
                        // Vue.ls.set('Refresh-Token',response.data.refreshToken , 10 * 24 * 60 * 60 * 1000) // 设置缓存 token 10天自动删除
                    }else{
                        Vue.ls.set('Refresh-Token',response.data.refreshToken , 2 * 60 * 60 * 1000) // 设置缓存 token 2小时后自动删除
                    }
                    // 请求结束后，返回数据
                    resolve(response)
                }).catch(error => {
                    console.log(error);
                    reject(error)
                });
            })
        },
        // 获取用户信息
        GetInfo({ commit ,dispatch}) {
            return new Promise((resolve, reject) => {
                // 获取验证码
                axios.get( API.user.Info,
                    {
                        params: {
                            ids: Vue.ls.get('User-Info').id
                        },
                        headers:{
                            Authorization:Vue.ls.get('Token')
                        }
                    }).then(response => {
                    let info = response.data[0]
                    // info.headPicture = httpApi+'/msb-video-user'+info.headPicture;
                    info.headPicture = info.headPicture.indexOf('https://')>-1?info.headPicture: httpApi+'/msb-video-user'+info.headPicture;
                    // 设置登录状态为:已登录
                    commit('SET_ISLOGIN', true ) 
                    // 设置登录用户名
                    commit('SET_NAME', info.userName )
                    // 设置登录用户信息
                    commit('SET_INFO', info )

                    Vue.ls.set('User-Info',info ) // 设置缓存 用户信息
                    resolve( Vue.ls.get('Token') )
                }).catch(error => {
                    // console.log(error);
                    if(error.code==401){
                        setTimeout(()=>{
                            Vue.ls.remove('Token')
                            Vue.ls.remove('User-Info')
                            dispatch('GetToken')
                        },100)
                    }
                });
            })
        },
        // 获取token
        GetToken({ commit , dispatch , rootState }){
            return new Promise((resolve, reject) => {
                if(  Vue.ls.get('Token') ){
                    if(!rootState.user.isLogin){
                        dispatch('GetInfo').then((TOKEN) => {
                            resolve( Vue.ls.get('Token') )
                        })
                    }else{
                        resolve( Vue.ls.get('Token') )
                    }
                }else{
                    if( Vue.ls.get('Refresh-Token') ){
                        console.warn("===Refresh-Token===存在===:"+new Date().getTime())
                        axios.post( API.user.getToken,{
                            refreshToken:Vue.ls.get('Refresh-Token')
                        },{
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then(response => {
                            // response.data.userDto.headPicture = httpApi+'/msb-video-user'+response.data.userDto.headPicture;
                            response.data.userDto.headPicture =response.data.userDto.headPicture.indexOf('https://')>-1?response.data.userDto.headPicture: httpApi+'/msb-video-user'+response.data.userDto.headPicture;
                            // 设置登录状态为:已登录
                            commit('SET_ISLOGIN', true ) 
                            // 设置登录用户名
                            commit('SET_NAME', response.data.userDto.userName )
                            // 设置登录用户信息
                            commit('SET_INFO', response.data.userDto )

                            Vue.ls.set('Refresh-Token',response.data.refreshToken )
                            Vue.ls.set('Token',response.data.token , 10 * 60 * 1000) // 设置缓存 token 10分钟自动删除
                            Vue.ls.set('User-Info',response.data.userDto ) // 设置缓存 用户信息

                            console.warn("===请求token，重设成功===:"+new Date().getTime())
                            resolve( response.data.token )

                        }).catch(error => {
                            console.log(error);
                            if(error == '不能重复请求token'){
                                setTimeout(()=>{
                                    dispatch('GetToken').then(response=>{
                                        resolve(response)
                                    })
                                },300)
                            }else{
                                dispatch('Logout').then(()=>{
                                    reject("已离线")
                                })
                            }
                        });
                    }else{
                        dispatch('Logout').then(()=>{
                            reject("已离线")
                        })
                    }
                }
            })
        },
        // 登出
        Logout({ commit, state }) {
            return new Promise((resolve, reject) => {
                commit('SET_ISLOGIN', false ) 
                commit('SET_NAME', '')
                commit('SET_ROLES', [])
                commit('SET_INFO', {})

                Vue.ls.remove('Token')
                Vue.ls.remove('Refresh-Token')
                Vue.ls.remove('User-Info')
                Vue.ls.remove('PLAYRECORD')
                Vue.ls.remove('VIDEOINFO')
                resolve()
            })
        }
    }
}

export default user
