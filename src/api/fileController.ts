// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** testDownloadFile POST /api/file/test/download */
export async function testDownloadFileUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testDownloadFileUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<any>('/api/file/test/download', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** testUploadFile POST /api/file/test/upload */
export async function testUploadFileUsingPost(
  body: {},
  multipartFile?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (multipartFile) {
    formData.append('multipartFile', multipartFile)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.BaseResponseString_>('/api/file/test/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
