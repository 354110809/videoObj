<template>
    <div class="banner" :style="bannerStyle">
        <img :src="bannerImgSrc" alt="">
    </div>
</template>

<script>
    export default {
        props: ['bannerImgSrc','bannerStyle'],
        data() {
            return {
            };
        },
        methods: {},
    }
</script>
<style lang="less" scoped>
    .banner{
        width:100%;height:495px;min-width: 1200px;overflow: hidden;
    }
    .banner img{
        position: relative;left:50%;transform: translate(-50%,0);
    }
</style>