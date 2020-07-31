// vue.config.js
var distName = 'video('+formatDate()+')';
function formatDate() {
  var date = new Date();
  var month = (date.getMonth() + 1).toString();
  var day = date.getDate().toString();
  var hours = date.getHours().toString();
  var minutes = date.getMinutes().toString();
  var seconds = date.getSeconds().toString();
  return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes;
};
module.exports = {
  //  基本路径
  // publicPath: process.env.NODE_ENV === 'production' ? '/public/' : './',

  publicPath: '/',
  //  构建时的输出目录 /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  outputDir: distName,
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "assets",
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
  filenameHashing: false,
  // 代码保存时进行eslint检测 有效的值：`ture` | `false` | `"error"`
  lintOnSave: false,

  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= '马士兵老师(北京)教育'
        return args
      })
  },
  configureWebpack:{
		// 这里配置CDN引入的内容
		externals: {
      'vue': 'Vue',
      'vue-meta': 'VueMeta',
      'vue-router': 'VueRouter',
			'axios': 'axios'
		},
	},
  /* webpack-dev-server 相关配置 */
  devServer: {
    open: true,
    host: '172.16.10.169',
    port: 8066,
    https: false,
    hotOnly: false,
    /* 使用代理 */
    // proxy: {
    //   '/api': {
    //     /* 目标代理服务器地址 */
    //     target: 'http://msbvideo.mingfei.wang:8084/',
    //     /* 允许跨域 */
    //     changeOrigin: true,
    //   },
    // },
  },
}