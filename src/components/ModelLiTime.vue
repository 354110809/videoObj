<template>
    <div class="modelLiBox">
        <div class="topPic">
            <img
                class="bTu"
                src="https://10.url.cn/qqcourse_logo_ng/ajNVdqHZLLBIrRnNNmJyKNic87jnPL2C7QLy1tLO79crib8Id3wribOC1cKdl5NnjBhwfgGhnxciafY/356"
            />
            <div>
                <p>直播 5/22 22:00</p>
            </div>
        </div>
        <div class="lecturer">马士兵老师</div>
        <div class="info">最贴合企业级需求的java基础 课程，向上有</div>
    </div>
</template>

<script>
export default {
    props: {
        liData: Object,
    },
    data() {
        return {};
    },
    methods: {}
};
</script>
<style lang='less' scoped>
.modelLiBox {
    .topPic {
        width: 100%;
        height: 148px;
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 10px;
        .bTu {
            background: rgb(76, 73, 212);
            width: 100%;
            height: 100%;
        }
        div {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .lecturer {
        padding: 5px;
        font-size: 20px;
        font-weight: 400;
        color: #2f2f2f;
        line-height: 26px;
        height: 36px;
    }
    .info {
        padding: 5px;
        font-size: 16px;
        color: #7f7e7e;
        line-height: 20px;
        overflow: hidden;
    }
}
</style>