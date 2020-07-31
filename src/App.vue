<template>
    <div id="app">
        <!-- 视频网页导航条 -->
        <HeaderSearch class="pageHead" ref="HeaderSearch"/>
        <router-view class="content"></router-view>
        <Foter class="pageFoter"/>
        <div v-if="$route.name != 'ProblemFeedback'" class="ProblemFeedback" @click="fankui"> 
            <p>问题</p>
            <p>反馈</p>
        </div>
        <BackTop  :bottom="180"></BackTop>
    </div>
</template>

<script>
import HeaderSearch from "./components/HeaderSearch.vue";
import Foter from "./components/Foter.vue";

import { mapActions } from "vuex"

export default {
    name: "App",
    metaInfo(){
        return {
            title: this.$route.meta.title,
            titleTemplate: null,
            meta: [
                { name: "keywords", content: this.$route.meta.keywords },
                { name: "description", content: this.$route.meta.description }
            ]
        }
    },
    data() {
        return {
            pageSize:'PC'
        };
    },
    components: {
        HeaderSearch,
        Foter
    },
	created(){
        this.setToken()
        let callback = (val, oldVal, uri) => {
            if(!val){
                // console.log("====Token没了")
                // console.log('localStorage change', val);
                this.setToken()
            }

        } 
        this.$ls.on('Token', callback)
    },
    methods:{
        setToken(){
            this.GetToken().then((res) => {
                // console.log(res)
            })
        },
        fankui(){
            this.$router.push({path:'/ProblemFeedback'})
        },
        ...mapActions([
            'GetToken'
        ])
    },
    mounted(){
        window.onresize=(win)=>{
            console.log(win.currentTarget)
            console.log(win.currentTarget.innerWidth)

        }
    }
};
</script>

<style lang="less">
    .text_item{
        width: 100%;
        height:495px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
    }
    .content{
        min-height:500px;
    }
    .ProblemFeedback{
        position: fixed;
        cursor: pointer;
        bottom: 130px;
        right: 30px;
        z-index: 10;
        font-weight: 500;
        width:48px;
        height:48px;
        background: rgba(0,0,0,0.6);
        color:#fff;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 2px;
        transition: all 0.3s 0s;
        &:hover{
            
            background: rgba(0,0,0,0.7);
        }
    }
</style>
