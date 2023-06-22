import request from '@/utils/request'
// let baseURL = process.env.VUE_APP_BASE_API_Notice
let baseURL = VUE_APP_BASE_API

// 获取列表
export function get_List (data) {
  return request({
    baseURL: baseURL,
    url: '/findMany',
    method: 'post',
    data: data
  })
}
// 获取信息
export function get_Info (data) {
  return request({
    baseURL: baseURL,
    url: '/findOne',
    method: 'post',
    data: data
  })
}
// 添加信息
export function add_List (data) {
  return request({
    baseURL: baseURL,
    url: '/insertOne',
    method: 'post',
    data: data
  })
}
// 编辑信息
export function set_List (data) {
  return request({
    baseURL: baseURL,
    url: '/updateOne',
    method: 'post',
    data: data
  })
}
// 删除信息
export function del_List (data) {
  return request({
    baseURL: baseURL,
    url: '/deleteOne',
    method: 'post',
    data: data
  })
}
// 自定义
export function executeSql (data) {
  return request({
    baseURL: baseURL,
    url: '/executeSql',
    method: 'post',
    data: data
  })
}