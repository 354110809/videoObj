<template>
    <div class="detailPage">
        <div class="topModel" ref="topModel">
            <div class="inner" v-if="CourseData">
                <!-- 面包屑 -->
                <Breadcrumb  class="crumbs" separator=">">
                    <BreadcrumbItem to="/allCourses">全部课程</BreadcrumbItem>
                    <BreadcrumbItem>{{CourseData.name}}</BreadcrumbItem>
                </Breadcrumb>
                <div class="courseInfo">
                    <div class="cover" :class="{noCover:!CourseData.courseCoverUrl}">
                        <img class="img-left" :src="CourseData.coverSrc" :alt="CourseData.name">
                    </div>
                    <div class="info">
                        <h1 class="page-tt"><span class="title-main" :title="CourseData.name">{{CourseData.name}}</span></h1>
                        <p class="below-line"><span class="fenX" @click="onTapType"><i></i><b>分享</b></span></p>
                        <div class="time">
                            <p>更新时间：{{CourseData.courseStartTime}}</p>
                            <p>课<span></span>时：{{CourseData.courseTotalTime}}小时</p>
                            <p>级<span></span>别：{{CourseData.grade}}</p>
                        </div>
                        <div class="f-dropdown-content">
                            <ul class="type">
                                <li>{{CourseData.categoryName}}</li>
                            </ul>
                        </div>
                        <div class="price">￥{{CourseData.price}}</div>
                        <div class="btnBox">
                            <p class="buyNow" @click="roterGo(1)">立即学习</p>
                            <!-- <p class="consultation" @click="consultation">咨询</p> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottomInfo" ref="bottomInfo">
            <div class="inner">
                <div class="leftBox">
                    <Affix>
                         <ul class="headTap">
                            <li v-for="(item,index) in detailsHeadL" :key="index" :class="{cur:item.type == showModelIndex, hot:item.type == 4}" @click="clickHead(item)">{{item.name}}<span v-if="item.type==4">HOT</span></li>
                        </ul>
                    </Affix>
                    <div class="modelBox">
                        <kechengjieshao :CourseData="CourseData" v-if="showModelIndex==1"></kechengjieshao>
                        <kechengdagang :courseId="courseId" v-if="showModelIndex==2"></kechengdagang>
                        <xueyuanpingjia :courseId="courseId" v-if="showModelIndex==3"></xueyuanpingjia>
                        <tancanzuhe :courseId="courseId" v-if="showModelIndex==4"></tancanzuhe>
                    </div>
                </div>

                <div class="rightBox">
                    <div class="aside-blocks">
                        <div class="aside-block">
                            <div class="agency-tt">
                                <div class="tt-cover-url">
                                    <img src="../../../assets/images/icon/headPortrait.png" alt="马士兵老师">
                                </div>
                                <div class="tt-cover-name">
                                    <h5>马士兵老师</h5>
                                    <p></p>
                                </div>
                            </div>
                            <ul class="tree-list">
                                <li>
                                    <p class="item-tt">好评度</p>
                                    <span class="item-num">
                                        100%
                                    </span>
                                </li>
                                <li>
                                    <p class="item-tt">课程数</p>
                                    <span class="item-num js-item-num" data-num="58">73</span>
                                </li>
                                <li>
                                    <p class="item-tt">学习人次</p>
                                    <span class="item-num js-item-num" data-num="406565">52万</span>
                                </li>
                            </ul>
                            <div class="agency-summary">马士兵教育创立于2016年，致力于专业JAVA培训，首创JAVA技术栈延伸课，提倡“复杂问题简单说”！</div>
                        </div>
                        <div class="aside-block" v-if="false">
                            <h3 class="block-tt">联系方式</h3>
                            <ul class="contact-list">
                                <li>
                                    <i class="i-group"></i>
                                    <a href="" class="item-tt js-group-entrance" title="PythonWeb全栈">
                                        PythonWeb全栈
                                    </a>
                                    <p class="gray">群号: 913637240</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
    import kechengjieshao from './detailsModel/model1.vue'
    import kechengdagang from './detailsModel/model2.vue'
    import xueyuanpingjia from './detailsModel/model3.vue'
    import tancanzuhe from './detailsModel/model4.vue'
    
    import {isIE,formatDuring,formatDate} from "../../../utils/tool.js"
    import { mapActions } from "vuex"

    export default {
        components: {kechengjieshao,kechengdagang,xueyuanpingjia,tancanzuhe},
        metaInfo(){
            return{
                title: this.pageTitle,
                titleTemplate: null,
                meta: [
                    { name: "keywords", content: this.$route.meta.keywords  },
                    { name: "description", content: this.$route.meta.description  }
                ]
            }
        },
        data() {
            return {
                // 页面标题 动态设置
                pageTitle:'详情',
                courseId:null,
                showModelIndex:0,
                // 内容部分距离顶部距离
                bottomInfooffsetHeight:0,
                // 页面上升距离
                scrollTop:0,
                detailsHeadL:[{
                //     name:'课程简介',
                //     type:1
                // },{
                    name:'课程大纲',
                    type:2
                // },{
                //     name:'学员评价',
                //     type:3
                // },{
                //     name:'套餐组合',
                //     type:4
                }],
                // 课程基本信息
                CourseData:null
            };
        },
        watch: {},
        computed: {
            isLogin () {
                return this.$store.state.user.isLogin
            },
            userInfo () {
                return this.$store.state.user.info
            },
        },
        methods: {
            // 获取课程数据基本信息
            getCourseData(id){
                this.$loading.show()
                this.axios.post(this.API.Course.Search,{id:id}).then(response=>{
                    // console.log(response.data)
                    let data = response.data.records.map(item=>{
                        let urlCover = item.courseCoverUrl?(item.courseCoverUrl.indexOf("://") > -1
                                ? item.courseCoverUrl : this.PICURL + item.courseCoverUrl ) :require("@/assets/images/defaultPic/courseCover.jpg")
                        return{
                            categoryId:item.categoryId, // 分类id
                            categoryName:item.categoryName, // 分类id
                            name: item.courseName, // 课程名称
                            id:item.id, // 课程id
                            grade: item.courseGrade, // 等级
                            evaluate: item.evaluateCount || 0, // 评价数量
                            peopleNub: item.courseUserCount || 0, // 购买数量
                            price: item.coursePrice, // 单价
                            // countDown: formatDuring(  new Date(item.discountEndTime).getTime() - new Date().getTime(),'dd:hh:mm'), // 倒计时
                            courseStartTime:item.gmtModified?formatDate( item.gmtModified , 'yyyy-MM-dd'):'',
                            coverSrc:urlCover,  // 课程封面 
                            courseCoverUrl:item.courseCoverUrl,
                            teacherName: item.teacherName, // 老师名
                            teacherId: item.teacherId,  // 老师id
                            courseDescribe: item.courseDescribe, // 课程描述
                            courseTotalTime: (item.courseTotalTime/60/60).toFixed(2) || 0 // 总时长

                        }
                    });
                    this.CourseData = data[0];
                    this.pageTitle = this.CourseData.name;
                    this.clickHead(this.detailsHeadL[0])
                    this.$loading.hide()
                    this.$nextTick(()=>{
                        let tabH = this.$refs.bottomInfo.offsetTop + 20;
                        this.bottomInfooffsetHeight = tabH;
                    })
                })
            },
            // 切换下部信息
            clickHead(item){
                var vm = this;
                vm.showModelIndex = item.type;
                let domscrollTop = document.documentElement.scrollTop;
                if(domscrollTop < this.bottomInfooffsetHeight){}else{
                    window.scrollTo(0,vm.bottomInfooffsetHeight)
                }
            },
            // 立即学习
            roterGo(val){
                if(this.isLogin){
                    this.GetToken().then((TOKEN) => {
                        if(TOKEN == '已离线'){
                            this.$Message.warning({content:'用户已离线',onClose:()=>{
                                // 如果未登录，先登录
                                this.$parent.$refs.HeaderSearch.OnUserPic();
                            }})
                            return;
                        }
                        let UID = this.userInfo.id || this.$ls.get('User-Info').id;
                        this.axios.post( this.API.Course.AddUserChapters(this.CourseData.id,UID),{},{
                            headers:{
                                Authorization:this.$ls.get('Token')
                            }
                        })
                        if(val == 1){
                            Vue.ls.remove('VIDEOINFO');
                        }
                        this.$router.push({path:`/studyPlay/${this.CourseData.id}/${this.CourseData.name}`})
                    })
                }else{
                    // 如果未登录，先登录
                    this.$parent.$refs.HeaderSearch.OnUserPic();
                }
            },
            // 
            onTapType(){
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

            },
            ...mapActions([
                'GetToken',
            ])
        },
        created() {
            
        },
        mounted() {
            let id = this.$route.params.id;
            this.courseId = id;
            this.getCourseData(id)
        }
    }
