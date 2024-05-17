import request from '@/utils/request'
export default class {
  login(username: string, password: string) {
    return request({
      url: '/aio/api/passport/login',
      method: 'post',
      data: {
        username,
        passwd: password
      }
    })
  }
  register(username: string, passwd: string, confirmPasswd: string) {
    return request({
      url: '/aio/api/passport/registry',
      method: 'post',
      data: {
        username,
        passwd,
        confirmPasswd
      }
    })
  }
  logout() {
    return request(
      {
        url: '/aio/api/passport/logout',
        method: 'get'
      },
      true
    )
  }
  getUserInfo() {
    return request({
      url: '/aio/api/user/info',
      method: 'get'
    })
  }
}
