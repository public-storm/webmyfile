import request from '@/utils/request/index'

export function upload(query) {
    return request({
        url: `/upload`,
        method: 'post',
        params: query
    })
}
