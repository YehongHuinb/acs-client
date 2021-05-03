import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

export function listExam(query) {
  return request({
    url: '/exam/list',
    method: 'get',
    data: query
  })
}

export function listClassesExam(query, classesId) {
  return request({
    url: '/exam/' + praseStrEmpty(classesId) + '/list',
    method: 'get',
    data: query
  })
}

export function getExam(examId) {
  return request({
    url: '/exam/' + praseStrEmpty(examId),
    method: 'get'
  })
}

export function getClassesExam(classesId,examId) {
  return request({
    url: '/exam/' + praseStrEmpty(classesId) + '/' + praseStrEmpty(examId),
    method: 'get'
  })
}

export function getUserExam(classesId,examId,userId) {
  return request({
    url: '/exam/' + praseStrEmpty(classesId) + '/' + praseStrEmpty(examId) + '/' + praseStrEmpty(userId),
    method: 'get'
  })
}


export function addExam(data) {
  return request({
    url: '/exam',
    method: 'post',
    data: data
  })
}

export function updateExam(data) {
  return request({
    url: '/exam/update',
    method: 'put',
    data: data
  })
}

export function submitExam(data) {
  return request({
    url: '/exam/submit',
    method: 'post',
    data: data
  })
}

export function markExam(data) {
  console.log(data);
  return request({
    url: '/exam/mark',
    method: 'post',
    data: data
  })
}

export function deleteExam(examId) {
  return request({
    url: '/exam/' + praseStrEmpty(examId),
    method: 'delete'
  })
}