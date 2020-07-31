// import Vue from 'vue';
// import axios from 'axios';
import qs from 'qs';
import store from '../store/index';
// axios 配置
axios.create({
    // baseURL: 'http://msbvideo.mingfei.wang:8084/',
    // timeout: 60000,
    // responseType: 'json',
    headers: {
        // 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'Content-Type': 'application/json'
    }
})

axios.defaults.withCredentials = true;


// http request 请求拦截器
axios.interceptors.request.use(
    config => {
        config.headers['Msb-Source'] = 'PC'
        if(config.method == 'post' || config.method == 'put'){
            if(config.headers['Content-Type'] == 'application/x-www-form-urlencoded'){
                config.data = qs.stringify(config.data)
            }
        }
        // 验证是否重复请求token
        let oldAxiosDataUrl = store.state.search.axiosDataUrl;
        // if( config.url.indexOf('/playUrl') > -1 ){
        if( oldAxiosDataUrl != {}  && oldAxiosDataUrl.url == config.url && config.url.indexOf('/refreshToken') > -1 ){
            return Promise.reject('不能重复请求token')
        }else{
            let newAxiosDataUrl = {url:config.url,time: new Date().getTime()}
            store.commit('SET_AXISOURLCUR', newAxiosDataUrl )
            return config
        }
    },
    err => {
        return Promise.reject(err)
    },
)

// http response 返回拦截器
axios.interceptors.response.use(
    response => {
        store.commit('SET_AXISOURLCUR', {} )
        return response
    },
    error => {
        store.commit('SET_AXISOURLCUR', {} )
        let data = error;
        // data = error.response.data;
        if (error.response) {
            // console.log(error.response)
            switch (error.response.status) {
                case 400:
                    data = {
                        code:400,
                        message: error.response.data
                    }
                    break;
                case 401:
                    data = {
                        code:401,
                        message: error.response.data
                    }
                    break;
                case 403:
                    data = {
                        code:403,
                        message: error.response.data
                    }            
                    break;
                case 500:
                    data = {
                        code:500,
                        message: error.response.data
                    }
                    break;
                default:
                    // console.log()
                    
            }
        }
        // console.log(data)
        return Promise.reject(data)
    },
)

export default axios