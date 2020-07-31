<template>
    <div class="ProblemFeedbackPage">
        <div class="inner">
            <h4>问题反馈</h4>
            <div class="fb_32">
                <Input v-model="value17" class="textBox" maxlength="500" show-word-limit type="textarea" placeholder="请输入您在使用过程中遇到的问题"/>
                <Button class="buton" type="primary" @click="primaryFeedback">提 交</Button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                value17:''
            };
        },
        watch: {},
        computed: {
            userInfo () {
                return this.$store.state.user.info
            }
        },
        methods: {
            primaryFeedback(){

                if(this.value17.length>19){
                    this.axios.post(this.API.Chapter.Suggestion,{
                        suggestionContent:this.value17,
                        userId:this.userInfo.id || ''
                    },{
                        headers:{
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(r=>{
                        this.$Message.success('谢谢您的反馈，我们会尽快解决！');
                            setTimeout(()=>{
                                this.$router.push({path:'/'})
                            },2000)
                    }).catch(error=>{

                    })
                }else{
                    this.$Message.warning('请至少输入20个字的问题描述！');
                }
                
            }
        },
        created() {},
        mounted() {}
}

</script>
<style lang='less' scoped>
    .ProblemFeedbackPage{
        .inner{
            width:1200px;
            padding:50px;
            margin:0 auto;
            min-height: 500px;
            h4{
                font-size: 20px;
                font-weight: 500;
                margin-bottom:10px;
            }
            .fb_32{
                padding-bottom:20px;
            }
            .textBox{
                width:100%;
                margin-bottom:10px;
                /deep/textarea{
                    height:400px;
                    resize: none;
                    padding:20px;
                    font-size: 14px;
                }
                /deep/span{
                    position: absolute;
                    bottom: 10px;
                    right: 20px;
                
                }
            }
            .buton{
                width:100px;
                text-align: center;
            }
        }
    }
</style>