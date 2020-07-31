<template>
    <div class="studyPlayPage">
        <div class="contentTop">
            <div class="playBox-list" :class="{cur:!isListShow}" :style='{height:videoObj.height}'>
                <div class="playBox">
                    <vue-video ref="videoBoxRef" :videoObj.sync="videoObj" @endPlay="EndPlay" @timeUpDate="TimeUpDate"></vue-video>
                    <span class="cup" @click="listShow"></span>
                </div>
                <!-- 课程目录 -->
                <div class="playList">
                    <div class="scrolll">
                        <div class="scrolllBox" v-for="(item,index) in CouressInfo" :key="index">
                            <h6>{{item.chapterName}}</h6>
                            <div class="li cup" v-for="(cItem,cIndex) in item.children" :key="cIndex" @click="videoListClick(cItem)" :class="{status0:cItem.learnsStatus == 0,status1:cItem.learnsStatus ==1,status2:cItem.learnsStatus == 2,statusPlay:cItem.id == curPlayData.id}">
                                <p class="chapterName">{{cItem.chapterName}}</p>
                                <p class="time">时长 {{cItem.videoTime | time}}<span v-if="cItem.id == curPlayData.id">正在学习</span></p>
                                <span class="statusIcon"><span></span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="contentfonter">
            <h5><span></span>问答专区 <p @click="isPutQuestionsTo = !isPutQuestionsTo" :class="{cur:isPutQuestionsTo}">我要提问<em></em><em></em></p></h5>
            <div class="questionsBox" v-show="problemListData.length>0||isPutQuestionsTo">
                <!-- 提问输入框 -->
                <transition name="fade">
                    <div class="putQuestionsTo" v-show="isPutQuestionsTo">
                        <!-- <wangeditor ref="editorElemModel" :catchData="sw" :wangeditorId="'putQuestionsTo'" :defaultText="'请输入您的问题:'" @AddKeyDestroyed="AddEnterKeydownDestroyed" @DeleteKeyDestroyed="enterKeydownDestroyed"></wangeditor> -->
                        <UEditor ref="editorElemModel"  :catchData="sw" :ueditorId="'putQuestionsTo'"></UEditor>
                        <div class="putQuestionsToBtn"><p class="cup" @click="addChapterQuestion">提 问</p> </div>
                    </div>
                </transition>
                <!-- 问题列表 -->
                <div class="problemBox">
                    <div class="li" v-for="item in problemListData" :key="item.id">
                        <!-- 问题 -->
                        <div class="topInner">
                            <div class="userPic">
                                <img class="pic" v-if="item.userInfo.headPicture" :src="item.userInfo.headPicture | userPicUrl" alt="">
                                <p class="pic" v-if="!item.userInfo.headPicture">{{item.userInfo.userName.substring(0,1)}}</p>
                                <p class="userName" :title="item.userInfo.userName">{{item.userInfo.userName}}</p>
                            </div>
                            <div class="SubjectName" :class="{cur:item.isQuestionContentShow}">
                                <div class="questionContent" v-html="item.questionContent"></div>
                                <p class="seeAll"><span class="cup" @click="sliedSeeAll(item)">{{item.isQuestionContentShow?'收起问题':'展开完整问题'}}</span></p>
                            </div>
                        </div>
                        <div class="barlINE">
                            <p class="huidashu cup" @click="onAnswerList(item)" :class="{cur:item.isAnswerListShow}">{{ !item.isAnswerListShow?item.answerCount+'条':'收起'}}回答 <span v-if="item.answerCount>0"></span> </p>
                            <p class="time">提问时间 : <Time :time="item.gmtCreate"/></p>
                        </div>

                        <div class="AnswerStr" v-if="item.isAnswerListShow">
                            <p class="title">最新回答</p>
                            <div class="answerListLi" v-for="citem in problemAnswerList" :key="citem.id">
                                <div class="userPic">
                                    <img class="pic" v-if="citem.userInfo.headPicture" :src="citem.userInfo.headPicture | userPicUrl" alt="">
                                    <p class="pic" v-if="!citem.userInfo.headPicture">{{citem.userInfo.userName.substring(0,1)}}</p>
                                    <p class="userName" :title="item.userInfo.userName">{{citem.userInfo.userName}}</p>
                                </div>
                                <div class="answerContent">
                                    <div class="answerContentName"  :class="{cur:citem.isQuestionContentShow}">
                                        <div class="answerContentNameCont" v-html="citem.answerContent"></div>
                                        <p class="seeAll"><span class="cup" @click="sliedSeeAll(citem , 2)">{{citem.isQuestionContentShow?'收起回答':'展开完整回答'}}</span></p>
                                    </div>
                                    <div class="barlINE">
                                        <p class="time">回答时间 : <Time :time="citem.gmtCreate"  style="margin-right:10px;"/> {{citem.gmtCreate}}</p>
                                    </div>
                                </div>
                            </div>
                            <Page class='pageAllCoures AnswerStrPage' v-if="AnswerListPage.CurrentTotal>AnswerListPage.pageSize" :page-size="AnswerListPage.pageSize" @on-change="getPageData2" :total="AnswerListPage.CurrentTotal" prev-text="上一页" next-text="下一页"/>
                        </div>

                        <div class="botInner">
                            <div class="liBtn"  v-if="!item.isEdit" >
                                <p class="cup" @click="myanswer(item)">我要回答</p>
                            </div>

                            <!-- <wangeditor v-if="item.isEdit" :wangeditorId="item.index" :catchData="sw" :defaultText="'请输入您的回答:'" @AddKeyDestroyed="AddEnterKeydownDestroyed" @DeleteKeyDestroyed="enterKeydownDestroyed"></wangeditor> -->
                            <UEditor ref="editorElemModel" v-if="item.isEdit" :catchData="sw" :ueditorId="item.index"></UEditor>

                            <div class="liBtn Botm-line" v-if="item.isEdit">
                                <p class="cancel" @click="cancel(item)">取消</p>
                                <p class="Submit" @click="SubmitResponse(item)">提交回答</p>
                            </div>
                        </div>
                        
                    </div>
                    <Page class='pageAllCoures'  v-if="Question.CurrentTotal>Question.pageSize" :page-size="Question.pageSize" @on-change="getPageData" :total="Question.CurrentTotal" prev-text="上一页" next-text="下一页" show-elevator/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vueVideo from "../../../components/video.vue";
    // import wangeditor from "../../../components/wangeditor.vue"
    import UEditor from "../../../components/UEditor.vue";
    import { formatDate } from "../../../utils/tool.js"
    import { mapActions } from "vuex"
    import { httpApi } from '../../../utils/api'

    export default {
        components: {vueVideo,UEditor},
        metaInfo(){
            return{
                title: this.pageTitle,
                titleTemplate: null,
                meta: [
                    { name: "keywords", content: this.$route.meta.keywords  },
                    { name: "description", content: this.$route.meta.description  }
                ]
            }
        },
        data() {
            return {
                // 页面标题 动态设置
                pageTitle:'马士兵教育学习中心',
                // 课程名
                courseName:'',
                // 课程id
                courseId:'',
                // 列表是否显示
                isListShow:true,
                // 视频播放需要的参数
                videoObj:{
                    // source:'http://www.mashibing.com/msb/images/video/2020xuan.mp4',
                    width:'100%',
                    height:'456px',
                    preload:true
                },
                // 课程视频列表数据
                CouressInfo:[],
                // 我的提问
                putQuestionsToStr:'',
                // 问答数据
                problemListData:[],
                // 对应答案数据
                problemAnswerList:[],
                // 播放时长记录
                thimArr:[],
                // 当前播放数据
                curPlayData:{},

                // 是否显示提问框
                isPutQuestionsTo:false,

                // 问题列表分页数据
                Question:{
                    CurrentPage:1,
                    CurrentTotal:0,
                    pageSize:5
                },
                // 答案分页数据
                AnswerListPage:{
                    CurrentPage:1,
                    CurrentTotal:0,
                    pageSize:5,
                    id:-1
                },
                // 富文本是否获取焦点
                isfocus:false
            };
        },
        filters:{
            userPicUrl(value){
                return value.indexOf('https://')>-1?value: httpApi+'/msb-video-user'+value;
            },
            time(value){
                let time = '00:00';
                if(value>0){
                    let mm = parseInt(value/60)<10?'0'+parseInt(value/60):parseInt(value/60);
                    let ss = parseInt(value%60)<10?'0'+parseInt(value%60):parseInt(value%60);
                    time =  mm+":"+ss;
                }
                return time;
            }
        },
        watch: {
            
        },
        computed: {
            userInfo () {
                return this.$store.state.user.info
            },
        },
        beforeDestroy(){
            // this.$refs.videoBoxRef.disposeVideo()
            // 关闭时更新一下当前播放视频的进度
            this.UpDataChapterTime(this.curPlayData.playTime)
            // 销毁按键事件
            this.enterKeydownDestroyed();
        },
        methods: {
            // 获取用户课程目录详情
            getUserCouressInfo(CID,UID) {
                this.$loading.show('正在加载中...');
                this.GetToken().then((TOKEN) => {
                    this.axios.get(this.API.Course.UserChapters(CID,UID),{
                        headers:{
                            Authorization:this.$ls.get('Token')
                        }
                    })
                    .then(response => {
                        let data = response.data;
                        // console.log(data)
                        if(!data || data.length==0){
                            this.$Message.error('获取课程信息失败');
                            this.$loading.hide()
                            return;
                        }
                        // 筛选出最新的播放小节
                        let result = response.data.map( item => item.children ).flat(Infinity)
                        let resultIndex = -1;
                        let VIDEOINFO = this.$ls.get('VIDEOINFO')||'';
                        if(VIDEOINFO.id){
                            resultIndex = result.findIndex(item => item.id == VIDEOINFO.id )
                        }else{
                            resultIndex = result.findIndex(item => item.learnsStatus == 1 )
                        }
                        if(resultIndex == -1 ){
                            resultIndex = result.findIndex(item => item.learnsStatus == 0 )
                            if(resultIndex == -1 ){
                                resultIndex = result.findIndex( item => item.learnsStatus == 2 )
                            }
                        }
                        
                        // 设置课程所有播放数据
                        this.CouressInfo = data
                        result[resultIndex].learnsStatus = result[resultIndex].learnsStatus < 2?1:2;

                        this.setPlayCurVideo(result[resultIndex],1).catch(error=>{
                            // 设置当前播放数据
                            this.getCurPlayVideoTime(1)
                        })

                        this.$nextTick(()=>{
                            var partotop = $(".scrolll")[0].offsetTop;  //父元素到页面顶部距离
                            var distance = $(".statusPlay")[0].offsetTop;  //子元素到页面顶部的距离
                            $(".scrolll").animate({
                                scrollTop: `${distance - partotop-200}px`
                            }, 100);
                        })
                    }).catch(error=>{
                        // this.$Message.error('请刷新重试');
                        this.$loading.hide()
                        if(error.code==401){
                            setTimeout(()=>{
                                this.$ls.remove('Token')
                                this.getUserCouressInfo(this.courseId,this.userInfo.id)
                            },100)
                        }
                    });
                }).catch(error=>{
                    if(error == '已离线'){
                        this.$Message.warning({content:'用户已离线',onClose:()=>{
                            this.$router.push({path:`/details/${CID}`})
                        }})
                        return;
                    }
                })
            },
            // 获取视频数据
            getVideoList(VID,val){
                this.GetToken().then((TOKEN) => {
                    this.axios.get(this.API.video.VdIdPlay(VID), {
                        headers:{
                            Authorization:this.$ls.get('Token')
                        }
                    })
                    .then(response => {
                        let data = response.data;
                        this.videoObj.source = JSON.stringify( data );
                        // 设置页面标题
                        this.pageTitle = `《${this.courseName}》${this.curPlayData.chapterName}`

                        this.$loading.hide()
                            // 切换视频
                        if(val == 1 ){
                            this.$refs.videoBoxRef._initialize()
                        }else{
                            this.videoObj.autoplay = true;
                            this.$refs.videoBoxRef._initPlayer()
                        }
                        
                    }).catch(error=>{
                        debugger
                        console.log(error)
                        this.$Message.error('请刷新重试');
                        this.$loading.hide()
                    });
                }).catch(error=>{
                    if(error == '已离线'){
                        this.$Message.warning({content:'用户已离线',onClose:()=>{
                            this.$router.push({path:`/details/${this.courseId}`})
                        }})
                        return;
                    }
                })
            },
            // 获取当前播放视频进度
            getCurPlayVideoTime(val){
                this.GetToken().then((TOKEN) => {
                    this.axios.get(this.API.Course.UserIdChapter(this.curPlayData.id,this.userInfo.id) , {
                        headers:{
                            Authorization:this.$ls.get('Token')
                        }
                    })
                    .then(response => {
                        let data = response.data;
                        this.videoObj.seekTime = data.pointTime/1000;

                        // 设置问题的当前页为1
                        this.Question.CurrentPage = 1
                        this.Question.CurrentTotal = 0

                        let VID = this.curPlayData.videoId
                        this.getVideoList(VID,val)
                        this.getChapterQuestionList()
                        this.thimArr = []
                    }).catch(error=>{
                        this.$loading.hide()
                    });
                }).catch(error=>{
                    if(error == '已离线'){
                        this.$Message.warning({content:'用户已离线',onClose:()=>{
                            this.$router.push({path:`/details/${this.courseId}`})
                        }})
                        return;
                    }
                })
            },
            // 结束播放
            EndPlay(time){
                // console.log('播放结束')
                this.UpDataChapterTime(time,'EndPlay')
                this.addStatus(this.curPlayData)

                let playRecordArr = this.$ls.get('PLAYRECORD') || {}
                delete playRecordArr[this.courseId+'_'+this.curPlayData.id];
                this.$ls.set('PLAYRECORD',playRecordArr)
                
                return;

                // 筛选出最新的播放小节
                let result = this.CouressInfo.map( _item => _item.children ).flat(Infinity)
                let resultIndex = result.findIndex( _item => _item.id == this.curPlayData.id )

                if(resultIndex == result.length-1){
                            
                }else{
                    this.$Modal.confirm({
                        content: `<p style="padding:20px 0;font-size:16px;">本小节已学习完成，继续学习下一小节吗？</p>`,
                        okText: '继续',
                        cancelText: '取消',
                        onOk: () => {
                            this.curPlayData = result[resultIndex+1];
                            this.getCurPlayVideoTime(2)
                        }
                    });
                }
            },
            // 视频播放中
            TimeUpDate(time){
                let curTime =  parseInt( time );
                this.curPlayData.playTime = curTime;

                if(this.curPlayData.learnsStatus != 2){
                    let playRecordArr = this.$ls.get('PLAYRECORD') || {}
                    playRecordArr[this.courseId+'_'+this.curPlayData.id] = curTime
                    this.$ls.set('PLAYRECORD',playRecordArr)
                }
                return

                if( curTime > 9 && curTime%10 == 0 && !this.thimArr[curTime] ){
                    this.thimArr[curTime] = curTime;
                    this.curPlayData.playTime = curTime;
                    this.UpDataChapterTime(curTime)
                }
            },
            // 更新当前视频播放时长
            UpDataChapterTime(curTime,status){
                this.GetToken().then((TOKEN) => {
                    let parem = {
                        chapterId:this.curPlayData.id, // 小节id
                        courseId:parseInt(this.courseId), // 课程id
                        pointTime:curTime*1000, // 本节视频学习时间，如果已学完则为-1
                        userId:this.userInfo.id // 用户id
                    }
                    if(status == 'EndPlay'){
                        parem.learnsStatus = 2
                    }
                    this.axios.put(this.API.Course.UpDataChapter,parem,{
                        headers:{
                            Authorization:this.$ls.get('Token')
                        }
                    })
                }).catch(error=>{
                    if(error == '已离线'){
                        this.$refs.videoBoxRef.pauseVideo();
                        this.$Message.warning({content:'用户已离线',onClose:()=>{
                            this.$router.push({path:`/details/${this.courseId}`})
                        }})
                        return;
                    }
                })
            },
            // 列表显示控制
            listShow(){
                this.isListShow = !this.isListShow;
                if(!this.isListShow){
                    this.videoObj.height = '580px'
                }else{
                    this.videoObj.height = '456px'
                }
            },
            // 视频列表点击
            videoListClick(item){
                if(item.id == this.curPlayData.id ){
                    // 当前播放项
                    return;
                }
                // 先更新当前视频的播放进度
                if(this.curPlayData.learnsStatus != 2 ){
                    this.UpDataChapterTime(this.curPlayData.playTime)
                }

                // 筛选出最新的播放小节
                let result = this.CouressInfo.map( _item => _item.children ).flat(Infinity)
                let resultIndex = result.findIndex( _item => _item.id == item.id )
                if( !result[resultIndex].videoId ){
                    // console.log('视频id为空') 
                    return;
                }
                
                if( item.learnsStatus > 0 ){
                    if(item.learnsStatus == 2){
                        this.modal2 = true;
                        this.OverCurPlayData = result[resultIndex];
                        this.$Modal.confirm({
                            // title: title,
                            content: '<p style="padding:20px 0;font-size:16px;">本小节已学习完成，确认继续学习吗？</p>',
                            okText: '继续',
                            cancelText: '取消',
                            onOk: () => {
                                this.curPlayData = result[resultIndex];
                                this.videoObj.seekTime = 0;
                                // 设置问题的当前页为1
                                this.Question.CurrentPage = 1
                                this.Question.CurrentTotal = 0

                                let VID = result[resultIndex].videoId
                                this.getVideoList(VID,2)
                                this.getChapterQuestionList()
                                this.thimArr = []
                            }
                        });
                        return
                    }
                    this.setPlayCurVideo(result[resultIndex],2).catch(error=>{
                        this.getCurPlayVideoTime(2)
                    })
                }else{
                    // 点击的未学习小节
                    let aaa = this.CouressInfo.map(_item => {
                        return {
                            ..._item,
                            children: _item.children.map(_item2 => {
                                let learnsStatus = _item2.learnsStatus;
                                if(_item2.id == item.id){
                                    learnsStatus = _item2.learnsStatus == 0 ? 1 : _item2.learnsStatus
                                }
                                return {
                                    ..._item2,
                                    learnsStatus:learnsStatus
                                };
                            })
                        };
                    });
                    this.CouressInfo = aaa;

                    this.curPlayData = result[resultIndex];
                    this.videoObj.seekTime = 0;
                    // 设置问题的当前页为1
                    this.Question.CurrentPage = 1
                    this.Question.CurrentTotal = 0

                    let VID = result[resultIndex].videoId
                    this.getVideoList(VID,2)
                    this.getChapterQuestionList()
                    this.thimArr = []
                }
            },
            // 设置需要播放的视频
            setPlayCurVideo(obj,val){
                return new Promise((resolve, reject) => {
                    // 设置当前播放数据
                    this.curPlayData = obj;
                    // 先取本地浏览器缓存的播放进度
                    let playRecordArr = this.$ls.get('PLAYRECORD') || {}
                    if( playRecordArr[this.courseId+'_'+obj.id] ){

                        this.videoObj.seekTime = playRecordArr[this.courseId+'_'+obj.id];
                        console.log(this.videoObj)
                        console.log(obj)
                        // 设置问题的当前页为1
                        this.Question.CurrentPage = 1
                        this.Question.CurrentTotal = 0

                        let VID = obj.videoId
                        this.getVideoList(VID,val)
                        this.getChapterQuestionList()
                        this.thimArr = []
                        resolve('有历史播放记录')
                    }else{
                        reject('没有播放记录')
                    }
                })
            },
            // 修改对应类型属性
            addStatus(item) {
                let aaa = this.CouressInfo.map(_item => {
                    return {
                        ..._item,
                        children: _item.children.map(_item2 => {
                            if(_item2.id == this.curPlayData.id ){
                                this.curPlayData.learnsStatus = 2
                            }
                            return {
                                ..._item2,
                                learnsStatus:_item2.id == item.id ? 2 : _item2.learnsStatus
                            };
                        })
                    };
                });
                this.CouressInfo = aaa;
            },
            // 输入框改变反馈
            sw(id,text){
                // let sere = ((text.replace(/<.*?>/g,"")).replace(/\s*/g,"")).replace(/&nbsp;/ig, "");
                // if( sere.length > 500 ){
                //     this.$Message.warning('请精减你的问题到500个字以内')
                // }else{
                    if(id==='putQuestionsTo'){
                        this.putQuestionsToStr = text
                    }else{
                        this.problemListData[id].answerContent = text
                    }
                // }
            },
            // 获取分页数据
            getPageData(page) {
                this.Question.CurrentPage = page;
                this.getChapterQuestionList()
                $('html').animate(
                    { scrollTop: this.videoObj.height }, 300
                );
            },
            getPageData2(page){
                this.AnswerListPage.CurrentPage = page;
                this.getAnswerList(this.AnswerListPage.id)
            },
            // 获取小节问题列表
            getChapterQuestionList(){
                this.axios.get(this.API.Chapter.QuestionList(this.curPlayData.id)+`?currentPage=${this.Question.CurrentPage}&pageSize=${this.Question.pageSize}`)
                .then(response => {
                    let data = response.data.records.map((item,index) =>{
                        return{
                            ...item,
                            index:index,
                            answerCount:item.answerCount||0,
                            gmtCreate:formatDate(item.gmtCreate,'yyyy-MM-dd HH:mm') ,
                            isEdit:false, // 是否编辑填写回答
                            isAnswerListShow:false, // 是否展开回答数据
                            isQuestionContentShow:false // 是否展示全部问题
                        }
                    })
                    this.problemListData = data;
                    this.Question.CurrentTotal = response.data.total

                    this.$nextTick(()=>{
                        let questionContentArr = document.getElementsByClassName('questionContent');
                        questionContentArr.forEach(item=>{
                            if(item.clientHeight<120){
                                item.nextSibling.style.display = 'none'
                            }
                        })
                    })
                }).catch(error=>{

                })
            },
            // 添加小节问题
            addChapterQuestion(){
                debugger
                if(!this.putQuestionsToStr || this.putQuestionsToStr === '<p>请输入您的问题:</p><br>'){
                    this.$Message.warning('请输入提问内容')
                    return;
                }
                this.$loading.show('提交问题中');

                let param = {
                    courseId:this.courseId, // 问题对应的课程id
                    chapterId:this.curPlayData.id, // 问题对应的章节id
                    questionContent:this.putQuestionsToStr, // 问题内容
                    userId:this.userInfo.id, // 用户id
                }
                this.GetToken().then((TOKEN) => {
                    this.axios.post(this.API.Chapter.QuestionAdd,param, {
                        headers:{
                            Authorization:this.$ls.get('Token')
                        }
                    })
                    .then(response => {
                        this.$loading.hide()
                        this.$Message.success('问题已提交');
                        this.$refs.editorElemModel.editorClear()
                        this.putQuestionsToStr = ''
                        this.getChapterQuestionList()

                    }).catch(error=>{

                    })
                }).catch(error=>{
                    if(error == '已离线'){
                        this.$refs.videoBoxRef.pauseVideo();
                        this.$Message.warning({content:'用户已离线',onClose:()=>{
                            this.$router.push({path:`/details/${this.courseId}`})
                        }})
                        return;
                    }
                })
            },
            // 我要回答按钮
            myanswer(_item){
                let data = this.problemListData.map(item=>{
                    return{
                        ...item,
                        isEdit:item.id==_item.id?true:false
                    }
                })
                this.problemListData = data
                
            },
            // 提交回答按钮
            SubmitResponse(_item){
                if(!_item.answerContent || _item.answerContent === '<p>请输入您的回答:</p><br>'){
                    this.$Message.warning('请输入回答的内容')
                    return;
                }
                // 限制字数长度
                // let sere = ((_item.answerContent.replace(/<.*?>/g,"")).replace(/\s*/g,"")).replace(/&nbsp;/ig, "");
                // if( sere.length > 500 ){
                //     this.$Message.warning('请精减你的回答到500个字以内')
                //     return;
                // }
                let param = {
                    chapterId:this.curPlayData.id, // 问题对应的章节id
                    questionId:_item.id, // 问题id
                    answerContent:_item.answerContent, // 回答的内容
                    userId:this.userInfo.id, // 用户id
                }

                this.GetToken().then((TOKEN) => {
                    
                    this.axios.post(this.API.Chapter.AnswerAdd,param, {
                        headers:{
                            Authorization:this.$ls.get('Token')
                        }
                    })
                    .then(response => {
                        this.$Message.success('你的回答已提交');
                        // this.$refs.editorElemModel.editorClear()
                        this.getChapterQuestionList()

                    }).catch(error=>{

                    })
                }).catch(error=>{
                    if(error == '已离线'){
                        this.$refs.videoBoxRef.pauseVideo();
                        this.$Message.warning({content:'用户已离线',onClose:()=>{
                            this.$router.push({path:`/details/${this.courseId}`})
                        }})
                        return;
                    }
                })
            },
            // 取消回答
            cancel(_item){
                _item.answerContent = '';
                _item.isEdit = false;
            },
            // 点击回答数
            onAnswerList(_item){
                if(!_item.answerCount) return;
                let data = this.problemListData.map(item=>{
                    return{
                        ...item,
                        isAnswerListShow:item.id==_item.id?!item.isAnswerListShow:false
                    }
                })
                this.problemListData = data
                _item.isAnswerListShow = !_item.isAnswerListShow
                if(_item.isAnswerListShow){
                    this.AnswerListPage.CurrentPage = 1;
                    this.AnswerListPage.CurrentTotal = 0;
                    this.AnswerListPage.id = _item.id;

                    this.getAnswerList(_item.id)
                }
            },
            // 获取问题的答案
            getAnswerList(id){
                this.axios.get(this.API.Chapter.AnswerList(id)+`?currentPage=${this.AnswerListPage.CurrentPage}&pageSize=${this.AnswerListPage.pageSize}`)
                .then(response => {
                    let data = response.data.records.map((item,index) =>{
                        return{
                            ...item,
                            index:index,
                            gmtCreate:formatDate( item.gmtCreate,'yyyy-MM-dd HH:mm') ,
                            isEdit:false, // 是否编辑填写回答
                            isAnswerListShow:false, // 是否展开回答数据
                            isQuestionContentShow:false // 是否展示全部回答
                        }
                    })
                    this.problemAnswerList = data;
                    this.AnswerListPage.CurrentTotal = response.data.total
                    
                    this.$nextTick(()=>{
                        let answerContentNameArr = document.getElementsByClassName('answerContentNameCont');
                        answerContentNameArr.forEach(item=>{
                            if(item.clientHeight<150){
                                item.nextSibling.style.display = 'none'
                            }
                        })
                    })

                }).catch(error=>{

                })
            },
            // 点击展开全部问题
            sliedSeeAll(_item,val=1){
                if(val==1){
                    let data = this.problemListData.map(item=>{
                        return{
                            ...item,
                            isQuestionContentShow:item.id==_item.id?!item.isQuestionContentShow:item.isQuestionContentShow
                        }
                    })
                    this.problemListData = data
                }else{
                    let data = this.problemAnswerList.map(item=>{
                        return{
                            ...item,
                            isQuestionContentShow:item.id==_item.id?!item.isQuestionContentShow:false
                        }
                    })
                    this.problemAnswerList = data
                }
                
            },
            // 监听按钮事件
            enterKey() {
                var key = window.event.keyCode;
                // 按键是否是上下左右
                if( key > 36 && key < 41 || key == 32 ){
                    // 否则 进行视频的操作
                    if (key == 38 && this.$route.name == 'studyPlay') { // 上
                        this.$refs.videoBoxRef.setVideoVolume('+')
                    }else if (key == 40 && this.$route.name == 'studyPlay') { // 下
                        this.$refs.videoBoxRef.setVideoVolume('-')
                    }else if (key == 37 && this.$route.name == 'studyPlay') { // 左
                        this.$refs.videoBoxRef.setVideoSeekTime('-')
                    }else if (key == 39 && this.$route.name == 'studyPlay') { // 右
                        this.$refs.videoBoxRef.setVideoSeekTime('+')
                    }else if(key == 32 && this.$route.name == 'studyPlay'){
                        let e = {
                            target:{
                                localName:'video'
                            }
                        }
                        this.$refs.videoBoxRef.playBtnBox(e)
                    }

                    window.event.preventDefault()
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
                'GetToken'
            ])
        },
        created() {
           
        },
        mounted() {
            let id = this.$route.params.id;
            let name = this.$route.params.name;
            
            this.courseName = name;
            this.courseId = id;

            let UID = this.userInfo.id || this.$ls.get('User-Info').id
            this.getUserCouressInfo(id,UID)

            // 添加视频监控事件
            this.AddEnterKeydownDestroyed()
            // window.onerror = function(message, source, lineno, colno, error){
            //     console.log(message)
            //     console.log(source)
            //     console.log(lineno)
            //     console.log(colno)
            //     console.log(error)
            // }
        }
}

