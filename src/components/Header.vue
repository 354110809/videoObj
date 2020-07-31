<template>
    <div class="header">
        <div class="inner">
            <div class="log">
                <router-link to="/"><img src="../assets/images/logoH.png" /></router-link>
            </div>
            <div class="nav">
                <ul>
                    <li v-for="item in navData" :key="item.name" :class="{cur:$route.path == item.path}" @click="roterGo(item.path)">{{item.name}}</li>
                </ul>
            </div>
            <div class="nav-set">
                <p><router-link to="/login">登 录</router-link></p>
                <p><router-link to="">注 册</router-link></p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        curNum: Number
    },
    data() {
        return {
            navData:[{
                name:'首页',
                type:1,
                path:'/index'
            },{
                name:'马士兵大学',
                type:2,
                path:'/msbUniversity'
            },{
                name:'Java后端',
                type:3,
                path:'/java'
            },{
                name:'人工智能',
                type:4,
                path:'/AI'
            },{
                name:'架构师',
                type:5,
                path:'/architect'
            },{
                name:'大数据',
                type:6,
                path:'/bigData'
            },{
                name:'视频点播',
                type:7,
                path:'/'
            }]
        };
    },
    watch: {},
    computed: {},
    methods: {
        roterGo(path) {
            this.$router.push({ path: path });
        },
    },
    created() {},
    mounted() {}
};
</script>
<style lang="less" scoped>
    .header{
        width:100%;height:76px;background: #fff;position: relative;z-index:10;
        .inner{
            width: 1200px;margin:0 auto;
            .log{
                float: left;margin-right: 20px;padding-top: 8px;
            }
            .nav{
                float: left;padding-top:27px;
                ul{
                    overflow: hidden;
                    li{
                        float: left;height:30px;padding:0 15px;line-height: 30px;font-size: 18px;color:#3B424B;cursor: pointer;margin-right: 30px;
                        &.cur{border-radius: 15px;background: #D54594;color:#fff;}  
                    }
                }
            }
            .nav-set{
                float: right;padding-top:25px;
                p{
                    float: left;color:#3B424B;font-size: 18px;height:30px;line-height: 30px;margin-left: 20px;cursor: pointer;
                    a{color:#3B424B;}
                }
            }
        }
    }
</style>