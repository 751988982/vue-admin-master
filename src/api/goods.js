import http from './public'
const baseUrl = '/api'

//币种列表
export const coinList = (params) => {
  return http.fetchPost(`${baseUrl}/goods/coinList`, params)
}

//修改币种
export const editCoin = (params) => {
  return http.fetchPost(`${baseUrl}/goods/editCoin`, params)
}

//添加币种
export const addCoin = (params) => {
  return http.fetchPost(`${baseUrl}/goods/addCoin`, params)
}

//删除币种
export const removeCoin = (params) => {
  return http.fetchPost(`${baseUrl}/goods/removeCoin`, params)
}

//后台充值记录
export const rechargeList = (params) => {
  return http.fetchPost(`${baseUrl}/goods/rechargeList`, params)
}

//审核
export const editRecharge = (params) => {
  return http.fetchPost(`${baseUrl}/goods/editRecharge`, params)
}

//后台提币记录
export const withdrawalList = (params) => {
  return http.fetchPost(`${baseUrl}/goods/withdrawalList`, params)
}

//倍数列表 
export const beiList = (params) => {
  return http.fetchPost(`${baseUrl}/goods/beiList`, params)
}

//添加倍数
export const addBei = (params) => {
  return http.fetchPost(`${baseUrl}/goods/addBei`, params)
}

//游戏数据列表
export const gamebatList = (params) => {
  return http.fetchPost(`${baseUrl}/goods/gamebatList`, params)
}

//奖池列表查询
export const bankerList = (params) => {
  return http.fetchPost(`${baseUrl}/goods/bankerList`, params)
}

//资金列表查询 
export const capitalList = (params) => {
  return http.fetchPost(`${baseUrl}/goods/capitalList`, params)
}

//关闭充值提币订单 
export const closeRecharge = (params) => {
  return http.fetchPost(`${baseUrl}/goods/closeRecharge`, params)
}