import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

export function listUser(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}


// 新增用户
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/user/' + praseStrEmpty(userId),
    method: 'delete',
  })
}

// 删除用户
export function delUsers(userIds) {
  return request({
    url: '/user',
    method: 'delete',
    data: userIds
  })
}

// 用户密码重置
export function resetUserPassword(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/user/resetPassword',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPassword(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/user/profile/updatePassword',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/user/profile/avatar',
    method: 'post',
    data: data
  })
}