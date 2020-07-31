<template>
    <div class="myCoursePage">
        <div class="inner">
            <div class="listBox">
                <div>
                    <ul v-if="arrData.length>0">
                        <li class="cup" v-for="(item , index) in arrData" :key="index" @click="roterGo(item)" >
                            <ModelLiMy :liData="item" />
                        </li>
                    </ul>
                    <div class="text_item" v-else>
                        <img src="../../../assets/images/defaultPic/listNot.png" alt="">
                    </div>
                    <Page class='pageAllCoures' v-if="SearchData.pageTotalSize>SearchData.pageSize" :page-size="SearchData.pageSize"  :total="SearchData.pageTotalSize" prev-text="上一页" next-text="下一页" @on-change="getPageData" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ModelLiMy from "../../../components/ModelLiMy.vue";
import {isIE,formatDuring} from "../../../utils/tool.js"
import { mapActions } from "vuex"
export default {
    components: { ModelLiMy },
    data() {
        return {
            // 列表数据
            arrData: [],
            // 查询列表条件数据
            SearchData:{
                categoryId:'',  // 分类id
                courseGrade:'', // 课程级别
                courseName:'',  // 课程名称
                id:'',          // 编号
                teacherId:'',   // 教师id
                currentPage:1,  // 当前页
                pageSize:8,      // 当前页数量
                pageTotalSize:0      // 当前页数量
            }
        };
    },
    computed: {
        userInfo () {
            return this.$store.state.user.info
        },
    },
    methods: {
        // 获取分页数据
        getPageData(page) {
            this.SearchData.currentPage = page;
            this.getCourseSearchData()
            $('html').animate(
                { scrollTop: 0 }, 300
            );
        },
        // 查看详情
        roterGo(item){
            this.$router.push({path:`/studyPlay/${item.id}/${item.name}`})
            return;
            let routeData = this.$router.resolve({
                path:`/studyPlay/${item.id}/${item.name}`
            });
            window.open(routeData.href, "_blank");
        },
        // 获取筛选课程数据
        getCourseSearchData(){
            this.$loading.show()
            this.GetToken().then((TOKEN) => {
                if(TOKEN == '已离线'){
                    this.$Message.warning({content:'用户已离线',onClose:()=>{
                        this.$router.push({path:'/'})
                    }})
                    return;
                }
                let UID = this.userInfo.id || this.$ls.get('User-Info').id
                this.axios.get(this.API.Course.UserId(UID),{
                        params: {
                            currentPage: this.SearchData.currentPage,
                            pageSize:this.SearchData.pageSize
                        },
                        headers:{
                            Authorization:this.$ls.get('Token')
                        }
                    }).then(response=>{
                    // console.log(response.data)
                    if(!response.data){
                        this.$loading.hide()
                        this.$Message.error('请求异常，请重试')
                        return;
                    }
                    let data = response.data.records.map((item,index)=>{
                        let urlCover = item.courseCoverUrl?(item.courseCoverUrl.indexOf("://") > -1
                                ? item.courseCoverUrl : this.PICURL + item.courseCoverUrl ) :require("@/assets/images/defaultPic/courseCover.jpg")
                        return{
                            studyProgress:(item.courseLearnedTime/1000/60/60).toFixed(2) || 0, // 学习的进度
                            totalProgress: (item.courseTotalTime/60/60).toFixed(2) || 0, // 课程总进度
                            categoryId:item.categoryId, // 分类id
                            name: item.courseName, // 课程名称
                            id:item.id, // 课程id
                            grade: item.courseGrade, // 等级
                            evaluate: item.evaluateCount || 0, // 评价数量
                            peopleNub: item.courseUserCount || 0, // 购买数量
                            price: item.coursePrice, // 单价
                            countDown: formatDuring(  new Date(item.discountEndTime).getTime() - new Date().getTime(),'dd:hh:mm'), // 倒计时
                            coverSrc:urlCover,
                            courseCoverUrl:item.courseCoverUrl
                        }
                    });
                    // console.log(data)
                    this.SearchData.pageTotalSize = response.data.total;
                    this.arrData = data;
                    this.$loading.hide()
                })
            })
        },
        ...mapActions([
            'GetToken',
        ])
    },
    created() {

    },
    mounted() {
        // 初始化获取课程数据
        this.getCourseSearchData()
    }
};
</script>
<style lang='less' scoped>
.myCoursePage {
    padding: 40px 0;
    background: #f6f8fb;
    // background: #EEEFF0;
    .inner {
        width: 1200px;
        margin: 0 auto;
        .listBox {
            min-height: 500px;
            ul {
                margin-bottom: 50px;
                display: flex;
                flex-wrap: wrap;
                li {
                    width: 275px;
                    margin-right: 33.33px;
                    margin-bottom: 50px;
                    &:nth-child(4n) {
                        margin-right: 0;
                    }
                    &:nth-child(n + 5) {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .pageAllCoures{
            display: flex;
            justify-content: center;
            /deep/.ivu-page-item{
                border:none;
                color:#585858;
                margin-right: 15px;
                border-radius: 50%;
                a {
                    height:100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                &:focus a,
                &:hover a {
                    color: #c73e7f;
                }
            }
            /deep/.ivu-page-item-active {
                background: #585858;
                a,
                &:focus a,
                &:hover a { 
                    color:#fff;
                }
            }
            /deep/.ivu-page-prev,
            /deep/.ivu-page-jump-prev,
            /deep/.ivu-page-jump-next {
                margin-right: 15px;
                
            }
            /deep/.ivu-page-next,
            /deep/.ivu-page-prev {
                background:none;
            }
        }
    }
}
</style>