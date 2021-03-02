import { useState, useEffect, useContext } from 'react'
import jwtDecode from 'jwt-decode'
import AuthProvider from '../providers/AuthProvider'

const isExp = (token) => {
  return jwtDecode(token).exp * 1000 < Date.now() ? true : false
}

const convert = (res, type) => {
  switch (type.toLowerCase()) {
    case 'text':
      return res.text()
    case 'json':
      return res.json()
    default:
      throw new Error('Invalid responseType')
  }
}

const useProtectedFetch = ({
  method,
  headers = {},
  body = {},
  responseType = 'json',
}) => {
  const { accessToken, setRefresh, refreshRoute } = useContext(
    AuthProvider.contextType
  )

  const [data, setData] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isExp(accessToken)) {
      setRefresh(true)
    } else {
      const params = {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...headers,
        },
      }
      if (method.toLowerCase() !== 'get') {
        params['body'] = body
      }

      fetch(refreshRoute, params)
        .then((res) => convert(res, responseType))
        .then((x) => {
          if (x.error) throw new Error(x.error)
          setData(x)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err.message)
          setError(err.message)
          setLoading(false)
        })
    }
  }, [accessToken])

  return { data, loading, error }
}

export default useProtectedFetch
