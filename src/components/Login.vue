<template>
    <div class="loginPage" :style="pageStyle" v-if="isModel">
        <div class="inner">
            <Icon type="md-close"  class="close cup"  @click="onClose"/>
            <Tabs value="mobile" class="modelBox"  @on-click="callback">
                <TabPane label="手机号登录" name="mobile">
                    <p class="lineBox">
                        <input class="phonenumber" :class="{focus:userData.isPhone}" maxlength="11" v-model="userData.phonenumber" placeholder="请输入手机号" @focus="inputFocus(1)" @blur="inputBlur(1)">
                        <span v-if="userData.isPhoneError">请输入正确的手机号！</span>
                    </p>
                    <p class="lineBox">
                        <input class="password" :class="{focus:userData.isPassword}"  v-model="userData.password" placeholder="请输入密码" type="password" @focus="inputFocus(2)" @blur="inputBlur(2)">
                        <span v-if="userData.isPasswordError">请输入正确的密码！</span>
                    </p>
                    <div class="lineBox">
                        <p class="btn cup" @click="loginBtn(1)">登 录</p>
                    </div>

                    <p class="lineBoxFor">
                        <Checkbox >10天免登陆</Checkbox>
                        <a class="login-form-forgot" href>忘记密码</a>
                        <span class="cup" @click="btnGoRegister">去注册<Icon type="ios-arrow-forward" /></span>
                    </p>

                    <div class="lineBoxFor p20">
                        <p class="smsLogin"><span class="cup" @click="btnGoSmsLogin">短信验证码登录</span></p>
                        <p class="externalLogin">
                            <span class="wx log cup"></span>
                            <span class="qq log cup"></span>
                            <span class="xl log cup"></span>
                        </p>
                    </div>
                </TabPane>
                <TabPane label="邮箱登录" name="email">
                    <p class="lineBox">
                        <input class="email" :class="{focus:userData.isEmail}" v-model="userData.email" placeholder="请输入常用邮箱" @focus="inputFocus(3)" @blur="inputBlur(3)">
                        <span v-if="userData.isEmailError">请输入正确的邮箱账号！</span>
                    </p>
                    <p class="lineBox">
                        <input class="emailpassword" :class="{focus:userData.isEmailPassword}"  v-model="userData.emailPassword" placeholder="请输入密码" type="password" @focus="inputFocus(4)" @blur="inputBlur(4)">
                        <span v-if="userData.isEmailPasswordError">请输入正确的密码！</span>
                    </p>
                    <div class="lineBox">
                        <p class="btn cup" @click="loginBtn(2)">登 录</p>
                    </div>

                    <p class="lineBoxFor">
                        <Checkbox >10天免登陆</Checkbox>
                        <a class="login-form-forgot" href>忘记密码</a>
                        <span class="cup" @click="btnGoRegister">去注册<Icon type="ios-arrow-forward" /></span>
                    </p>

                    <div class="lineBoxFor p20">
                        <p class="smsLogin"><span class="cup" @click="btnGoSmsLogin">短信验证码登录</span></p>
                        <p class="externalLogin">
                            <span class="wx log cup"></span>
                            <span class="qq log cup"></span>
                            <span class="xl log cup"></span>
                        </p>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
