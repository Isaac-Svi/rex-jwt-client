import React from 'react'
import { Link } from 'react-router-dom'
import AuthProvider from '../../providers/AuthProvider'

const PrivateLink = ({ to, children }) => {
  const context = AuthProvider.contextType
  return (
    <context.Consumer>
      {({ accessToken, loading }) => {
        return accessToken && !loading ? <Link to={to}>{children}</Link> : <></>
      }}
    </context.Consumer>
  )
}

export default PrivateLink
