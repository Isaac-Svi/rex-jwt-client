import { useState, useEffect, useContext } from 'react'
import AuthProvider from '../providers/AuthProvider'
import isExp from '../utils/isExp'
import parseToType from '../utils/parseToType'

const useProtectedFetch = ({
  route,
  method,
  headers = {},
  body = {},
  responseType = 'json',
  watch = null, // state to watch, so that hook is rerun.
}) => {
  const { accessToken, setRefresh } = useContext(AuthProvider.contextType)

  const [data, setData] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const watchedStates = [accessToken]
  if (watch === null || watch === undefined) watchedStates.push(watch)

  useEffect(() => {
    console.log('called')
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

      fetch(route, params)
        .then((res) => parseToType(res, responseType))
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
  }, watchedStates)

  return { data, loading, error }
}

export default useProtectedFetch
