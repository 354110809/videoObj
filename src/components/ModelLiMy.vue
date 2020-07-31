<template>
    <div class="modelLiBox">
        <div class="topPic" :class="{noCover:!liData.courseCoverUrl}">
            <img :src="liData.coverSrc" />
        </div>
        <div class="info" :title="liData.name">{{liData.name}}</div>
        <div class="botC">
            <div class="notStudy" v-if="liData.studyProgress==0">
                开始学习
            </div>
            <div class="bar" v-else>
                <p class='ProgressBar'><span :style="{width:liData.studyProgress/liData.totalProgress*100+'%'}"></span></p>
                <p class="text">已学习 {{liData.studyProgress}}/{{liData.totalProgress}}课时</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            liData: Object
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>
<style lang='less' scoped>
    .modelLiBox {
        background: #fff;
        border-radius: 2px;
        overflow: hidden;
        box-shadow: 0 2px 5px #dedede;
        transition: all .3s 0s;
        .topPic{
            width:100%;
            height:155px;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #E8E8E8;
            img{
                width:100%;
                height:100%;
            }
            &.noCover{
                img{
                    width:130px;
                    height:130px;
                }
            }
        }
        .info{
            padding:5px 8px;
            font-size:18px;
            font-weight:400;
            color:#595A5B;
            line-height:26px;
            height:60px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .botC{
            padding:5px 0 10px;
            .notStudy{
                width:120px;
                margin:0 auto;
                border:2px solid #D6539C;
                color:#585A5B;
                height:34px;
                line-height: 30px;
                border-radius: 20px;
                text-align: center;
                cursor: pointer;
            }
            .bar{
                padding:5px 10px 0;
                .ProgressBar{
                    width:100%;
                    height:4px;
                    background:#D7D8D9;
                    span{
                        display: block;
                        height:4px;
                        background: #D34694;
                        transition: width 0.3s 0s;
                        width:0;
                        max-width: 100%;
                    }
                }
                .text{
                    padding-top:5px;
                    color:#DA4E9D;
                }
            }
        }
        &:hover{
            transform: scale(1.1);
        }
    }
</style>