<template>
    <div class="allCouressPage">
        <div class="inner">
            <div class="screenBox">
                <div class="CouressType">
                    <ul>
                        <li
                            class="cup"
                            :class="{cur:item.isShow}"
                            v-for="(item,index) in CouressTypelist"
                            :key="index"
                            @click="OnCouressType(item,1)"
                        >{{item.name}}</li>
                    </ul>
                </div>
                <div class="CouressSamllType">
                    <ul>
                        <li
                            class="cup"
                            :class="{cur:item.isShow}"
                            v-for="(item,index) in CouressSamllTypeList"
                            :key="index"
                            @click="OnCouressType(item,2)"
                        >{{item.name}}</li>
                    </ul>
                </div>
            </div>
            <div class="listBox">
                <div class="sortBox" v-if="false">
                    <p>默认排序</p>
                    <p>最新</p>
                    <p>销量</p>
                    <p>公开课</p>
                </div>
                <div>
                    <ul v-if="arrData.length>0">
                        <li
                            class="cup"
                            v-for="(item , index) in arrData"
                            :key="index"
                            @click="roterGo(item)"
                        >
                            <ModelLi :lisStatus="'2'" :liData="item" />
                        </li>
                    </ul>
                    <div class="text_item" v-else>
                        <img src="../../../assets/images/defaultPic/listNot.png" alt="">
                    </div>
                    <Page class='pageAllCoures' v-if="SearchData.pageTotalSize>SearchData.pageSize" :page-size="SearchData.pageSize" :total="SearchData.pageTotalSize" prev-text="上一页" next-text="下一页" @on-change="getPageData" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ModelLi from "../../../components/ModelLi.vue";
