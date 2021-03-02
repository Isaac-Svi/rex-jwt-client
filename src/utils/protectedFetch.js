import isExp from './isExp'
import parseToType from './parseToType'

const protectedFetch = async ({
  accessToken: token,
  body = {},
  headers = {},
  method,
  refreshMethod,
  route,
  refreshRoute,
  responseType = 'json',
}) => {
  try {
    let res, data

    if (isExp(token)) {
      res = await fetch(refreshRoute, {
        method: refreshMethod,
        headers: {
          credentials: 'include',
        },
      })
      const { accessToken, error } = await res.json()

      if (error) throw new Error(error)

      token = accessToken
    }

    const params = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    }
    if (method.toLowerCase() !== 'get') {
      params['body'] = body
    }

    res = await fetch(route, params)
    data = await parseToType(res, responseType)

    return { data, error: '' }
  } catch (err) {
    console.log(err.message)
    return { data: '', error: err.message }
  }
}

export default protectedFetch
