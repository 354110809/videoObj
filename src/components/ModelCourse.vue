<template>
    <div class="modelLiBox">
        <div class="topPic" :class="{noCover:!liData.courseCoverUrl}">
            <img :src="liData.coverSrc" />
        </div>
        <div class="info" :title="liData.name">{{liData.name}}</div>
        <div class="lecturer">主讲老师：{{liData.teacherName}}</div>
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
        transition: all 0.3s 0s;
        &:hover{
            transform: scale(1.1);
        }
        .topPic{
            width:100%;height:148px;border-radius: 10px;overflow: hidden;margin-bottom: 10px;background:#E8E8E8;
            display: flex;justify-content:center;align-items: center;
            img{
                max-width:100%;
            }
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
        .lecturer{
            padding:5px;font-size:16px;color:#7F7E7E;line-height:20px;overflow: hidden;
        }
    }
</style>