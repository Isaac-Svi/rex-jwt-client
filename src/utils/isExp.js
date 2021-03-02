import jwtDecode from 'jwt-decode'

const isExp = (token) => {
  return jwtDecode(token).exp * 1000 < Date.now() ? true : false
}

export default isExp
