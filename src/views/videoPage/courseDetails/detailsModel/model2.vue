<template>
    <div class="kechengdagangPage">
        <div v-for="(item,index) in taskPartList" :key="index" class="catalogBox">
            <div class="task-part-hd">
                <!-- <span class="tt-prefix">0{{index+1}}</span> -->
                <h3 class="part-tt">{{index > 8 ?'':0}}{{index+1}}、{{item.chapterName}}</h3>
            </div>
            <div v-for="(than,cIndex) in item.children" :key="cIndex" class="task-part-list">
                <div class="task-part-hd">
                    <span class="tt-prefix">({{cIndex > 8 ?'':0}}{{cIndex+1}})</span>
                    <h3 class="part-tt">{{than.chapterName}}</h3>
                </div>
                <div class="task-task-list">
                    <i class="icon"></i>
                    <p class="task-tt cup" @click="onItem(than)">
                        <span class="task-tt-text">【录播】{{than.chapterDescribe}}</span>
                        <span class="tt-suffix">({{than.videoTime | time}}分钟)</span>
                    </p>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
    import { mapActions } from "vuex"
    export default {
        props: ["courseId"],
        data() {
            return {
                taskPartList:[]
            };
        },
        created() {},
        mounted() {
		    this.getCouressInfo()
        },
        filters:{
            time(value){
                let time =  (value / 60 ).toFixed(0);
                return time;
            }
        },
        methods: {
            // 获取课程目录详情
            getCouressInfo() {
                this.axios.get(this.API.Course.IdChapters(this.courseId))
                    .then(response => {
                        let data = response.data;
                        this.taskPartList = data
                    });
            },
            // 点击录播
            onItem(than){
                this.$ls.set('VIDEOINFO',{courseId:than.courseId,id:than.id})
                this.$parent.roterGo(2)
            },
            ...mapActions([
                'GetToken'
            ])
        }
    }
</script>
<style lang='less' scoped>
    .kechengdagangPage{
        .catalogBox{
            .task-part-hd{
                padding:5px 0;
                padding-left: 10px;
                display: flex;
                color: #494949;
                line-height: 28px;
                span{
                    width: 42px;
                    font-size: 20px;
                    font-weight: 700;
                }
                h3{
                    font-size: 20px;
                    font-weight:bold;
                }
            }
        }
        .task-part-list{
            margin-bottom:20px;
            padding-left:20px;
            .task-part-hd{
                color: #4c4c4c;
                span{
                    width: 42px;
                    font-size: 20px;
                    font-weight: 700;
                }
                h3{
                    font-size: 18px;
                    font-weight:700;
                }
            }
            .task-task-list{
                margin:10px 5px;
                position: relative;
                height:50px;
                padding-left: 50px;
                background: #f5f5f5;
                .icon{
                    position: absolute;
                    top:18px;
                    left:12px;
                    width:24px;
                    height:14px;
                    background:#62c5ff;
                    &:after{
                        content: '';
                        position: absolute;
                        top:3px;
                        left:10px;
                        border:4px solid rgba(0,0,0,0);
                        border-left:7px solid #fff ;
                    }
                }
                .task-tt{
                    line-height: 50px;
                    color:#333;
                }
            }
        }
    }
</style>