<template>
    <div id="wangeditor">
        <div ref="editorElem" :id="wangeditorId"></div>
    </div>
</template>
<script>
import E from "wangeditor";
export default {
    components: {},
    // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
    props: ["catchData","wangeditorId","defaultText"], // 接收父组件的方法
    data() {
        return {
            editor: null,
            editorContent: ""
        };
    },
    watch: {},
    computed: {},
    methods: {
        // 清空内容
        editorClear(){
            this.editor.txt.clear()
        },
        // 设置默认文案
        setEditorText(){
            if(this.defaultText){
                this.editor.txt.html('<p>' + this.defaultText + '</p></br>') // 默认展示文案
            }
        }
    },
    created() {},
    mounted() {
        this.editor = new E(this.$refs.editorElem);
        // 编辑器的事件，每次改变会获取其html内容
        this.editor.customConfig.onchange = html => {
            this.editorContent = html;
            this.catchData( this.wangeditorId , this.editorContent ); // 把这个html通过catchData的方法传入父组件
        };
        this.editor.customConfig.onfocus = () => {
            // console.log("onfocus")
            let html = this.editor.txt.html()
            this.$emit('DeleteKeyDestroyed')
            if( html === '<p>请输入您的问题:</p><br>' || html === '<p>请输入您的回答:</p><br>'){
                this.editorClear()
            }
        };
        this.editor.customConfig.onblur = () => {
            let html = this.editor.txt.html()
            // console.log(html)
            this.$emit('AddKeyDestroyed')
            if( html === '<p><br></p>'){
                this.setEditorText()
            }
        };

        this.editor.customConfig.menus = [
            // 菜单配置
            "head", // 标题
            "bold", // 粗体
            "fontSize", // 字号
            "fontName", // 字体
            "italic", // 斜体
            "underline", // 下划线
            "strikeThrough", // 删除线
            "foreColor", // 文字颜色
            // "backColor", // 背景颜色
            "link", // 插入链接
            // "list", // 列表
            "justify", // 对齐方式
            "quote", // 引用
            // "emoticon", // 表情
            // "image", // 插入图片
            // "table", // 表格
            "code", // 插入代码
            // "undo", // 撤销
            // "redo" // 重复
        ];
        // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
        this.editor.customConfig.emotions = [
            {
                // tab 的标题
                title: 'emoji',
                // type -> 'emoji' / 'image'
                type: 'emoji',
                // content -> 数组
                content: ['😀','😁','😂','😃','😄','😅','😆','😉','😊','😋','😎','😇','😐','😑','😶','😏','😣','😥','😮','😯','😪','😫','😴','😌','😛','😜','😝','😒','😓','😔','😕','😲','😷','😖','😞','😟','😤','😢','😭','😦','😧','😨','😬','😰','😱','😳','😵','😡','😠']
            },
            {
                title:'手势',
                type: 'emoji',
                content: ['💪','👈','👉','👆','👇','✋','👌','👍','👎','✊','👊','👋','👏','👐']
            },
            {
                title:'箭头',
                type: 'emoji',
                content: ['⬆','↗','➡','↘','⬇','↙','⬅','↖','↕','↔','↩','↪','⤴','⤵','🔃','🔄','🔙','🔚','🔛','🔜','🔝']
            }
        ]
        // 自定义配置颜色（字体颜色、背景色）
        this.editor.customConfig.colors = [
            '#000000', 
            '#1c487f',
            '#4d80bf',
            '#c24f4a',
            '#8baa4a',
            '#7b5ba1',
            '#46acc8',
            '#f9963b'
        ]
        this.editor.create(); // 创建富文本实例
        
        this.setEditorText()
    }
};
</script>
<style lang='less'>
    #wangeditor{
        pre{
            code{
                overflow-x:auto ;
            }
        }
    }
</style>