</script>
<style lang='less' scoped>
    .detailPage{
        width:100%;
        min-width:1200px;
        .inner{
            width:1200px;
            margin: 0 auto;
        }
        .topModel{
            background: #fff;
            padding: 20px 0;
            position: relative;
            z-index: 1;
            .crumbs{
                color:#585858;font-size: 16px;line-height: 20px;padding-bottom: 20px;
                a{
                    color:#585858;
                    &:hover{
                        color:#0e22d3;
                    }
                }
            }
            .courseInfo{
                min-height:374px;overflow: hidden;
                .cover{
                    width:660px;height:374px;float: left;margin-right: 20px;display: flex;justify-content: center;align-items: center;
                    background: #E8E8E8;
                    img{width:100%;}
                    &.noCover{
                        img{
                            width:130px;
                        }
                    }
                }
                .info{
                    float: right;width: 520px;
                    h1{
                        color:#1D1D1D;font-size: 24px;padding: 10px 0;
                    }
                    .below-line{
                        display: flex;
                        margin-bottom:20px;
                        .fenX{
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            i{
                                display: inline-block;
                                width:14px;
                                height:14px;
                                background: url(../../../assets/images/icon/fenxiang.png) no-repeat center/auto 14px;
                            }
                            b{
                                padding-left:5px;
                                font-weight: normal;
                                font-size: 16px;
                                color:#999;
                            }
                        }
                    }
                    .time{
                        margin-bottom: 10px;
                        p{
                            color:#8C8C8C;font-size: 16px;padding-bottom: 8px;
                            span{
                                display: inline-block;width:32px;
                            }
                        }
                    }
                    ul{
                        margin-bottom: 10px;
                        li{
                            font-size: 14px;
                            height: 25px;
                            color: #23b8ff;
                            border: 1px solid #23b8ff;
                            box-sizing: border-box;
                            line-height: 23px;
                            display: inline-block;
                            padding: 0 10px;
                            cursor: pointer;
                            margin: 0 5px 5px 0;
                        }
                    }
                    .price{
                        background-color: #f4f4f4;
                        height: 46px;
                        line-height: 46px;
                        padding-left: 10px;
                        color:red;
                        font-size: 30px;
                        font-weight: bold;
                        margin-bottom: 20px;
                    }
                    .btnBox{
                        display: flex;
                        p{
                            width:188px;
                            height:46px;
                            text-align: center;
                            line-height: 46px;
                            margin-right: 20px;
                            font-size: 20px;
                            cursor: pointer;
                            font-weight: bold;
                            box-sizing: border-box;
                            &.buyNow{
                                background: #23b8ff;
                                color:#fff;
                            }
                            &.consultation{
                                border:1px solid #23b8ff;
                                color:#23b8ff;
                                text-indent: 1em;
                                background: url(../../../assets/images/icon/zixun.png) no-repeat 50px 13px/auto 21px;
                            }
                        }
                    }
                }
            }
        }
        .bottomInfo{
            background:#f5f5f5;
            padding: 20px 0;
            .inner{
                position: relative;
                .leftBox{
                    width:885px;
                    min-height:500px;
                    background: #fff;
                    .headTap{
                        height:50px;
                        display: flex;
                        border-bottom:2px solid #dedede;
                        align-items:center;
                        padding-left:20px;
                        box-shadow: 0 -9px 10px #e1dbdb91;
                        background: #fff;
                        li{
                            padding:3px 8px;
                            margin-right:15px;
                            font-size: 16px;
                            cursor: pointer;
                            &.cur{
                                background: #23b8ff;
                                color:#fff;
                            }
                        }
                        .hot{
                            position: relative;
                            span{
                                position: absolute;
                                top:-8px;
                                right:-22px;
                                font-size: 12px;
                                font-weight: bold;
                                padding:2px 3px;
                                border-radius: 4px;
                                background:#dd0707;
                                color:#fff;
                                transform: scale(0.8);
                                &:after{
                                    content: '';
                                    position: absolute;
                                    top: 19px;
                                    left: 11px;
                                    border: 0 solid rgba(0, 0, 0, 0);
                                    border-right: 10px solid rgba(0, 0, 0, 0);
                                    border-top: 10px solid #de3b31;
                                }
                            }
                        }

                    }
                    .modelBox{
                        padding:20px 25px;
                    }
                }
                .rightBox{
                    position: absolute;
                    top:0;
                    right:0;
                    width:305px;
                    background: #fff;
                    .aside-blocks{
                        padding: 0 30px;
                        background-color: #fff;
                        .aside-block {
                            padding: 20px 0 25px;
                            .agency-tt{
                                font-size: 16px;
                                margin-bottom: 20px;
                                position: relative;
                                .tt-cover-url {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                }
                                .tt-cover-name {
                                    margin-left: 88px;
                                    min-height: 75px;
                                    padding-top:10px;
                                    h5 {
                                        padding-bottom: 10px;
                                        color: #23b8ff;
                                        line-height: 26px;
                                    }
                                    p{
                                        width: 72px;
                                        height: 26px;
                                        background: url(../../../assets/images/icon/c-sprite.png) no-repeat -254px -188px;
                                    }
                                }
                            }
                            .tree-list {
                                display: table;
                                table-layout: fixed;
                                width: 100%;
                                margin-bottom: 20px;
                                li {
                                    display: table-cell;
                                    border-left: 1px solid #e5e5e5;
                                    text-align: center;
                                    &:first-child {
                                        border-left: 0;
                                    }
                                    .item-num {
                                        color: #999;
                                    }
                                }
                            }
                            .agency-summary{
                                font-size: 14px;
                                line-height: 1.5;
                                color: #333;
                            }
                        }
                        .aside-block+.aside-block {
                            border-top: 1px solid #e5e5e5;
                            .block-tt {
                                font-size: 16px;
                                line-height: 2;
                                margin-bottom: 10px;
                            }
                            .contact-list{
                                li {
                                    position: relative;
                                    padding-left: 28px;
                                    margin-right: 5px;
                                    margin-bottom: 20px;
                                    .i-group{
                                        width: 20px;
                                        height: 20px;
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        background: url(../../../assets/images/icon/group.png) no-repeat center/100% auto;
                                    }
                                    a{
                                        color:#23b8ff;
                                    }
                                    .gray{
                                        color:#999;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } 
    }
</style>