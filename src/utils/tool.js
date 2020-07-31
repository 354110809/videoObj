/**
* 检测是否IE浏览器
*/
export const isIE = () => {
    const bw = window.navigator.userAgent
    const compare = s => bw.indexOf(s) >= 0
    const ie11 = (() => 'ActiveXObject' in window)()
    return compare('MSIE') || ie11
};
/**
* 浏览器全屏
*/
export const reqFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    }
};
/**
* 浏览器退出全屏
*/
export const exitFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.exitFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.mozCancelFullScreen();
    }
};
/**
* 时间格式化
*/
export const formatDate = (time, type, format) => {
    /*
    formatDate(1591249437770,'yyyy-MM-dd HH:mm:ss')
    * @param time
    * @param type (默认'yyyy-MM-dd HH:mm')
    * @param format
    * */
    var date = "";
    if (format) {
        date = time;
    } else {
        if (typeof time !== "number") {
            time = time.replace(/-/g, "/");
        }
        date = new Date(time);
    }

    type = type ? type : "yyyy-MM-dd HH:mm";

    var seperator1 = "-";
    var seperator2 = ":";
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();

    month = month.length === 1 ? ("0" + month) : month;
    day = day.length === 1 ? ("0" + day) : day;
    hours = hours.length === 1 ? ("0" + hours) : hours;
    minutes = minutes.length === 1 ? ("0" + minutes) : minutes;
    seconds = seconds.length === 1 ? ("0" + seconds) : seconds;

    if (type === "yyyy-MM-dd HH:mm:ss") {
        return date.getFullYear() + seperator1 + month + seperator1 + day + " " + hours + seperator2 + minutes + seperator2 + seconds;
    } else if (type === "yyyy-MM-dd HH:mm") {
        return date.getFullYear() + seperator1 + month + seperator1 + day + " " + hours + seperator2 + minutes;
    } else if (type === "yyyy-MM-dd") {
        return date.getFullYear() + seperator1 + month + seperator1 + day;
    } else if (type === "yyyy-MM") {
        return date.getFullYear() + seperator1 + month;
    } else if (type === "HH:mm") {
        return hours + seperator2 + minutes;
    }
};
/**
* 时间格式化 时间毫秒
*/
export const formatDuring = (time,type) => {
    var s = time / 1000;
    var days = ~~(s / 86400);
    var hours = ~~((s % 86400) / 3600);
    var minutes = ~~((s % 3600) / 60);
    var seconds = parseInt(s % 60);
    if(time<=0){
        return 0 + "天" + 0 + "小时" + 0 + "分";
    }

    if (type === "dd:hh:mm:ss") {
        return days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
    } else if (type === "dd:hh:mm") {
        return days + "天" + hours + "小时" + minutes + "分";
    }
};
/**
* 时间格式化 IE
*/
export const IEformatDate = (date,type) => {
    var arr=date.split("T");
    var d=arr[0];
    var darr = d.split('-');
    var t=arr[1];
    var tarr = t.split('.000');
    var marr = tarr[0].split(':');

    function PrefixZero(num, n=2) {
        return (Array(n).join(0) + num).slice(-n);
    }

    type = type ? type : "yyyy-MM-dd HH:mm";

    if (type === "yyyy-MM-dd HH:mm:ss") {
        var dd = parseInt(darr[0])+"-" + PrefixZero( parseInt(darr[1])) + "-"+PrefixZero(parseInt(darr[2]))+" "+PrefixZero(parseInt(marr[0]))+":"+(parseInt(marr[1]))+":"+PrefixZero(parseInt(marr[2]));
        return dd;
    } else if (type === "yyyy-MM-dd HH:mm") {
        var dd = parseInt(darr[0])+"-"+ PrefixZero( parseInt(darr[1]) ) +"-"+PrefixZero(parseInt(darr[2]))+" "+PrefixZero(parseInt(marr[0]))+":"+PrefixZero(parseInt(marr[1]));
        return dd;
    } else if (type === "yyyy-MM-dd") {
        var dd = parseInt(darr[0])+"-"+ PrefixZero( parseInt(darr[1])) +"-"+PrefixZero(parseInt(darr[2]));
        return dd;
    } else if (type === "yyyy-MM") {
        var dd = parseInt(darr[0])+"-"+ PrefixZero( parseInt(darr[1]) ) ;
        return dd;
    } else if (type === "HH:mm") {
        var dd = PrefixZero( parseInt(marr[0]))+":"+PrefixZero(parseInt(marr[1]));
        return dd;
    }
}