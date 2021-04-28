import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

export function listUserGrade(query,classesId,examId) {
  return request({
    url: '/user/grade/list/' + praseStrEmpty(classesId) + '/' + praseStrEmpty(examId),
    method: 'get',
    params: query
  })
}