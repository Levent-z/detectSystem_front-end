import request from '@/utils/request'

// upload
export const uploadService = (fileList, pageSize) => {
  let data = new FormData();
  for (let i = 0; i < fileList.length; i++) {
    console.log(fileList[i]);
    data.append(fileList[i].name, fileList[i].raw)
  }
  data.append("page_size", pageSize)
  return request.post('/app/upload/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000,
  })
}

export const getResultService = (page, pageSize) => {
  return request.get(`/app/getResult/?page=${page}&page_size=${pageSize}`)
}


// getData
export const getDataService = () => {
  return request.get('/app/getData/')
}

// getData
export const getRecordService = (page, pageSize) => {
  return request.get(`/app/getRecord/?page=${page}&page_size=${pageSize}`)
}

