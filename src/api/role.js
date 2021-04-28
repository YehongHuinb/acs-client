import request from '@/utils/request'

export function listRole() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}