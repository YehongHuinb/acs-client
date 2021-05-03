import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

export function listClasses(query) {
  return request({
    url: '/classes/list',
    method: 'get',
    params: query
  })
}

export function listClassesUser(query,classesId) {
  return request({
    url: '/classes/' + praseStrEmpty(classesId) + '/list',
    method: 'get',
    data: query
  })
}

export function getClassesInfo(classesId) {
  return request({
    url: '/classes/' + praseStrEmpty(classesId),
    method: 'get',
  })
}

export function addClasses(data) {
  return request({
    url: '/classes',
    method: 'post',
    data: data
  })
}

export function addClassesUser(classesId) {
  return request({
    url: '/classes/user/' + praseStrEmpty(classesId),
    method: 'get',
  })
}

export function updateClasses(data) {
  return request({
    url: '/classes',
    method: 'put',
    data: data
  })
}

export function deleteClasses(classesId) {
  return request({
    url: '/classes/' + praseStrEmpty(classesId),
    method: 'delete',
  })
}

export function deleteClassesUser(classesId,userId) {
  return request({
    url: '/classes/' + praseStrEmpty(classesId) + '/' + praseStrEmpty(userId),
    method: 'delete',
  })
}

export function quitClasses(classesId) {
  return request({
    url: 'classes/user/' + praseStrEmpty(classesId),
    method: 'delete',
  })
}