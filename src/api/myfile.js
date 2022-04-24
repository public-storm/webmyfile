import request from '@/util/request/index'

// 上传
export function upload(query) {
    return request({
        url: `/upload`,
        method: 'post',
        data: query
    })
}

