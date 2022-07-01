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


export function login(query) {
    return request({
        url: `/login`,
        method: 'post',
        data: query
    })
}

export function createFile(data) {
    return request({
        url: `/directory`,
        method: 'post',
        data
    })
}

export function fileList(query) {
    return request({
        url: `/directory`,
        method: 'get',
        params: query
    })
}

export function deleteFile(query) {
    return request({
        url: `/directory`,
        method: 'delete',
        params: query
    })
}

export function download(data) {
    return request({
        url: `/download`,
        method: 'post',
        responseType: 'blob',
        data
    })
}