import {isIE,formatDuring} from "../../../utils/tool.js"
import { mapActions } from "vuex"
export default {
    components: { ModelLi },
    data() {
        return {
            // 主课程列数据
            CouressTypelist: [],
            // 课程小类型
            CouressSamllTypeList: [],
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
                pageSize:12,      // 当前页数量
                pageTotalSize:0      // 当前页数量
            }
        };
    },
    watch: {
        searchText:function(o,n){
            let than = this;
            than.SearchData.courseName = o;
            than.SearchData.currentPage = 1;
            than.SearchData.pageTotalSize = 0;
            than.getCourseSearchData()
        }
    },
    computed: {
        searchText(){
            return this.$store.state.search.searchText
        },
    },
    methods: {
        // 课程类型切换
        OnCouressType(_item, val) {
            if (_item.isShow) return;
            (val == 1
                ? this.CouressTypelist
                : this.CouressSamllTypeList
            ).forEach((item, index) => {
                if (item.name == _item.name) {
                    item.isShow = true;
                    if (val == 1) {
                        // console.log("可以发送请求:主类型");
                        if(item.id == -1){
                            this.initSamllTypeList(this.CouressTypelist,-1)
                            this.SearchData.categoryId = '';
                        }else{
                            this.initSamllTypeList(_item.children,0)
                            this.SearchData.categoryId = item.id;
                        }
                    } else {
                        // console.log("可以发送请求:子类型");
                        if(item.id == -1){
                            let resultIndex = this.CouressTypelist.findIndex( citem => citem.isShow )
                            this.SearchData.categoryId = this.CouressTypelist[resultIndex].id;
                        }else{
                            this.SearchData.categoryId = item.id ;
                        }
                        
                    }
                    this.SearchData.currentPage = 1;
                    this.SearchData.pageTotalSize = 0;
                    this.getCourseSearchData()
                } else {
                    item.isShow = false;
                }
            });
        },
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
            this.$router.push({path:`/details/${item.id}`})
            return;
            let routeData = this.$router.resolve({
                path: `/details/${item.id}`
            });
            window.open(routeData.href, "_blank");
        },
        // 获取分类
        getTypeData(){
            this.axios.get(this.API.Classification.Categories).then(response => {
                let data = response.data;
                if (!data && data.length <= 0) {
                    // console.log("没数据");
                    return;
                } else {
                    // 初始化主分类
                    let CouressTypelist = data.map(item=>{
                        return{
                            name:item.categoryName,
                            id:item.id,
                            isShow:false,
                            children:item.children
                        }
                    })
                    CouressTypelist.unshift({
                        name:'全部',
                        id:-1,
                        isShow:true,
                        children:[]
                    })
                    this.CouressTypelist = CouressTypelist;

                    this.initSamllTypeList(data,-1)
                }
            })
        },
        // 过滤子分类数据
        initSamllTypeList(data,val){
            // 初始化子分类
            // if(this.Utils.isIE()){
                // result = this.Utils.flattenT(this.dataSource)
            // }else{
            let result = val == -1 ? data.map(item => item.children).flat(Infinity) : data ;
            // }
            let CouressSamllTypeList = result.map(item=>{
                return{
                    name:item.categoryName||item.name,
                    id:item.id,
                    isShow:false
                }
            })
            CouressSamllTypeList.unshift({
                name:'不限',
                id:-1,
                isShow:true
            })
            this.CouressSamllTypeList = CouressSamllTypeList;
        },
        // 获取筛选课程数据
        getCourseSearchData(){
            this.$loading.show()
            let param = this.SearchData;
            this.axios.post(this.API.Course.Search,param,{
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(response=>{
                // console.log(response.data)
                if(!response.data){
                    this.$loading.hide()
                    this.$Message.error('请求异常，请重试')
                    return;
                }
                let data = response.data.records.map(item=>{
                    let urlCover = item.courseCoverUrl?(item.courseCoverUrl.indexOf("://") > -1
                                ? item.courseCoverUrl : this.PICURL + item.courseCoverUrl ) :require("@/assets/images/defaultPic/courseCover.jpg")
                    return{
                        categoryId:item.categoryId, // 分类id
                        name: item.courseName, // 课程名称
                        id:item.id, // 课程id
                        grade: item.courseGrade, // 等级
                        evaluate: item.evaluateCount || 0, // 评价数量
                        peopleNub: item.courseUserCount || 0, // 购买数量
                        price: item.coursePrice, // 单价
                        countDown: formatDuring(  new Date(item.discountEndTime).getTime() - new Date().getTime(),'dd:hh:mm'), // 倒计时
                        coverSrc:urlCover,  // 课程封面 
                        courseCoverUrl:item.courseCoverUrl
                    }
                });
                this.SearchData.pageTotalSize = response.data.total
                this.arrData = data;
                this.$loading.hide()
            }).catch(error=>{
                this.$loading.hide()
            })
        },
        ...mapActions([])
    },
    created() {
        if(this.$route.params.isSearch){
            this.SearchData.courseName = this.searchText;
        }
    },
    mounted() {
        // 获取分类
        this.getTypeData();
        // 初始化获取课程数据
        this.getCourseSearchData()
    }
};
</script>
<style lang='less' scoped>
.allCouressPage {
    padding: 40px 0;
    .inner {
        width: 1200px;
        margin: 0 auto;
        .CouressType {
            margin-bottom: 40px;
            font-size: 16px;
            ul {
                display: flex;
                flex-wrap: wrap;
                li {
                    margin-right: 30px;
                    padding: 5px 8px;
                    position: relative;
                    font-weight: 500;
                    color: #585858;
                    &.cur {
                        color: #ec209a;
                        &.cur:after {
                            content: "";
                            width: 20px;
                            height: 2px;
                            background: #ec209a;
                            position: absolute;
                            bottom: 0;
                            left: 50%;
                            margin-left: -10px;
                        }
                    }
                }
            }
        }
        .CouressSamllType {
            margin-bottom: 15px;
            border-bottom: 1px solid #dedeee;
            padding-bottom: 20px;
            min-height: 60px;
            ul {
                display: flex;
                flex-wrap: wrap;
                position: relative;
                padding-left: 80px;
                li {
                    padding: 4px 10px;
                    margin-right: 40px;
                    margin-bottom: 10px;
                    &:nth-child(1) {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    &.cur {
                        background: #ff6ab7;
                        border-radius: 4px;
                        color: #fff;
                    }
                }
            }
        }
        .sortBox{
            padding:10px 0 20px;
            display: flex;
            p{
                background: #585858;
                margin-right:16px;
                cursor: pointer;
                padding:3px 10px;
                color:#fff;
                font-size: 14px;
                border-radius:20px ;
            }
        }
        .listBox {
            min-height: 400px;
            ul {
                display: flex;
                flex-wrap: wrap;
                li {
                    width: 275px;
                    margin-right: 33.33px;
                    margin-bottom: 50px;
                    &:nth-child(4n) {
                        margin-right: 0;
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
        }
    }
}
</style>