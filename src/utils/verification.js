/**
* 手机号验证
*/
export const PhoneNumberValidation = (phonenum) => {
    let str = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
    if( str.test(phonenum) ) {
        return true;
    } else {
        return false;
    }
};

/**
* 邮箱验证
*/
export const EmailValidation = (email) => {
    let str = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if( str.test(email) ) {
        return true;
    } else {
        return false;
    }
};
