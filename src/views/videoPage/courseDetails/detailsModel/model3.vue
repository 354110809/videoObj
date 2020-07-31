<template>
    <div class="xueyuanpingjiaPage">
        <div class="pingjiaBox" v-for="item in 6" :key="item">
            <div class="pingjia-user">
                <div class="user-pic"><img src="" alt=""></div>
                <div class="user-text"><p>用户昵称昵称</p><span class="span1">🌹</span> <span class="span2">好评</span></div>
            </div>
            <div class="pingjia-info">
                <p>评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1评价内容1</p>
                <!-- <p>课程非常好我很喜欢，你嫩评价内容2评价内容1评价内容1评价内容1评价内容1评价内容1</p> -->
            </div>
        </div>
        <wangeditor :catchData="sw"></wangeditor>
    </div>
</template>
<script>
    import wangeditor from "../../../../components/wangeditor.vue"
    export default {
        data() {
            return {
            };
        },
        components:{
            wangeditor
        },
        created() {},
        mounted() {
            
        },
        methods:{
            sw(ss){
                console.log(ss)
            }
        }
    }
</script>
<style lang='less' scoped>
    .xueyuanpingjiaPage{
        padding:10px 20px;
        .pingjiaBox{
            padding:10px 0 25px;
            // border-bottom:1px dashed rgba(223, 223, 223, 0.8);
            &:last-child{
                border:none;
            }
        }
        .pingjia-user{
            display: flex;
            margin-bottom: 5px;
            .user-pic{
                width:52px;
                height:52px;
                border:2px solid yellow;
                border-radius: 50%;
                margin-right: 20px;
                overflow: hidden;
                img{
                    width:100%;
                    height:100%;
                    background: red;;
                }
            }
            .user-text{
                border-bottom:1px solid #f0f0f0;
                flex-grow: 1;
                display: flex;
                align-items: center;
                p{
                    margin-right: 10px;
                    font-size: 16px;
                }
                .span1{
                    margin-right: 10px;
                }
                .span2{
                    color:#666;
                    font-size: 14px;
                }
            }
        }
        .pingjia-info{
            padding-left:75px;
            p{
                font-size: 14px;
                color:#333;
                padding: 10px 0;
                border-bottom:1px dashed #f0f0f0;
                &:last-child{
                    border:none;
                }
            }
        }
    }
</style>