<template>
    <div class="ali-video">
        <div class="in-player"  @click="playBtnBox" :id="playerId" :style="{height:videoObj.height}"></div>
    </div>
</template>

<script>
// aliplayer h5 格式播放器的 js 地址
const jsPath = "https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-h5-min.js";
// aliplayer h5 格式播放器的 css 地址
const cssPath = "https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css";

// 启用私有加密的防调式
// 通过引入aliiplayer-vod-anti-min.js文件开启防调试模式，考虑到在开发过程 中的调式， 用户可以在发布的产品中才引入，Javascript文件的地址：
// const jsVodPath = "https://g.alicdn.com/de/prismplayer/2.8.2/hls/aliplayer-vod-anti-min.js"


var time = null;  //  在这里定义time 为null 

export default {
    name: "in-player",
    props: {
        videoObj: Object
    },
    data() {
        return {
            videoShow:false,
            // 点击次数
            clickCount:0,
            // 每个播放器都具有单独的 id
            playerId: "inPlayer" + Math.random() * 100000000000000000,
            // 通过 vid 从后端获取到的鉴权地址
            playAuth: null,
            // 播放器实例
            inPlayer: null,
            // 点播自定义属性
            skinLayout:[
                {name: "bigPlayButton", align: "blabs",x:50 , y:80}, // 播放按钮
                {name: "H5Loading", align: "cc"}, // h5加载动画
                {name: "errorDisplay", align: "tlabs", x: 0, y: 0}, // 错误提示
                {name: "infoDisplay"}, // 信息提示
                {name:"tooltip", align:"blabs",x: 0, y: 56}, // 按钮提示
                {name: "thumbnail"}, // 缩略图
                {
                    name: "controlBar", align: "blabs", x: 0, y: 0, // 控制条
                    children: [
                        {name: "progress", align: "blabs", x: 0, y: 44}, // 进度条
                        {name: "playButton", align: "tl", x: 15, y: 12}, // 播放按钮
                        {name: "timeDisplay", align: "tl", x: 10, y: 7}, // 播放时间显示
                        {name: "fullScreenButton", align: "tr", x: 10, y: 12}, // 全屏
                        // {name:"subtitle", align:"tr",x:15, y:12}, // 字幕
                        {name:"setting", align:"tr",x:15, y:12}, // 设置
                        {name: "volume", align:"tr",x:15, y:10}, // 音量
                        {name: "snapshot", align: "tr", x: 15, y: 9}, // 截屏
                    ]
                },
            ],
        
            // 直播自定义属性
            skinLayoutLive: [
                {name: "bigPlayButton", align: "blabs", x: 50, y: 80}, // 播放按钮
                {name: "errorDisplay", align: "tlabs", x: 0, y: 0},// 错误提示
                {name: "infoDisplay", align: "cc"},// 信息提示
                {
                    name: "controlBar", align: "blabs", x: 0, y: 0, // 控制条
                    children: [
                        {name:"liveDisplay", align:"tlabs", x: 15, y:6}, // 显示直播
                        {name:"fullScreenButton", align:"tr", x:10, y: 12}, // 全屏
                        // {name:"subtitle", align:"tr",x:15, y:12}, // 字幕
                        {name:"setting", align:"tr",x:15, y:12}, // 设置
                        {name: "volume", align:"tr",x:15, y:10}, // 音量
                        {name: "snapshot", align: "tr", x: 15, y: 9}, // 截屏
                    ]
                }
            ]
        };
    },
    watch: {},
    computed: {
    },
    created() {},
    mounted() {
        // 在 mounted() 中初始化播放器，是为了确保基本元素都已经加载
        // this._initialize();
    },
    methods: {
        // 初始化
        _initialize() {
            // 判断播放器全局实例是否已存在，只有当播放器依赖的 JS 加载完成后，播放器的全局实例才存在
            if (!window.Aliplayer) {
                // 尝试获取播放器的 JS 标签
                let inPlayerScriptTag = document.getElementById(
                    "inPlayerScriptTag"
                );

                // 判断JS是否已存在
                if (!inPlayerScriptTag) {
                    // 不存在则创建 JS 标签
                    inPlayerScriptTag = document.createElement("script");
                    inPlayerScriptTag.type = "text/javascript";
                    // 指定 JS 的地址
                    inPlayerScriptTag.src = jsPath;
                    // 指定 JS 的 ID
                    inPlayerScriptTag.id = "inPlayerScriptTag";

                    // JS 不存在说明 CSS 也不存在，则创建 CSS 标签
                    let inPlayerLinkTag = document.createElement("link");
                    inPlayerLinkTag.type = "text/css";
                    inPlayerLinkTag.rel = "stylesheet";
                    // 指定 CSS 的地址
                    inPlayerLinkTag.href = cssPath;

                    // 获取页面的 <head> 标签
                    let head = document.getElementsByTagName("head")[0];
                    // 将 JS 和 CSS 插入到 DOM 中
                    head.appendChild(inPlayerScriptTag);
                    head.appendChild(inPlayerLinkTag);
                }

                // JS 插入并加载完成
                if (inPlayerScriptTag.loaded) {
                    // 初始化播放器
                    this._initPlayer();
                } else {
                    // JS 没有加载完成，则监听 JS 的加载事件
                    inPlayerScriptTag.addEventListener("load", () => {
                        // JS 确认加载完成后，初始化播放器
                        this._initPlayer();
                    });
                }
            } else {
                // 全局实例存在则直接初始化播放器
                this._initPlayer();
            }
        },
        // 初始化播放器
        _initPlayer() {
            // 确保 DOM 元素都已经渲染完毕
            // this.$nextTick(() => {
                // 判断播放器实例是否存在
                if (!this.inPlayer) {
                    // 获取鉴权地址，从后端获取
                    // this.$fetch.video.auth({
                    //     vid: this.videoObj.vid
                    // })
                    // .then(res => {
                        // 接收从后端获取的鉴权地址，后端实现不赘述
                        // this.playAuth = res.data;
                        let skinLayout = this.videoObj.isLive?this.skinLayoutLive : this.skinLayout;
                        // 初始化播放器
                        this.inPlayer = window.Aliplayer({
                            // 播放器外层容器的dom元素id。
                            id: this.playerId,
                            // 视频播放地址
                            source: this.videoObj.source,
                            // 视频的 VID
                            vid: this.videoObj.vid,
                            // 鉴权地址
                            // playauth: this.playAuth,
                            // 宽度
                            width: this.videoObj.width || '100%',
                            // 高度
                            height: this.videoObj.height || '500px',
                            // 播放器自动加载
                            preload:this.videoObj.preload || false,
                            // 播放器默认封面图片
                            cover:this.videoObj.cover || '',
                            // 播放器自动循环播放
                            rePlay:this.videoObj.rePlay || false,
                            // 使用 H5 格式
                            useH5Prism: true,
                            // 不是直播
                            isLive: this.videoObj.isLive || false,
                            // 不自动播放
                            autoplay: this.videoObj.autoplay || false,
                            // 皮肤
                            skinLayout:this.videoObj.skinLayout || skinLayout,
                            // 显示视频清晰度,取值范围：FD（流畅）LD（标清）SD（高清）HD（超清）OD（原画）2K（2K）4K（4K），仅H5支持。'FD,LD,SD,HD,OD,2K,4K'
                            definition:this.videoObj.definition || '',
                            // 默认视频清晰度，此值是vid对应流的一个清晰度，
                            defaultDefinition:this.videoObj.defaultDefinition || '',
                            extraInfo: {
                                "crossOrigin": "anonymous"
                            },
                            snapshotWatermark:{
                                left:"100",
                                top:"100",
                                text:"马士兵教育",
                                font:"italic bold 60px 宋体",
                                strokeColor:"rgba(255,255,255,0.1)",
                                fillColor:'rgba(0,0,0,0.1)'
                            }
                        },(player) => {
                            // debugger
                            let seekTime = this.videoObj.seekTime || 0;
                            if( this.videoObj.source.indexOf('.flv')==-1 ){
                                player.seek(seekTime);
                            }
                            player.on('ended',()=>{
                                // 视频播放结束
                                this.endPlay()
                            }).on('timeupdate',()=>{
                                // 视频播放中
                                this.timeUpDate()
                            }).on('ready',()=>{
                                if( this.videoObj.source.indexOf('.flv')>-1 ){
                                    player.seek(seekTime);
                                }
                            }).on('error',()=>{
                                console.log('视频出错，重试吧')
                            }).on("snapshoted", function(data) {
                                // 截图
                                if(data.paramData.base64){
                                    var pictureData = data.paramData.base64;
                                    var downloadElement = document.createElement('a')
                                    downloadElement.setAttribute('href', pictureData)
                                    var fileName = 'Aliplayer' + Date.now() + '.png'
                                    downloadElement.setAttribute('download', fileName)
                                    downloadElement.click()
                                    pictureData = null
                                }
                            })
                        });
                    // });
                } else {
                    // 销毁播放实例
                    // 存在播放器实例则先销毁组件
                    this.inPlayer.dispose();
                    // 将播放器实例重置
                    this.inPlayer = null;
                    // 清空播放器 DOM 内容
                    document.getElementById(this.playerId).innerHTML = "";
                    // 再次初始化
                    this._initPlayer();
                }
            // });
        },
        // 销毁播放实例
        disposeVideo(){
            // 存在播放器实例则先销毁组件
            this.inPlayer.dispose();
        },
        // 播放结束
        endPlay(){
            // 如果当前播放为全屏则退出全屏
            if(this.inPlayer.fullscreenService.getIsFullScreen()){
                this.inPlayer.fullscreenService.cancelFullScreen()
            }
            // 获取视频播放时间
            let time = this.inPlayer.getDuration()
            // 调用上级组件的结束事件
            this.$emit('endPlay',time||'')
        },
        // 暂停视频
        pauseVideo(){
            this.inPlayer.pause()
        },
        // 获取视频状态
        getVideoStatus(){
            let VideoStatus = this.inPlayer.getStatus()
            return VideoStatus;
        },
        // 设置音量
        setVideoVolume(val){
            let Volume = this.inPlayer.getVolume()
            if(val == '+' && Volume < 1){
                let newVolume = Volume + 0.1 > 1 ? 1 : Volume + 0.1
                this.inPlayer.setVolume( newVolume )
            }else if(val == '-' && Volume > 0){
                let newVolume = Volume - 0.1 < 0 ? 0 : Volume - 0.1
                this.inPlayer.setVolume( newVolume ) 
            }
        },
        // 设置播放进度
        setVideoSeekTime(val){
            let CurrentTime = this.inPlayer.getCurrentTime()
            let DurationTime = this.inPlayer.getDuration()
            if(val == '+' && CurrentTime < DurationTime){
                let newTime = CurrentTime + 10 > DurationTime ? DurationTime : CurrentTime + 10
                this.inPlayer.seek( newTime )
                this.setLeftRightBtnBox('leftV')
            }else if(val == '-' && CurrentTime > 0){
                let newTime = CurrentTime - 10 < 0 ? 0 : CurrentTime - 10
                this.inPlayer.seek( newTime ) 
                this.setLeftRightBtnBox('rightV')
            }
        },
        // 动态设置快进快退按钮
        setLeftRightBtnBox(val){
            let div = `<div class="${val}"></div>`
            $(`.in-player .${val}`).remove()
            $('.in-player').append(div)
            setTimeout(()=>{
                $(`.in-player .${val}`).remove()
            },200)
        },
        // 播放时间变化
        timeUpDate(){
            // 获取当前播放时间
            let time = this.inPlayer.getCurrentTime()
            // 调用上级组件的结束事件
            // 当视频播放中或播放结束的时候更新时间
            let videoStatus = this.inPlayer.getStatus()
            if(videoStatus == 'playing' || videoStatus == 'ended'){
                this.$emit('timeUpDate',time)
            }
        },
        // 单击或者双击
        playBtnBox(e){
            if(e.target.localName != 'video' && e.target.className != 'prism-animation' && e.target.className != 'prism-info-display'){
                return;
            }
            // ‘init’初始，‘ready’'准备好'，‘loading’正在加载，‘play’播放，‘pause’暂停，‘playing’播放 ，‘waiting’等待 ，‘error’错误，‘ended’结束
            this.clickCount++;
            clearTimeout(time);
            if (this.clickCount == 2) { //当点击次数为2
                this.clickCount = 0; //记得清零
                //  触发双击事件...
                // console.log(this.inPlayer.fullscreenService.getIsFullScreen())
                if(this.inPlayer.fullscreenService.getIsFullScreen()){
                    this.inPlayer.fullscreenService.cancelFullScreen()
                }else{
                    this.inPlayer.fullscreenService.requestFullScreen()
                }
            }
            time = setTimeout( () => {
                if (this.clickCount == 1) {
                    this.clickCount = 0; // 单击清零
                    //  触发单击事件...
                    let videoStatus = this.inPlayer.getStatus()
                    // console.log(videoStatus)
                    if(videoStatus == 'ended'){
                        this.inPlayer.replay()
                        return
                    }
                    if(videoStatus != 'play' && videoStatus != 'playing'){
                        this.inPlayer.play()
                    }else{
                        this.inPlayer.pause()
                        let playBtn = document.getElementsByClassName('prism-big-play-btn')[0];
                        playBtn.style.display='block';
                    }
                }
            }, 300)
        }
    }
};
</script>
<style lang='less'>
    .ali-video{
        transition: 0.3s  height 0s;
    }
    .leftV{
        width:100px;
        height:100px;
        position: absolute;
        z-index: 1000;
        left:50%;
        top:50%;
        margin-top: -50px;
        margin-left: -50px;
        background: url('../assets/images/icon/leftV.png') no-repeat center/100px auto;
    }
    .rightV{
        width:100px;
        height:100px;
        position: absolute;
        z-index: 1000;
        left:50%;
        top:50%;
        margin-top: -50px;
        margin-left: -50px;
        background: url('../assets/images/icon/leftV.png') no-repeat center/100px auto;
        transform: rotateY(180deg);
    }
    .prism-controlbar-bg{
        background: rgba(0,0,0,0.7)!important;
    }
</style>