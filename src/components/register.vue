<template>
    <div class="registerPage" :style="pageStyle" v-if="isModel">
        <div class="inner">
            <Icon type="md-close"  class="close cup"  @click="onClose"/>
            <h6>手机号注册</h6>
            <p class="lineBox">
                <input class="phonenumber" :class="{focus:userData.isPhone}" maxlength="11" v-model="userData.phonenumber" placeholder="请输入手机号" @focus="inputFocus(1)" @blur="inputBlur(1)">
                <span v-if="userData.isPhoneError">清输入正确的手机号！</span>
            </p>
            <p class="lineBox">
                <input class="password" :class="{focus:userData.isPassword}"  v-model="userData.password" placeholder="请输入密码" type="password" @focus="inputFocus(2)" @blur="inputBlur(2)">
                <span v-if="userData.isPasswordError">清输入正确的密码！</span>
            </p>
            <p class="lineBox ts">
                <input  class="code" :class="{focus:userData.isCode}" v-model="userData.code" type="text" placeholder="清输入验证码" @focus="inputFocus(3)" @blur="inputBlur(3)">
                <span class="btn cup">获取验证码</span>
            </p>
            <div class="lineBox">
                <p class="btn cup">注 册</p>
            </div>
            <p class="lineBoxFor">
                <Checkbox >我同意《用户隐私手册》</Checkbox>
                <span class="cup" @click="btnGoLogin">去登录<Icon type="ios-arrow-forward" /></span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        isModel:Boolean,
        pageStyle:{
		 	 type:Object,
		 	 twoWay:true,
		 	 default:null
        }
    },
    data() {
        return {
            // 账户方式
            loginMethod:1, // 1 手机号 密码登录 2 邮箱登录
            // 用户登录数据
            userData:{
                phonenumber:null, // 手机号
                isPhone:false, // 是否手机号
                isPhoneError:false, // 手机号是否错误

                password:null, // 密码
                isPassword:false, // 是否密码
                isPasswordError:false, // 密码是否错误

                code:null, // 验证码
                isCode:false, // 是否验证码
                isCodeError:false, // 验证码是否错误
            }
        };
    },
    watch: {},
    computed: {},
    methods: {
        // 关闭窗口
        onClose(){
            this.$emit('close',false)
        },
        // 去登录
        btnGoLogin(){
            this.$emit('switchBtn',1)
        },
        inputBlur(val){
            switch (val) {
                case 1: // 手机号
                    this.userData.isPhone = false
                    break;
                case 2: // 密码
                    this.userData.isPassword = false
                    break;
                case 3: // 验证码
                    this.userData.isCode = false
                    break;
                default:
                    console.log("你点的啥")
            }
        },
        inputFocus(val){
            switch (val) {
                case 1: // 手机号
                    this.userData.isPhone = true
                    break;
                case 2: // 密码
                    this.userData.isPassword = true
                    break;
                case 3: // 验证码
                    this.userData.isCode = true
                    break;
                default:
                    console.log("你点的啥")
            }
        }
    },
    created() {

    },
    mounted() {
    }
};
</script>
<style lang='less' scoped>
.registerPage {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    .inner {
        width: 440px;
        height: 450px;
        background: #fff;
        border-radius: 10px;
        box-sizing: border-box;
        padding:30px 40px;
        position: relative;
        h6{
            color:#585858;
            font-size: 20px;
        }
        .close {
            font-size: 20px;
            position: absolute;
            top: 15px;
            right: 15px;
            color: #afafaf;
            &:hover {
                color: #585858;
            }
        }
        .lineBox{
            padding:17px 2px;
            input{
                box-sizing: border-box;
                width:100%;
                height:48px;
                line-height: 48px;
                border:1px solid #C5CEDB;
                font-size: 15px;
                border-radius: 4px;
                padding-left:34px;
                color:#666;
                &::placeholder{
                    color:#C5CEDB;
                }
                &.phonenumber{
                    background: url(../assets/images/icon/phone2.png) no-repeat 5px center / auto 22px;
                }
                &.phonenumber.focus{
                    background: url(../assets/images/icon/phone.png) no-repeat 5px center / auto 22px;
                }
                &.password{
                    background: url(../assets/images/icon/mima2.png) no-repeat 5px center / auto 22px;
                }
                &.password.focus{
                    background: url(../assets/images/icon/mima.png) no-repeat 5px center / auto 22px;
                }
                &.focus{
                    box-shadow: 0 0 3px #3887FA;
                    border-color:#3887fa99;
                }
            }
            .btn{
                box-sizing: border-box;
                width:100%;
                height:48px;
                line-height: 48px;
                border:1px solid #3887fa;
                font-size: 18px;
                border-radius: 4px;
                color:#fff;
                text-align: center;
                background:#3887fa;
            }
            &.ts{
                display: flex;
                justify-content: space-between;
                input{
                    width:247px;
                    padding-left:10px;
                }
                .btn{
                    width:98px;
                    border:1px solid #3887fa;
                    font-size: 14px;
                    color:#3887fa;
                    background:#FFF;
                }
            }
        }
        .lineBoxFor{
            padding:0px 2px;
            display: flex;
            justify-content:space-between;
            span{
                color:#3887fa;
            }
        }
    }
}
</style>