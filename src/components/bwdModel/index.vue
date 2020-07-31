<template>
    <div class="bwd-model" v-if="show">
        <div class='bwd-model-inner' :style="textStyle" v-html="text"></div>
    </div>
</template>

<script>
    export default {
        props: {
            show: {
                type: Boolean
            },
            text: {
                type: String,
                default: ""
            },
            textStyle:{
                type:Object
            }
        }
    }
</script>
<style lang='less' scoped>
    .bwd-model{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index:10000;
        background: rgba(0, 0, 0, 0.3);
        transition: all .5s 0s;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select:none;
    }
</style>