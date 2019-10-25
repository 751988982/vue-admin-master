import http from './public'
const baseUrl = '/api'
// 管理员登陆
export const adminLogin = (params) => {
  return http.fetchGet(`${baseUrl}/admin/login`, params)
}

//获取用户列表 
export const getUserListPage = (params) => {
  return http.fetchPost(`${baseUrl}/users/getUserListPage`, params)
}

//升级管理员
export const editAdmin = (params) => {
  return http.fetchPost(`${baseUrl}/users/editAdmin`, params)
}

//修改密码 
export const setpswd = (params) => {
  return http.fetchPost(`${baseUrl}/users/setpswd`, params)
}

//获取佣金列表 
export const getCommissionList = (params) => {
  return http.fetchPost(`${baseUrl}/users/getCommissionList`, params)
}

//修改代理等级 
export const setAgencylevel = (params) => {
  return http.fetchPost(`${baseUrl}/users/setAgencylevel`, params)
}