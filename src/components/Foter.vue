<template>
    <div class="foter">
            <div class="inner">
                <div class="fotLog">
                    <router-link to="/">
                        <img src="../assets/images/foterLog.png" alt="">
                        <p>为中国IT事业打造更多更专业的技术人才</p>
                    </router-link>
                </div>
                <ul class="sonNav">
                    <li v-for="(item,i) in sonNavList" :key="i">
                        <div v-for="(citem,j) in item" :key="j" @click="routerGo(citem.path,j)">{{citem.name}}</div>
                    </li>
                </ul>
                <ul class="customerService">
                    <li v-for="(item,index) in customerServiceData" :class="{hover1:item.showHover==1,hover2:item.showHover==2}" :key="index">
                        <img :src="item.imgSrc" alt="" @mouseover="mouseoverLi(item)" @mouseleave="mouseleaveLi">
                        <p>{{item.name}}</p>
                    </li>
                </ul>
            </div>
            <p class="RecordNo">京ICP备17012835号-1</p>
        </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            sonNavList:{
                company:[
                    {name:'公司简介',path:''},
                    {name:'发展历程',path:''},
                    {name:'荣誉资质',path:''},
                    {name:'关于我们',path:''},
                ],
                case:[
                    {name:'案例展示',path:''},
                    {name:'案例分类',path:''},
                    {name:'细类分支',path:''},
                ],
                Journalism:[
                    {name:'新闻动态',path:''},
                    {name:'公司新闻',path:''},
                    {name:'行业动态',path:''},
                ],
                about:[
                    {name:'关于我们',path:''},
                    {name:'联系我们',path:''},
                    {name:'在线咨询',path:''},
                ]
            },
            // 客服二维码
            customerServiceData:[{
                imgSrc:require('@/assets/images/customerservice/mxx.jpg'),
                showHover:0,
                name:'琪琪'
            },{
                imgSrc:require('@/assets/images/customerservice/mxy.jpg'),
                showHover:0,
                name:'马小雅'
            },{
                imgSrc:require('@/assets/images/customerservice/mxj.jpg'),
                showHover:0,
                name:'马小九'
            },{
                imgSrc:require('@/assets/images/customerservice/mxl.jpg'),
                showHover:0,
                name:'马小六'
            }]
        };
    },
    watch: {},
    computed: {},
    methods: {
        mouseoverLi(o){
            let list = this.customerServiceData.map(item=>{
                return{
                    ...item,
                    showHover:o.name == item.name?1:2
                }
            })
            this.customerServiceData = list
        },
        mouseleaveLi(){
            let list = this.customerServiceData.map(item=>{
                return{
                    ...item,
                    showHover:0
                }
            })
            this.customerServiceData = list
        },
        routerGo(path,index){
            if(index != 0){
                this.$BWDMODEL.show({
                    text:`
                        <img src='${require("@/assets/images/defaultPic/notLogin.png")}'>
                        <div>
                            <p style="font-size:18px;font-weight: bold;text-align: center;">新功能仍在努力开发，敬请期待。</p>
                            <p style="font-size:18px;font-weight: bold;text-align: center;">Coming soon</p>
                        </div>`,
                    textStyle:{
                        padding:'50px',
                        background:'#CFDCFE',
                        borderRadius: '10px',
                        border:'#81A4F6 solid 2px',
                        color:'#5E8EF2',
                        display:'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                    duration:1
                })
            }
        }
    },
    created() {},
    mounted() {}

}
</script>
<style lang="less" scoped>
    .foter{height:380px;background: #333333;width:100%;min-width: 1200px;}
    .foter .inner{ overflow: hidden;width:1200px;margin: 0 auto;} 
    .foter .fotLog{float: left;padding-top: 60px;margin-right: 60px;}
    .foter .fotLog p{color:#fff;font-size: 16px;padding-top: 15px;}

    .foter .sonNav{float: left;padding-top: 100px;color:#fff;overflow: hidden;margin-right: 40px;}
    .foter .sonNav li{float: left;font-size: 16px;font-weight: 400;text-align: center;margin-right: 50px;}
    .foter .sonNav li div{margin-bottom: 20px;cursor: pointer;}
    .foter .sonNav li div a{color:#fff}
    .foter .sonNav li div a:hover{color:#D72581}
    .foter .sonNav li div:nth-child(1){font-size: 18px;font-weight: bold;cursor: auto;}
    .foter .sonNav{float: left;padding-top: 100px;color:#fff}
    .foter .customerService{float: left;width: 222px;padding-top: 64px;}
    .foter .customerService li{width: 86px;margin-right:50px;margin-bottom: 20px;float: left;text-align: center;color:#fff;font-size: 14px;}
    .foter .customerService li:nth-child(2n){margin-right:0;}
    .foter .customerService li img{width: 86px;height:86px;margin-bottom: 14px;display: block;transition: all 0.5s 0s;}

    .foter .customerService li.hover1 img{transform: scale(1.9);position:relative;z-index:2;}
    .foter .customerService li.hover2 img{opacity :0.6;}
    .foter .RecordNo{text-align: center;color:#fff;font-size: 14px;padding-top: 10px;}
</style>