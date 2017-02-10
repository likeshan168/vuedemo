import axios from 'axios';

let base = 'http://localhost:63787/api/account';

export const requestLogin = params => {
    return axios.post(`${base}/login`, params).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};
export const requestRegister = params => { return axios.post(`${base}/register`, params).then(res => res.data); };
export const updateUser = params => { return axios.post(`${base}/update`, params).then(res => res.data); };
export const deleteUser = params => { return axios.post(`${base}/delete`, params).then(res => res.data); };
export const getUserList = params => { return axios.post(`${base}/getList`, params).then(res => res.data); };

//文件上传
let base1 = 'http://localhost:63787/api/commission';
export const commitData = params => {
    return axios.post(`${base1}/SaveData`, params).then(res => res.data).catch(err => {
        return { msg: '保存数据出错', code: 500 }
    });
};
export const GetCommissions = params => {
    return axios.post(`${base1}/GetCommissions`, params).then(res => res.data);
};
//local store
const USER_KEY = 'user';
export const fetchUser = () => {
    let userStr = JSON.parse(localStorage.getItem(USER_KEY) || '');
    return userStr || { name: '', password: '' };
}