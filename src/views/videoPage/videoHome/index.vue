<template>
    <div class="videoHomePage">
        <Banner :bannerImgSrc="bannerSrc" :bannerStyle="bannerStyle"></Banner>
        <!-- 模块一 -->
        <div class="model" v-if="false">
            <div class="inner">
                <ModelTitle :title="'即将开课'" :info="'完爆同行 课程累计售出12238单'"></ModelTitle>
                <div class="modelBody modelBody1">
                    <ul>
                        <li v-for="item in 4" :key="item">
                            <ModelLiTime />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 模块二 -->
        <div class="model modelColor" v-if="false">
            <div class="inner">
                <ModelTitle :title="'新上好课'" :info="'学员口碑捧起来的Java就业课'"></ModelTitle>
                <div class="modelBody modelBody2">
                    <ul>
                        <li v-for="(item , index) in arrData" :key="index" @click="roterGo(item)">
                            <ModelLi :liData="item" />
                        </li>
                    </ul>
                    <div class="btnMore" >查看更多学习视频</div>
                </div>
            </div>
        </div>
        <!-- 模块三 -->
        <div class="model" :class="{modelColor:indedx%2==1}" v-for="(item,indedx) in arrData" :key="item.categoryId" >
            <div class="inner" v-if="item.list.length>0">
                <ModelTitle :title="item.categoryName" :info="item.info"></ModelTitle>
                <div class="modelBody modelBody2">
                    <ul>
                        <li v-for="(Citem) in item.list" :key="Citem.id" @click="roterGo(Citem)">
                            <ModelCourse :liData="Citem" />
                        </li>
                        <li class="text_item" style="height:100px;width:100%" v-if="item.list.length==0">未查询到课程</li>
                    </ul>
                    
                    <div class="btnMore" @click="btnMore(item)">查看更多学习视频</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Banner from "../../../components/Banner.vue";
    import ModelTitle from "../../../components/ModelTitle.vue";
    import ModelLi from "../../../components/ModelLi.vue";
    import ModelLiTime from "../../../components/ModelLiTime.vue";
    import ModelCourse from "../../../components/ModelCourse.vue";

    import {isIE,formatDuring} from "../../../utils/tool.js"
    
    export default {
        data() {
            return {
                // banner参数
                bannerSrc:require("@/assets/images/index/banner.jpg"),
                bannerStyle:{
                    background:'linear-gradient(90deg,#57B3F9 10%, #3E85FB 90%)'
                },
                // 课程数据
                arrData:[],
            };
        },
        components: {
            Banner,ModelTitle,ModelLi,ModelCourse,ModelLiTime
        },
        watch: {},
        computed: {
            
        },
        methods: {
            roterGo(item){
                this.$router.push({path:`/details/${item.id}`})
                return;
                let routeData = this.$router.resolve({
                    path: `/details/${item.id}`
                });
                window.open(routeData.href, "_blank");
            },
            btnMore(){
                this.$router.push({path:'/allCourses'})
            },
            // 获取分类
            getTypeData(){
                this.axios.get(this.API.Classification.Categories).then(response => {
                    let data = response.data;
                    if (!data && data.length <= 0) {
                        // console.log("没数据");
                        return;
                    } else {
                        let ids = ''
                        // 初始化主分类
                        data.forEach((item,index)=>{
                            ids= `${ids}categoryIds=${item.id}${index!=data.length-1?'&':''}`;
                        })

                        this.getCouresData(ids)
                    }
                });
            },
            // 获取课程数据
            getCouresData(ids) {
                // 获取筛选课程数据
                this.$loading.show()
                this.axios.post(this.API.Course.indexList+'?'+ids+'&currentPage=1&pageSize=4').then(response=>{
                    // console.log(response.data)
                    if(!response.data){
                        this.$loading.hide()
                        this.$Message.error('请求异常，请重试')
                        return;
                    }
                    let data = response.data.map(item => {
                        return{
                            ...item,
                            info:item.categoryDescribe||item.categoryName,
                            list:item.courseList.map(cItem=>{
                                let urlCover = cItem.courseCoverUrl?(cItem.courseCoverUrl.indexOf("://") > -1
                                ? cItem.courseCoverUrl : this.PICURL + cItem.courseCoverUrl ) :require("@/assets/images/defaultPic/courseCover.jpg")
                                return{
                                    categoryId:cItem.categoryId, // 分类id
                                    name: cItem.courseName, // 课程名称
                                    id:cItem.id, // 课程id
                                    grade: cItem.courseGrade, // 等级
                                    evaluate: cItem.evaluateCount || 0, // 评价数量
                                    peopleNub: cItem.courseUserCount || 0, // 购买数量
                                    price: cItem.coursePrice, // 单价
                                    countDown: formatDuring(  new Date(cItem.discountEndTime).getTime() - new Date().getTime(),'dd:hh:mm'), // 倒计时
                                    coverSrc:urlCover,  // 课程封面 
                                    courseCoverUrl:cItem.courseCoverUrl,
                                    teacherName:cItem.teacherName // 老师名
                                }
                            })
                        }
                    })
                    this.arrData = data;
                    this.$loading.hide()
                }).catch( error=>{
                    this.$loading.hide()
                })
            },
        },
        created() {
           this.getTypeData();
        },
        mounted() {}
}

</script>
<style lang='less' scoped>
    .model{
        min-width: 1200px;
        padding-bottom: 70px;
        .inner{
            width:1200px;
            margin:0 auto;
            .modelBody1{
                ul{
                    overflow: hidden;
                    li{
                        float: left;
                        width:275px;
                        margin-right: 33.33px;
                        cursor: pointer;
                        &:last-child{
                            margin-right: 0;
                        }
                    }
                }
            }
            .modelBody2{
                ul{
                    display: flex;
                    flex-wrap: wrap;
                    li{
                        float: left;width:275px;margin-right: 33.33px;margin-bottom: 50px; cursor: pointer;
                        &:nth-child(4n){margin-right: 0;}
                    }
                }
                .btnMore{
                    width:260px;height:54px;border-radius: 28px;border:1px solid #1887ff;text-align: center;line-height: 54px;color:#1887ff;font-size: 18px;letter-spacing: 2px;cursor: pointer;margin:0 auto;
                }
            }
        }
        &.modelColor{background: #F6F6F7;}
    }
</style>