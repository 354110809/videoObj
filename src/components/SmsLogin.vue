<template>
    <div class="registerPageSms" :style="pageStyle" v-if="isModel">
        <div class="inner">
            <Icon type="md-close"  class="close cup"  @click="onClose"/>
            <h6>短信验证码登录</h6>
            <p class="lineBox">
                <input class="phonenumber" :class="{focus:userData.isPhone}" maxlength="11" v-model="userData.phonenumber" placeholder="请输入手机号" @focus="inputFocus(1)" @blur="inputBlur(1)">
                <span class="tip" v-if="userData.isPhoneError">请输入正确的手机号！</span>
            </p>
            <p class="lineBox ts">
                <input  class="code" :class="{focus:userData.isCode}" v-model="userData.code" maxlength="6" type="text" placeholder="请输入验证码" @focus="inputFocus(3)" @blur="inputBlur(3)">
                <span class="btn cup" @click="getCodeFun">{{codeBtnStr}}</span>
                <span class="tip" v-if="userData.isCodeError">请输入验证码</span>
            </p>
            <p class="clo">提示：短信验证码5分钟内有效! </p>
            <div class="lineBox">
                <p class="btn cup" @click="loginBtnFun">登 录</p>
            </div>
            <p class="lineBoxFor">
                <!-- <Checkbox v-model="isChecked">10天免登陆</Checkbox> -->
                <!-- <span class="cup" @click="btnGoLogin">去登录<Icon type="ios-arrow-forward" /></span> -->
            </p>
        </div>
    </div>
</template>

<script>
import { PhoneNumberValidation  } from '../utils/verification'

import { mapActions } from "vuex"

var countDownTime = null;
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

                code:null, // 验证码
                isCode:false, // 是否验证码
                isCodeError:false, // 验证码是否错误
            },
            // 获取验证码按钮状态
            codeBtnStatus:true,
            // 获取验证码按钮文案
            codeBtnStr:'获取验证码',
            // 是否选中10天免登录
            isChecked:true
        };
    },
    watch: {},
    methods: {
        // 关闭窗口
        onClose(){
            this.$emit('close',false)
            // 重置data数据
            /**  this.$data 获取当前状态下的data  **/
            /** this.$options.data() 获取该组件初始状态下的data **/
            Object.assign(this.$data, this.$options.data())
            window.clearTimeout(countDownTime)
            // 销毁回车事件
            this.enterKeydownDestroyed();
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
                case 3: // 验证码
                    this.userData.isCode = false
                    break;
                default:
                    // console.log("你点的啥")
            }
        },
        inputFocus(val){
            switch (val) {
                case 1: // 手机号
                    this.userData.isPhone = true
                    this.userData.isPhoneError = false;
                    break;
                case 3: // 验证码
                    this.userData.isCode = true
                    this.userData.isCodeError = false;
                    break;
                default:
                    // console.log("你点的啥")
            }
        },
        // 获取验证码
        getCodeFun(){
            this.$Message.destroy()
            if(!this.codeBtnStatus){
                this.$Message.warning(`请${this.codeBtnStr}秒后再试`);
                return;
            }
            if( !PhoneNumberValidation(this.userData.phonenumber) ){
                this.userData.isPhoneError = true;
                this.$Message.error('请输入正确的手机号！');
                return;
            }
            // 获取验证码
            this.codeBtnStatus = false;
            this.codeBtnStr = 60;
            this.countDownFun()
            this.axios.get( this.API.user.getCode+'='+this.userData.phonenumber).then(response => {
                if( response.data == 'success' || typeof response.data == 'number'){
                    this.$Message.success({ 
                        content:'验证码已发送',
                        duration:2
                    });
                }else{
                    this.$Message.error({ 
                        content:response.data,
                        duration:3
                    });
                }
            }).catch(error => {
                console.log(error);
                this.$Message.error({ 
                    content:error.message.errorMsg,
                    duration:3
                });
            });
        },
        // 倒计时
        countDownFun(){
            window.clearTimeout(countDownTime)
            countDownTime = setTimeout(()=>{
                if( this.codeBtnStr != 0 ){
                    this.codeBtnStr--;
                    this.countDownFun()
                }else{
                    this.codeBtnStr='获取验证码';
                    this.codeBtnStatus = true;
                }
            },1000)
        },
        // 登录按钮事件
        loginBtnFun(){
            this.$Message.destroy()
            if( !PhoneNumberValidation(this.userData.phonenumber) ){
                this.userData.isPhoneError = true;
                this.$Message.error('请输入正确的手机号！');
                return;
            }
            if( !this.userData.code || this.userData.code.length < 6){
                this.userData.isCodeError = true;
                this.$Message.error('请输入验证码');
                return;
            }
            this.$loading.show('正在加载中...');
            let param = {
                account:this.userData.phonenumber,
                password:this.userData.code,
                type:'smsCode',
                MemoryLogin: this.isChecked
            }
            this.Login(param).then((res) => {
                // console.log(res)
                this.$loading.hide()
                if( res.status!= 200 ){
                    this.$Message.error({ 
                        content:res.message,
                        duration:3
                    });
                    return;
                }
                this.onClose()
            }).catch(error=>{
                console.log(error)
                this.$loading.hide()
                this.$Message.error({ 
                    content:error.message.errorMsg,
                    duration:3
                });
            })
        },
        // 监听登录按钮回车事件
        enterKey() {
            let than = this;
            var key = window.event.keyCode;
            if (key == 13) {
                than.loginBtnFun();
            }
        },
        // 添加监听事件
        AddEnterKeydownDestroyed(){
            document.addEventListener("keydown", this.enterKey);
        },
        // 销毁回车事件
        enterKeydownDestroyed() {
            document.removeEventListener("keydown", this.enterKey);
        },
        ...mapActions([
            'Login'
        ])
    },
    created() {
        
    },
    mounted() {
    }
};
</script>
<style lang='less' scoped>
.registerPageSms {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    .inner {
        width: 440px;
        height: 350px;
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
            position: relative;
            .tip{
                position: absolute;
                bottom: -6px;
                left: 30px;
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
                user-select:none;
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
        .clo{
            color:#f7ba08;
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