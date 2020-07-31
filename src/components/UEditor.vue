<template>
    <div id='vueUeditor'>
        <vue-ueditor-wrap
            ref="ueditor"
            v-model="valueText"
            :destroy="false"
            :config="myConfig"
            @ready="ready"
            @beforeInit="addCustomUI"
        ></vue-ueditor-wrap>
    </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap';
export default {
    props: ["catchData","ueditorId"], // 接收父组件的方法
    components: {
        VueUeditorWrap //ueditor富文本编辑器
    },
    data() {
        return {
            valueText:'',
            // 4、根据项目需求自行配置,具体配置参见ueditor.config.js源码或 http://fex.baidu.com/ueditor/#start-start
            myConfig: {
                toolbars:[[
                    'paragraph', /*标题*/ 'fontfamily', /*字体*/ 'fontsize', /*字号*/ 'insertcode',/*代码语言*/ '|',
                    'undo', /*撤销*/ 'redo',  /*反向撤销*/ 'selectall',/*全选*/ 'cleardoc', /*清空文档*/ '|',
                    'bold',  /*加粗*/ 'italic',  /*倾斜*/ 'underline', /*下划线*/ 
                    // 'fontborder', /*文字边框*/ 'strikethrough',/*中划线*/ 
                    'removeformat',/*删除格式*/ 'formatmatch', /*格式刷*/ 
                    // 'autotypeset', /*自动排版*/ 'blockquote', /*引用*/ 'pasteplain',  /*纯文本粘贴模式*/ '|', 
                    'forecolor',/*字体色*/ 'backcolor',/*背景色*/ 
                    // 'insertorderedlist', /*有序列表*/ 'insertunorderedlist',/*无序列表*/ '|',
                    // 'rowspacingtop', /*段前距*/ 'rowspacingbottom',/*段后距*/ 'lineheight',/*行间距*/ '|',
                    'justifyleft', /*左对齐 */ 'justifycenter',/*居中对齐 */ 'justifyright', /*右对齐 */ 'justifyjustify', /*两端对齐 */ '|',
                    'link',/*链接*/'emotion',/*表情*/
                    // 'date',/*日期*/'time',/*时间*/ 
                    // 'spechars', /*特殊符号*/ '|',
                    // 'inserttable',/*表格*/'deletetable',/*删除表格*/'insertparagraphbeforetable',/*表格前插入行*/'insertrow',/*插入行*/ 'deleterow',/*删除行*/ 'insertcol',/*插入列*/'deletecol',/*删除列*/'mergecells',/*合并单元格*/ 'mergeright',/*向右合并*/'mergedown',/*向下合并*/ 'splittocells',/*分裂单元格*/'splittorows',/*分裂单元格*/ 'splittocols',
                ]],
                // serverUrl: `${__GATEWAYPATH__}/ueditor/ueditorConfig`, // 上传功能的后端服务器接口地址
                serverUrl: ``, // 上传功能的后端服务器接口地址
                UEDITOR_HOME_URL: '/UEditor/', // 你的UEditor资源存放的路径,相对于打包后的index.html
                autoHeightEnabled:false , // 编辑器是否自动被内容撑高
                autoFloatEnabled: false, // 工具栏是否可以浮动
                initialFrameHeight: 340, // 初始容器高度
                initialFrameWidth: '100%', // 初始容器高度
                zIndex:400,
                enableAutoSave: false, // 关闭自动保存
            }
        };
    },
    watch: {
        'valueText':function(nvl,old){
            this.catchData( this.ueditorId , nvl ); // 把这个html通过catchData的方法传入父组件
        }
    },
    computed: {},
    methods: {
        // 清空内容
        editorClear(){
            this.valueText = ''
        },
        // 5、 你可以在ready方法中拿到editorInstance实例,所有API和官方的实例是一样了。http://fex.baidu.com/ueditor/#api-common
        ready(editorInstance) {
            // console.log(`实例${editorInstance.key}已经初始化:`, editorInstance);
        },
        // 7. 借助 beforeInit 钩子，你可以实现对 UEditor 的二次开发，会在 scripts 加载完毕之后、编辑器初始化之前触发，以 编辑器 id 和 配置参数 作为入参
        addCustomUI(editorId, editorConfig) {
            // console.log(
            //     editorId + "的配置参数是:",
            //     JSON.stringify(editorConfig, null, 2)
            // );
        }
    },
    created() {},
    mounted() {}
};
</script>
<style lang='less'>
</style>