</script>
<style lang='less'>
    .answerContentNameCont,.questionContent{
        img{
            display: initial;
        }
    }
</style>
<style lang='less' scoped>
    .studyPlayPage{
        min-width: 1200px;
        background:#F4F5F6;
        .contentTop{
            background: #1F2128;
            padding:20px 0;
            .playBox-list{
                width:1200px;
                margin: 0 auto;
                display: flex;
                .playBox{
                    width:850px;
                    position: relative;
                    z-index: 2;
                    transition: 0.3s width 0s;
                    background:#262930;
                    span{
                        position: absolute;
                        top: 50%;
                        right: -16px;
                        margin-top: -40px;
                        width: 16px;
                        height: 60px;
                        background :url("../../../assets/images/icon/sprite-play-aura.png") no-repeat 0 0 / auto 140px;
                        &:hover{
                            opacity: 0.7;
                        }
                    }
                }
                .playList{
                    position: relative;
                    z-index: 1;
                    width:350px;
                    background: #262930;
                    transition: 0.3s width 0s;
                    overflow: hidden;
                    padding:15px;
                    padding-right: 0;
                    height:100%;
                    .scrolll{
                        height:100%;
                        overflow-y: auto;
                    }
                    .scrolllBox{
                        padding:0 10px;
                        h6{
                            color:#fff;
                            font-size: 16px;
                            padding:10px 0;
                        }
                        .li{
                            margin-bottom:10px;
                            background: rgba(108, 109, 108, 0.3);
                            padding:8px 30px;
                            position: relative;
                            .statusIcon{
                                position: absolute;
                                top:11px;
                                left:10px;
                                width:14px;
                                height:14px;
                                border:2px solid #D7DADE;
                                border-radius: 50%;
                                overflow: hidden;
                            }
                            .chapterName{
                                font-size: 14px;
                                padding-bottom:5px;
                            }
                            .time{
                                font-size: 12px;
                                span{
                                    border:1px solid #DD4930;
                                    padding:1px 2px;
                                    margin-left:5px;
                                    color:#DD4930;
                                }
                            }
                            &.status0{
                                color:rgba(255, 255, 255, 0.5); // 未学习
                            }
                            &.status1{
                                color:#9D9E9F;    // 学习中
                                .statusIcon{
                                    span{
                                        width: 6px;
                                        height: 10px;
                                        display: block;
                                        background: #ce4390;
                                        border-top-left-radius: 6px;
                                        border-bottom-left-radius: 6px;
                                        border:#202228 solid 1px;
                                        border-top:#202228 solid 1px;
                                    }
                                }
                            }
                            &.status2{
                                color:#fff; // 已学习
                                .statusIcon{
                                    span{
                                        width: 10px;
                                        height: 10px;
                                        display: block;
                                        background: #ce4390;
                                        border-radius: 6px;
                                        border:1px solid #202228;
                                    }
                                }
                            }
                            &.statusPlay{
                                color:#fff !important; // 当前学习
                            }
                            &:hover{
                                color:#d54594 !important;
                            }
                        }
                    }
                }
            }
            .playBox-list.cur{
                .playBox{
                    width:100%;
                    span{
                        background-position: -20px 0;
                    }
                }
                .playList{
                    width:0;
                    padding:0;
                }
            }
        }
        .contentfonter{
            width:1200px;
            margin:0 auto;
            padding:20px 0;
            position: relative;
            z-index: 1;
            h5{
                height:48px;
                line-height: 48px;
                background:#fff;
                color:#575859;
                box-shadow: 0 0 3px #dedede;
                padding-left:40px;
                font-size:16px;
                position: relative;
                font-weight: 500;
                span{
                    position: absolute;
                    top:15px ;
                    left:26px;
                    width:4px;
                    height:18px;
                    background:#61C5FB;
                }
                p{
                    position: absolute;
                    top:7px;
                    right:20px;
                    width: 100px;
                    height: 34px;
                    line-height: 34px;
                    font-size: 14px;
                    background: #61C5FB;
                    color: #fff;
                    margin-left: auto;
                    text-align: center;
                    border-radius: 20px;
                    cursor: pointer;
                    text-indent: -10px;
                    em{
                        position: absolute;
                        top:9px;
                        right:13px;
                        border-bottom:1px solid #fff;
                        border-left:1px solid #fff;
                        width:7px;
                        height:7px;
                        transform: rotate(-45deg);
                        &:last-child{
                            top:14px;
                        }
                    }
                    &.cur{
                        em{
                            transform: rotate(135deg);
                            top:13px;
                            &:last-child{
                                top:18px;
                            }
                        }
                    }
                }
            }
            .questionsBox{
                background: #fff;
                padding:20px;
                .putQuestionsTo{
                    padding-bottom:10px;
                    .putQuestionsToBtn{
                        padding:10px 0;
                        p{
                            width:120px;
                            height:38px;
                            line-height: 38px;
                            background: #61C5FB;
                            color:#fff;
                            margin-left:auto;
                            text-align: center;
                            font-size: 16px;
                            &:hover{
                                background: #64c0f1;
                            }
                        }
                    }
                }
                .problemBox{
                    padding:10px 0;
                    .li{
                        margin-bottom:20px;
                        padding:20px 20px 10px;
                        border-radius: 8px;
                        background:#F4F9FC;
                        box-shadow: 0 2px 5px #dedede;
                        .topInner{
                            display: flex;
                            .userPic{
                                width: 140px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                padding-right:20px;
                                p{
                                    padding-top:10px;
                                }
                                .userName{
                                    width:100%;
                                    overflow: hidden;
                                    -ms-text-overflow: ellipsis;	
	                                text-overflow: ellipsis;	
	                                white-space: nowrap;  
                                    text-align: center;
                                }
                                .pic{
                                    width:40px;
                                    height:40px;
                                    border-radius: 50%;
                                    background:#dedede;
                                    text-align: center;
                                    line-height: 40px;
                                    padding-top: 0;
                                    font-size: 20px;
                                    font-weight: bold;
                                }
                            }
                            .SubjectName{
                                width:-moz-calc(100% - 140px );
                                width:calc( 100% - 140px );
                                margin-bottom:10px;
                                padding-bottom: 10px;
                                overflow: hidden;
                                max-height:120px;
                                position: relative;
                                div{
                                    padding-bottom:20px;
                                    overflow-x: auto;
                                    width:100%;
                                }
                                .seeAll{
                                    position: absolute;
                                    bottom:0px;
                                    left:0;
                                    width: 100%;
                                    height:40px;
                                    padding-top: 10px;
                                    line-height: 30px;
                                    background: linear-gradient(180deg,rgba(255, 255, 255, 0) 0, #F4F9FC 100%);
                                    text-align: center;
                                    text-shadow:#00ff00;
                                    span{
                                        background:#F4F9FC ;
                                    }
                                }
                                &.cur{
                                    max-height:fit-content;
                                }
                            }
                        }
                        
                        .barlINE{
                            padding:10px 0;
                            padding-left:140px;
                            display: flex;
                            font-size:12px;
                            p{
                                margin-right:20px;
                                color:#63676b;
                                font-size: 14px;
                            }
                            .huidashu{
                                position: relative;
                                padding-right:20px;
                                span{
                                    display: block;
                                    width:8px;
                                    height:8px;
                                    border-left:2px solid #63676b;
                                    border-bottom:2px solid #63676b;
                                    position: absolute;
                                    top:5px;
                                    right:5px;
                                    transform: rotate(-45deg);
                                }
                                &.cur{
                                    span{
                                        top:8px;
                                        transform: rotate(135deg);
                                    }
                                }
                                &:hover{
                                    color:#d54594;
                                    span{
                                        border-color:#d54594;
                                    }
                                }
                            }
                        }
                        .liBtn{
                            padding:10px 0;
                            p{
                                width:100px;
                                height:32px;
                                line-height: 32px;
                                font-size:14px;
                                background: #61C5FB;
                                color:#fff;
                                margin-left:auto;
                                text-align: center;
                                border-radius: 20px;
                                &:hover{
                                    background: #64c0f1;
                                }
                            }
                        }
                        .AnswerStr{
                            padding:10px 30px;
                            padding-left:140px;
                            .title{
                                font-size: 14px;
                                background: #f4f5f6;
                                padding:5px 10px;
                            }
                            .answerListLi{
                                padding:20px 0;
                                border-bottom:1px dashed #b8bbbd;
                                display: flex;
                                .userPic{
                                    width: 140px;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    padding-right:20px;
                                    p{
                                        padding-top:10px;
                                        word-wrap: break-word;
                                        word-break: normal;
                                    }
                                    .userName{
                                        width:100%;
                                        overflow: hidden;
                                        -ms-text-overflow: ellipsis;	
	                                    text-overflow: ellipsis;	
	                                    white-space: nowrap;  
                                        text-align: center;
                                    }
                                    .pic{
                                        width:40px;
                                        height:40px;
                                        border-radius: 50%;
                                        background:#dedede;
                                        text-align: center;
                                        line-height: 40px;
                                        padding-top: 0;
                                        font-size: 20px;
                                        font-weight: bold;
                                    }
                                }
                                .answerContent{
                                    width:calc( 100% - 140px );
                                    .answerContentName{
                                        width:100%;
                                        overflow: hidden;
                                        max-height:120px;
                                        position: relative;
                                        div{
                                            padding-bottom:20px;
                                            overflow-x: auto;
                                            width:100%;
                                        }
                                        .seeAll{
                                            position: absolute;
                                            bottom:0px;
                                            left:0;
                                            width: 100%;
                                            height:40px;
                                            padding-top: 10px;
                                            line-height: 30px;
                                            background: linear-gradient(180deg,rgba(255, 255, 255, 0) 0, #F4F9FC 100%);
                                            text-align: center;
                                            text-shadow:#00ff00;
                                            span{
                                                background:#F4F9FC ;
                                            }
                                        }
                                        &.cur{
                                            max-height:fit-content;
                                        }
                                    }
                                    .barlINE{
                                        padding:10px 0;
                                    }
                                }
                            }
                            .lib{
                                justify-content: center; 
                                font-size: 14px;
                                padding-left:0;
                            }
                        }
                        .botInner{
                            padding-left:140px;
                            .Botm-line{
                                display: flex;
                                justify-content: flex-end;
                                p{
                                    margin: 0;
                                    cursor: pointer;
                                }
                                .cancel{
                                    background: #c1c1c1;
                                }
                                .Submit{
                                    margin-left:20px;
                                }
                            }
                        }
                    }
                }
            }
            .pageAllCoures{
                display: flex;
                justify-content: center;
                padding:10px 0;
                /deep/.ivu-page-item{
                    border:none;
                    color:#585858;
                    margin-right: 15px;
                    border-radius: 50%;
                    a {
                        height:100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    &:focus a,
                    &:hover a {
                        color: #c73e7f;
                    }
                }
                /deep/.ivu-page-item-active {
                    background: #585858;
                    a,
                    &:focus a,
                    &:hover a { 
                        color:#fff;
                    }
                }
                /deep/.ivu-page-prev,
                /deep/.ivu-page-jump-prev,
                /deep/.ivu-page-jump-next {
                    margin-right: 15px;
                }
                &.AnswerStrPage{
                    /deep/.ivu-page-next,
                    /deep/.ivu-page-prev {
                        background: none ;
                    }
                }
            }
        }
    }
</style>