import { PhoneNumberValidation , EmailValidation } from '../utils/verification'
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
                isPhone:false, // 是否手机号 选中
                isPhoneError:false, // 手机号是否错误

                password:null, // 密码
                isPassword:false, // 是否密码 选中
                isPasswordError:false, // 手机号是否错误

                email:null, // 邮箱
                isEmail:false, // 是否邮箱 选中
                isEmailError:false, // 邮箱是否错误

                emailPassword:null, // 邮箱密码
                isEmailPassword:false, // 是否邮箱密码 选中
                isEmailPasswordError:false, // 邮箱密码是否错误
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
        // 去注册
        btnGoRegister(){
            this.$emit('switchBtn',2)
        },
        // 去短信验证码登录
        btnGoSmsLogin(){
            this.$emit('switchBtn',3)
        },
        // 切换登录方式
        callback(key) {
            this.loginMethod = key
        },
        // 输入框失去焦点
        inputBlur(val){
            switch (val) {
                case 1: // 手机号
                    this.userData.isPhone = false
                    break;
                case 2: // 密码
                    this.userData.isPassword = false
                    break;
                case 3: // 邮箱账号
                    this.userData.isEmail = false
                    break;
                case 4: // 邮箱密码
                    this.userData.isEmailPassword = false
                    break;
                default:
                    console.log("你点的啥")
            }
        },
        // 输入框获取焦点
        inputFocus(val){
            switch (val) {
                case 1: // 手机号
                    this.userData.isPhone = true;
                    this.userData.isPhoneError = false;
                    break;
                case 2: // 密码
                    this.userData.isPassword = true
                    break;
                case 3: // 邮箱账号
                    this.userData.isEmail = true
                    this.userData.isEmailError = false;
                    break;
                case 4: // 邮箱密码
                    this.userData.isEmailPassword = true
                    break;
                default:
                    console.log("你点的啥")
            }
        },
        // 登录按钮事件
        loginBtn(val){
            this.$message.destroy()
            if(val == 1){
                /* 手机号登录 */ 

                // 手机号
                if( !PhoneNumberValidation( this.userData.phonenumber ) ){
                    this.userData.isPhoneError = true;
                    this.$message.error('请输入正确的手机号！');
                    return;
                }
                // 密码
                if( !this.userData.password ){
                    this.userData.isPasswordError = true;
                    this.$message.error('请输入密码！');
                    return;
                }
            }else if(val == 2){
                /* 邮箱登录 */ 

                // 邮箱号
                if( !EmailValidation( this.userData.email ) ){
                    this.userData.isEmailError = true;
                    this.$message.error('请输入正确的邮箱！');
                    return;
                }
                // 密码
                if( !this.userData.password ){
                    this.userData.isPasswordError = true;
                    this.$message.error('请输入密码！');
                    return;
                }
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
.loginPage {
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
        padding:20px 40px;
        position: relative;
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
        .modelBox {
            /deep/.ivu-tabs-nav {
                width: 100%;
                padding: 0;
                .ivu-tabs-tab {
                    width: 50%;
                    margin: 0;
                    text-align: center;
                    color: #585858;
                    font-size: 18px;
                    &.ivu-tabs-tab-active {
                        color: #3887fa;
                    }
                }
                .ivu-tabs-ink-bar {
                    background: #3887fa;
                }
            }
            .lineBox{
                padding:15px 2px;
                position: relative;
                span{
                    position: absolute;
                    bottom: -6px;
                    left: 40px;
                    color: #eb2323;
                }
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
                    &.password,
                    &.emailpassword{
                        background: url(../assets/images/icon/mima2.png) no-repeat 5px center / auto 22px;
                    }
                    &.password.focus,
                    &.emailpassword.focus{
                        background: url(../assets/images/icon/mima.png) no-repeat 5px center / auto 22px;
                    }
                    &.email{
                        background: url(../assets/images/icon/youxiang2.png) no-repeat 6px center / auto 18px;
                    }
                    &.email.focus{
                        background: url(../assets/images/icon/youxiang.png) no-repeat 6px center / auto 18px;
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
            }
            .lineBoxFor{
                padding:0px 2px;
                display: flex;
                &.p20{
                    padding-top: 20px;
                }
                a{
                    position: relative;
                    padding-left:5px;
                    &::after{
                        content: '';
                        position: absolute;
                        top:50%;
                        margin-top: -5px;
                        left:-2px;
                        width:1px;
                        height:12px;
                        background: #999;
                    }
                }
                span{
                    margin-left: auto;
                    color:#3887fa;
                }
                .smsLogin{
                    width:166px;
                    height:56px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    span{
                        margin:0 ;
                    }
                    &::after{
                        content: '';
                        position: absolute;
                        top:8px;
                        right:0;
                        width:1px;
                        height:40px;
                        background: #C5CEDB;
                    }
                }
                .externalLogin{
                    flex-grow: 1;
                    padding:0 20px;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    .log{
                        width:30px;
                        height:30px;
                        background: #999999;
                        border-radius: 50%;
                        color:#fff;
                        display: block;
                        &.wx{
                            background: url("../assets/images/icon/wxtb2.png") no-repeat 0 / auto 100%;
                            &:hover{
                                background: url("../assets/images/icon/wxtb.png") no-repeat 0 / auto 100%;
                            }
                        }
                        &.qq{
                            background: url("../assets/images/icon/QQ2.png") no-repeat 0 / auto 100%;
                            &:hover{
                                background: url("../assets/images/icon/QQ.png") no-repeat 0 / auto 100%;
                            }
                        }
                        
                        &.xl{
                            background: url("../assets/images/icon/xl2.png") no-repeat 0 / auto 100%;
                            &:hover{
                                background: url("../assets/images/icon/xl.png") no-repeat 0 / auto 100%;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>