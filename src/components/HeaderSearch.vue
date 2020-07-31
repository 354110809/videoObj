<template>
    <div class="header" :class="{cur:$route.meta.head}">
        <div class="inner">
            <div class="log">
                <router-link to="/"><img src="../assets/images/head/logo1.png" /></router-link>
                <span class="beta"></span>
            </div>
            <div class="allCourses">
                <router-link to="/allCourses">所有课程</router-link>
            </div>
            <div class="search">
                <input type="text" placeholder="请输入课程关键字" v-model="searchVal" @keyup.enter="onSearch">
                <p @click="onSearch"><span></span>搜索</p>
            </div>
            <div class="nav-set">
                <p class="study cup" @click="onTapType('/myCourse')">我的学习</p>
                <!-- 消息 -->
                <p class="remind cup" @click="onTapType('/remind')">
                    <Icon type="md-notifications-outline" v-if="WebSocketSub==0"/>
                    <Badge dot v-else>
                        <Icon type="md-notifications-outline" />
                    </Badge>
                </p>
                <!-- 购物车 -->
                <p class="shoppingCart cup" @click="onTapType('/shoppingCart')"><Icon type="md-cart" /></p>

                <p v-if="!isLogin" class="signIn cup" @click="openSmsLogin" style="margin-right:5px">登 录</p> 
                <!-- /<p class="registration" @click="openRegister">注 册</p> -->
                <div class="userPicBox"  @mouseleave="isSetBox = false">
                    <p  @click="OnUserPic()" @mouseenter="picMouseenter"><Avatar class="userPic cup" icon="ios-person" size="large" :src="(!isLogin)?'':userInfo.headPicture"/></p>
                    <div class="userBoxInner" v-show="isSetBox">
                        <div class="card-top">
                            <Avatar icon="ios-person" size="large" :src="userInfo.headPicture"/>
                            <p>{{userInfo.userName}}</p>
                        </div>
                        <div class="card-fot">
                            <p @click="onSignOut">安全退出</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Modal title="操作提示" width="400" v-model="modal10" class-name="vertical-center-modal" :closable="false" @on-ok="onSignOutYes"  @on-cancel="isSetBox = false">
            <p style="height:30px"></p>
            <p style="text-align:center;font-size:18px;">确定要退出吗？</p>
            <p style="height:30px"></p>
        </Modal>

	    <Login  :isModel="isModel" :pageStyle="pageStyle" @close="onClose" @switchBtn="onSwitch"/>
	    <register :isModel="isRegister" :pageStyle="pageStyle" @close="onClose" @switchBtn="onSwitch"/>
	    <smsLogin ref="smsLogin" :isModel="isSmsLogin" :pageStyle="pageStyle" @close="onClose" @switchBtn="onSwitch"/>
    </div>
</template>

