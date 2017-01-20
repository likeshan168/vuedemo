import axios from 'axios';

let base = 'http://localhost:63787/api/account';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
export const requestRegister = params => { return axios.post(`${base}/register`, params).then(res => res.data); };
export const updateUser = params => { return axios.post(`${base}/update`, params).then(res => res.data);};
export const deleteUser = params => { return axios.post(`${base}/delete`, params).then(res => res.data);};
export const getUserList = params => { return axios.post(`${base}/getList`, params).then(res => res.data);};
//local store
const USER_KEY = 'user';
export const fetchUser = () => {
    let userStr = JSON.parse(localStorage.getItem(USER_KEY) || '');
    return userStr || { name: '', password: '' };
}