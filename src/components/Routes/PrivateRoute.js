import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import AuthProvider from '../../providers/AuthProvider'

const PrivateRoute = (props) => {
  const { redirect, component: Component, ...rest } = props
  const context = AuthProvider.contextType
  return (
    <context.Consumer>
      {({ accessToken, loading, loader: Loader }) => {
        if (!accessToken && loading)
          return Loader ? <Loader /> : <div>loading...</div>

        return accessToken ? (
          <Route {...rest} component={Component} />
        ) : (
          <Redirect to={redirect} />
        )
      }}
    </context.Consumer>
  )
}

export default PrivateRoute
