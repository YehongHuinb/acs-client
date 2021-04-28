import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

export function releaseExam(data) {
  return request({
    url: '/release',
    method: 'post',
    data: data
  })
}

export function updateRelease(data) {
  return request({
    url: '/release',
    method: 'put',
    data: data
  })
}

export function cancelRelease(classesId,examId) {
  return request({
    url: '/release/' + praseStrEmpty(classesId) + '/' + praseStrEmpty(examId),
    method: 'delete',
  })
}