<script>

	import Login from "./Login.vue";
	import register from "./register.vue";
	import smsLogin from "./SmsLogin.vue";
    import { mapActions } from 'vuex';
    export default {
        props: {

        },
        data() {
            return {
                // 登录框 显示
                isModel:false,
                // 注册框显示
                isRegister:false,
                // 短信登录框显示
                isSmsLogin:false,
                pageStyle: {
                    height: window.innerHeight + "px"
                },
                // 是否显示设置框
                isSetBox:false,
                // 搜索文案
                searchVal:'',

                modal10: false,

                WebSocketSub:0
            };
        },
        watch:{
            // 监控路由变化
            '$route.name':function(){
                this.isSetBox = false
            }
        },
        computed: {
            searchText(){
                return this.$store.state.search.searchText
            },
            isLogin () {
                return this.$store.state.user.isLogin
            },
            userInfo () {
                return this.$store.state.user.info
            },
        },
        methods: {
            // 关闭登录窗口和注册窗口
            onClose(data){
                this.isModel = false
                this.isRegister = false
                this.isSmsLogin = false
            },
            // 打开登录
            openLogin(){
                this.isModel = true
            },
            // 打开注册
            openRegister(){
                this.isRegister = true
            },
            // 打开短信登录注册
            openSmsLogin(){
                this.isSmsLogin = true
                this.$refs.smsLogin.AddEnterKeydownDestroyed()
            },
            // 切换 登录或注册
            onSwitch(val){
                this.onClose(true)
                if(val==1){
                    this.isModel = true
                }else if(val==2){
                    this.isRegister = true
                }else if(val==3){
                    this.isSmsLogin = true
                }
            },
            // 点击用户头像
            OnUserPic(){
                if(!this.isLogin){
                    this.openSmsLogin()
                }
            },
            // 点击退出
            onSignOut(){
                this.modal10 = true;
            },
            // 点击退出框确认
            onSignOutYes(){
                this.isSetBox = false;
                this.Logout().then(()=>{
                    this.$router.push({path:'/'})
                })
                
            },
            // 点击搜索
            onSearch(){
                // 记录搜索内容到vuex
                this.$store.commit('SET_SEARCH', this.searchVal )
                // 如果当前在所有课程页面
                if(this.$route.path == '/allCourses'){
                    return;
                }else{
                    this.$router.push({name:'allCourses', params: { isSearch: true }})
                }
            },
            // 点击右侧type
            onTapType(path){
                if(this.isLogin){
                    if(path=='/myCourse'){
                        if(this.$route.path != '/myCourse'){
                            this.$router.push({path:path})
                        }
                    }else{
                        this.$BWDMODEL.show({
                            text:`
                                <img src='${require("@/assets/images/defaultPic/notLogin.png")}'>
                                <div>
                                    <p style="font-size:18px;font-weight: bold;text-align: center;">新功能仍在努力开发，敬请期待。</p>
                                    <p style="font-size:18px;font-weight: bold;text-align: center;">Coming soon</p>
                                </div>`,
                            textStyle:{
                                padding:'50px',
                                background:'#CFDCFE',
                                borderRadius: '10px',
                                border:'#81A4F6 solid 2px',
                                color:'#5E8EF2',
                                display:'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            },
                            duration:1
                        })
                    }
                }else{
                    this.$BWDMODEL.show({
                        text:`
                            <img src='${require("@/assets/images/defaultPic/notLogin.png")}'>
                            <div>
                                <p style="font-size:18px;font-weight: bold;text-align: center;">需要登录后才能查看哦</p>
                                <p style="font-size:18px;font-weight: bold;text-align: center;">Login required</p>
                            </div>`,
                        textStyle:{
                            padding:'50px',
                            background:'#CFDCFE',
                            borderRadius: '10px',
                            border:'#81A4F6 solid 2px',
                            color:'#5E8EF2',
                            display:'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        },
                        duration:1
                    })
                }
            },
            // 头像进入离开事件
            picMouseenter(){
                if(this.isLogin){
                    this.isSetBox = !this.isSetBox;
                }
            },
            ...mapActions([
                'Logout'
            ])
        },
        created() {},
        mounted() {
            window.onresize = () => {
                return (() => {
                    this.pageStyle.height = window.innerHeight + "px";
                })();
            };
            
        },
        components:{Login,register,smsLogin}
    };
</script>
<style lang="less">
    .ivu-modal{
        top:50% !important;
        margin-top:-110px !important;
        .ivu-modal-confirm-body{
            padding-left:0 !important;
        }
    }
</style>
<style lang="less" scoped>
    .header{
        width:100%;height:76px;background: #fff;position: relative;z-index:10;min-width:1200px;
        .inner{
            width: 1200px;margin:0 auto;
            .log{
                float: left;margin-right: 90px;padding-top: 15px;position: relative;
                .beta {
                    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIzOXB4IiBoZWlnaHQ9IjIzcHgiIHZpZXdCb3g9IjAgMCAzOSAyMyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5Hcm91cCAzPC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+ICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPiAgICAgICAgPGcgaWQ9Ikdyb3VwLTMiPiAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUiIGZpbGw9IiNBREFEQUYiIHg9IjAiIHk9IjAiIHdpZHRoPSIzOSIgaGVpZ2h0PSIyMyIgcng9IjIiPjwvcmVjdD4gICAgICAgICAgICA8cGF0aCBkPSJNNS45ODMsNS44MDggTDcuMTAzLDUuODA4IEw3LjEwMywxMC4wOTIgQzcuNjYzLDkuMDcgOC40NjEsOC41NjYgOS40OTcsOC41NjYgQzEwLjUxOSw4LjU2NiAxMS4zMzEsOC45NDQgMTEuOTE5LDkuNzI4IEMxMi40NTEsMTAuNDI4IDEyLjczMSwxMS4yOTYgMTIuNzMxLDEyLjM2IEMxMi43MzEsMTMuNDUyIDEyLjQ1MSwxNC4zNDggMTEuOTE5LDE1LjA0OCBDMTEuMzE3LDE1LjgwNCAxMC40OTEsMTYuMTk2IDkuNDQxLDE2LjE5NiBDOC4zMjEsMTYuMTk2IDcuNTIzLDE1LjczNCA3LjAzMywxNC44MSBMNy4wMzMsMTYgTDUuOTgzLDE2IEw1Ljk4Myw1LjgwOCBaIE05LjI1OSw5LjQ5IEM4LjYwMSw5LjQ5IDguMDY5LDkuNzQyIDcuNjc3LDEwLjI3NCBDNy4yNTcsMTAuNzkyIDcuMDYxLDExLjQ3OCA3LjA2MSwxMi4zMTggTDcuMDYxLDEyLjQ1OCBDNy4wNjEsMTMuMjcgNy4yNDMsMTMuOTI4IDcuNjA3LDE0LjQzMiBDNy45OTksMTQuOTkyIDguNTczLDE1LjI3MiA5LjMwMSwxNS4yNzIgQzEwLjA4NSwxNS4yNzIgMTAuNjczLDE0Ljk3OCAxMS4wNjUsMTQuNDE4IEMxMS40MDEsMTMuOTE0IDExLjU4MywxMy4yMjggMTEuNTgzLDEyLjM2IEMxMS41ODMsMTEuNDkyIDExLjQwMSwxMC44MiAxMS4wMzcsMTAuMzMgQzEwLjYzMSw5Ljc3IDEwLjA0Myw5LjQ5IDkuMjU5LDkuNDkgWiBNMTcuMTY5LDguNTY2IEMxOC4zMzEsOC41NjYgMTkuMjEzLDguOTU4IDE5LjgwMSw5Ljc0MiBDMjAuMzMzLDEwLjQ0MiAyMC42MTMsMTEuNDM2IDIwLjY0MSwxMi42OTYgTDE0LjkyOSwxMi42OTYgQzE0Ljk4NSwxMy41MDggMTUuMTk1LDE0LjEzOCAxNS41ODcsMTQuNTg2IEMxNS45NzksMTUuMDM0IDE2LjUyNSwxNS4yNTggMTcuMjExLDE1LjI1OCBDMTcuNzk5LDE1LjI1OCAxOC4yODksMTUuMTA0IDE4LjY1MywxNC44MSBDMTguOTYxLDE0LjU1OCAxOS4xOTksMTQuMTggMTkuMzgxLDEzLjY3NiBMMjAuNTAxLDEzLjY3NiBDMjAuMzMzLDE0LjM3NiAyMC4wMTEsMTQuOTM2IDE5LjUyMSwxNS4zODQgQzE4LjkxOSwxNS45MTYgMTguMTQ5LDE2LjE5NiAxNy4yMTEsMTYuMTk2IEMxNi4xNzUsMTYuMTk2IDE1LjMzNSwxNS44NDYgMTQuNzE5LDE1LjE3NCBDMTQuMDc1LDE0LjQ3NCAxMy43NjcsMTMuNTUgMTMuNzY3LDEyLjM3NCBDMTMuNzY3LDExLjMxIDE0LjA2MSwxMC40MTQgMTQuNjc3LDkuNyBDMTUuMjkzLDguOTQ0IDE2LjExOSw4LjU2NiAxNy4xNjksOC41NjYgWiBNMTcuMTk3LDkuNTA0IEMxNi41NTMsOS41MDQgMTYuMDM1LDkuNzE0IDE1LjY0MywxMC4xMzQgQzE1LjI1MSwxMC41NTQgMTUuMDI3LDExLjExNCAxNC45NTcsMTEuODI4IEwxOS40NzksMTEuODI4IEMxOS4zMzksMTAuMjc0IDE4LjU2OSw5LjUwNCAxNy4xOTcsOS41MDQgWiBNMjMuODg5LDYuNDI0IEwyMy44ODksOC43NjIgTDI1LjY4MSw4Ljc2MiBMMjUuNjgxLDkuNyBMMjMuODg5LDkuNyBMMjMuODg5LDE0LjMwNiBDMjMuODg5LDE0LjU3MiAyMy45MzEsMTQuNzY4IDI0LjA0MywxNC44OCBDMjQuMTQxLDE0Ljk5MiAyNC4zMjMsMTUuMDYyIDI0LjU3NSwxNS4wNjIgTDI1LjQ5OSwxNS4wNjIgTDI1LjQ5OSwxNiBMMjQuNDA3LDE2IEMyMy44MTksMTYgMjMuMzg1LDE1Ljg0NiAyMy4xMzMsMTUuNTM4IEMyMi44OTUsMTUuMjU4IDIyLjc4MywxNC44NTIgMjIuNzgzLDE0LjMwNiBMMjIuNzgzLDkuNyBMMjEuMzI3LDkuNyBMMjEuMzI3LDguNzYyIEwyMi43ODMsOC43NjIgTDIyLjc4Myw2Ljg4NiBMMjMuODg5LDYuNDI0IFogTTMwLjA3Nyw4LjU2NiBDMzEuMTEzLDguNTY2IDMxLjg2OSw4LjgzMiAzMi4zNzMsOS4zNzggQzMyLjc5Myw5Ljg1NCAzMy4wMTcsMTAuNTEyIDMzLjAxNywxMS4zNTIgTDMzLjAxNywxNiBMMzEuOTY3LDE2IEwzMS45NjcsMTQuNzgyIEMzMS42ODcsMTUuMTc0IDMxLjMwOSwxNS40OTYgMzAuODYxLDE1Ljc0OCBDMzAuMzI5LDE2LjA0MiAyOS43MjcsMTYuMTk2IDI5LjA1NSwxNi4xOTYgQzI4LjMyNywxNi4xOTYgMjcuNzUzLDE2LjAxNCAyNy4zMTksMTUuNjUgQzI2Ljg3MSwxNS4yNzIgMjYuNjQ3LDE0Ljc4MiAyNi42NDcsMTQuMTk0IEMyNi42NDcsMTMuMzY4IDI2Ljk2OSwxMi43NTIgMjcuNjQxLDEyLjMzMiBDMjguMjI5LDExLjk0IDI5LjA2OSwxMS43MyAzMC4xNjEsMTEuNzE2IEwzMS44OTcsMTEuNjg4IEwzMS44OTcsMTEuMzEgQzMxLjg5NywxMC4wOTIgMzEuMjY3LDkuNDkgMzAuMDA3LDkuNDkgQzI5LjQ3NSw5LjQ5IDI5LjA0MSw5LjU4OCAyOC43MDUsOS44MTIgQzI4LjMyNywxMC4wMzYgMjguMDg5LDEwLjM4NiAyNy45NzcsMTAuODQ4IEwyNi44NzEsMTAuNzY0IEMyNy4wMjUsMTAuMDA4IDI3LjQwMyw5LjQzNCAyNy45OTEsOS4wNyBDMjguNTIzLDguNzM0IDI5LjIwOSw4LjU2NiAzMC4wNzcsOC41NjYgWiBNMzEuODk3LDEyLjUyOCBMMzAuMjMxLDEyLjU1NiBDMjguNjA3LDEyLjU4NCAyNy43OTUsMTMuMTE2IDI3Ljc5NSwxNC4xNjYgQzI3Ljc5NSwxNC41MDIgMjcuOTIxLDE0Ljc2OCAyOC4yMDEsMTQuOTkyIEMyOC40ODEsMTUuMjAyIDI4Ljg0NSwxNS4zMTQgMjkuMjkzLDE1LjMxNCBDMjkuOTc5LDE1LjMxNCAzMC41ODEsMTUuMDkgMzEuMTEzLDE0LjY0MiBDMzEuNjMxLDE0LjIwOCAzMS44OTcsMTMuNzA0IDMxLjg5NywxMy4xNDQgTDMxLjg5NywxMi41MjggWiIgaWQ9ImJldGEiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==);
                    display: inline-block;
                    width: 39px;
                    height: 23px;
                    margin-left: 10px;
                    position: absolute;
                    top:50%;
                    left:100%;
                }
            }
            .allCourses{
                float: left;color:#585858;font-size: 16px;padding-top: 25px;margin-right: 120px;
            }
            .search{
                position: relative;top:16px;overflow: hidden;
                border:1px solid #d54594;background: #fff;float: left;width:400px;height:40px;border-radius: 20px;overflow: hidden;
                input{
                    border:none;text-indent:26px;width:314px;height:38px;line-height: 40px;color:#333;display: block;float: left;
                    font-size: 14px;
                    &::placeholder{
                        color:#999;
                    }
                }
                p{
                    float: right;
                    width:82px;
                    height:40px;
                    color:#fff;cursor: pointer;
                    background:#d54594 url(../assets/images/head/search.png) no-repeat 12px center / auto 16px;
                    line-height: 40px;
                    text-align:center;
                    text-indent: 1em;
                }
            }
            .nav-set{
                float: right;
                width:267px;
                height:76px;
                display: flex;
                align-items: center;
                justify-content: center;
                p{

                    font-size: 14px;
                    color:#585858;
                    margin-right: 20px;
                    height:20px;
                    line-height: 20px;
                    &.remind,&.shoppingCart{
                        width: 20px;
                        font-size: 20px;
                    }
                    &.signIn,&.registration,&.user{
                        margin-right: 0;
                    }
                    &.registration{
                        margin-right: 5px;
                    }
                    &.study{
                        transition: color 0.2s ease;
                        &:hover{
                            color: #57a3f3;
                        }
                    }
                }
                .userPicBox{
                    position: relative;
                    height:100%;
                    display: flex;
                    align-items: center;
                    p{
                        margin-right: 0;
                        height:40px;
                    }
                    .userBoxInner{
                        position:absolute;
                        top:76px;
                        right:-10px;
                        width:300px;
                        padding:20px;
                        background :#fff;
                        border-bottom-left-radius:6px;
                        border-bottom-right-radius:6px;
                        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                        .card-top{
                            display: flex;
                            align-items: center;
                            padding-bottom:10px;
                            .ivu-avatar{
                                width:60px;
                                height:60px;
                                border-radius: 50%;
                            }
                            p{
                                padding-left:15px;
                                font-size: 16px;
                                font-weight: 500;
                                height:auto;
                            }
                        }
                        .card-fot{
                            border-top:1px solid #dedede;
                            padding-top:10px;
                            p{
                                font-size: 12px;
                                display: inline-block;
                                height:30px;
                                text-align: center;
                                line-height: 30px;
                                color:#93999f;
                                cursor: pointer;
                                &:hover{
                                    color:#d54594;
                                }
                            }
                        }
                        &:after{
                            position:absolute;
                            top:-9px;
                            right:22px;
                            content :'';
                            border:rgba(0,0,0,0) 9px solid;
                            border-left:#fff 9px solid;
                            border-top:#fff 9px solid;
                            transform :rotate(45deg);
                            z-index: 1;
                            box-shadow :0 5px 10px rgba(0, 0, 0, 0.2);
                        }
                        &:before{
                            position:absolute;
                            top:0;
                            left:0;
                            width:100%;
                            height:20px;
                            content :'';
                            background :#fff;
                            z-index: 2;
                            border-radius :4px;
                        }
                    }
                }
            }
        }
        &.cur{
            box-shadow: 0 5px 10px rgba(0,0,0,0.2);
        }
    }
    .vertical-center-modal{
        .ivu-modal{
            width:400px;
        }
    }
</style>