import request from '@/utils/request/index'

export function upload(query) {
    return request({
        url: `/upload`,
        method: 'post',
        data: query
    })
}


export function checkUpload(query) {
    return request({
        url: `/upload`,
        method: 'get',
        params: query
    })
}
