import request from '@/utils/request'

// login
export const loginService = (username, password) => {
  return request.post('/app/logIn/', {
    username,
    password
  },{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
}

// getCode
export const getCodeService = (email, type) => {
  return request.post('/app/getCode/', {
    email,
    type
  },{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
}

// register app/signIn/
export const signInService = (username, password, email, code) => {
  return request.post('/app/signIn/', {
    username,
    password,
    email,
    code
  },{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
}

// register app/forgetPwd/
export const forgetPwdService = (username, password, email, code) => {
  return request.post('/app/forgetPwd/', {
    username,
    password,
    email,
    code
  },{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
}

//
export const resetPwdService = (new_password) => {
  return request.post('/app/changePwd/', {
    new_password
  },{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
}

