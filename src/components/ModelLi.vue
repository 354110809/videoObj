<template>
    <div class="modelLiBox">
        <div class="topPic" :class="{noCover:!liData.courseCoverUrl}">
            <img :src="liData.coverSrc" />
        </div>
        <div class="info" :title="liData.name">{{liData.name}}</div>
        <div class="levelevaluate">
            <p>{{liData.grade}}</p>
            <p><span></span> {{liData.evaluate}}</p>
            <!-- <p>{{liData.peopleNub}}评价</p> -->
        </div>
        <div class="timePrice" :class="{cur:lisStatus==2}">
            <span class="price">￥{{liData.price}}</span>
            <span v-if="liData.countDown" class="time">限时优惠 {{liData.countDown}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            liData: Object,
            lisStatus: {
                type: String,
                default: '1'
            },
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>
<style lang='less' scoped>
    .modelLiBox {
        transition: all .3s 0s;
        .topPic{
            width:100%;height:155px;border-radius: 10px;overflow: hidden;margin-bottom: 10px;
            display: flex;
            justify-content: center;align-items: center;background: #E8E8E8;
            img{width:100%;height:100%;}
            &.noCover{
                img{width:130px;height:130px;}
            }
        }
        .info{
            padding:5px; font-size:20px;font-weight:400;color:#2F2F2F;line-height:26px;height:60px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .levelevaluate{
            padding:5px;font-size:14px;font-weight:300;color:#7F7E7E;line-height:20px;overflow: hidden;
            p{
                float: left;padding-right:20px;
                span{display: inline-block;width: 10px;height:12px;background:url(../assets/images/icon/people.png) no-repeat center/100% auto;}
                &:last-child{float: right;padding-right: 0;}
            }
        }
        .timePrice{
            color:#FF0A0A;font-weight: bold;font-size: 14px;padding:5px;
            display: flex;
            justify-content: space-between;
            &.cur{
                color:#989898;
                .price{
                    color:#656565;
                }
            }
        }
        .price{padding-right: 10px;}
        &:hover{
            transform: scale(1.1);
        }
    }
</style>