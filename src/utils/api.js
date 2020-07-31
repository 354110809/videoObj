var httpApi = window.configDomain.BASEURL;
var PICURL = window.configDomain.PICURL;
var API = {
    user:{
        getCode:    httpApi + '/msb-video-user/user/smsCode?phoneNumber', // 登录获取验证码
        Login:      httpApi + '/msb-video-user/user/login', // 登录认证
        Info:       httpApi + '/msb-video-user/user/infos', // 获取用户信息
        getToken:   httpApi + '/msb-video-user/user/refreshToken' // 获取用户token
    },
    Course:{
        IdChapters:id => `${httpApi}/msb-video-course/course/anon/${id}/chapters` , // 根据课程id获取课程目录
        UserChapters:(CId,UId) =>  `${httpApi}/msb-video-course/course/${CId}/user/${UId}/chapters`, // 获取用户课程目录及学习进度
        AddUserChapters:(CId,UId) =>  `${httpApi}/msb-video-course/course/${CId}/user/${UId}`, // 为用户添加课程
        Search:   httpApi + '/msb-video-course/course/anon/search', // 根据条件查询课程信息
        UserId: (UId) =>  `${httpApi}/msb-video-course/course/user/${UId}`, // 获取用户所有课程信息
        UserIdChapter: (chapterId,UID) =>  `${httpApi}/msb-video-course/course/user/chapter?chapterId=${chapterId}&userId=${UID}`, // 获取用户本节学习进度
        UpDataChapter:  httpApi + '/msb-video-course/course/user/chapter', // 更新用户学习进度
        indexList:  httpApi + '/msb-video-course/course/anon/index', // 首页分类课程接口
    },
    Chapter:{
        QuestionList:  (chapterId) =>  `${httpApi}/msb-video-course/question/anon/chapter/${chapterId}`, // 获取对应小节问题列表
        QuestionAdd:   httpApi + '/msb-video-course/question/add',      // 在对应小节提问
        AnswerAdd:   httpApi + '/msb-video-course/answer/add', // 对应问题进行回答
        AnswerList:  (chapterId) =>  `${httpApi}/msb-video-course/answer/anon/question/${chapterId}`, // 获取问题的所有答案
        Suggestion:  `${httpApi}/msb-video-course/anon/suggestion` // 问题反馈
    },
    video:{
        VdIdPlay:id =>  `${httpApi}/msb-video-course/vd/${id}/playUrl`, // 获取播放地址
    },
    Classification:{
        Categories: httpApi + '/msb-video-course/anon/categories', // 获取所有分类
        Category:   httpApi + '/msb-video-course/anon/category', // 根据条件获取分类
    }
}
export {API, httpApi , PICURL}