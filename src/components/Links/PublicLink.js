import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthProvider from '../../providers/AuthProvider'

// const PublicLink = ({ to, children }) => {
//   const context = AuthProvider.contextType
//   return (
//     <context.Consumer>
//       {({ accessToken, loading }) => {
//         return !accessToken && !loading ? <Link to={to}>{children}</Link> : <></>
//       }}
//     </context.Consumer>
//   )
// }

const context = AuthProvider.contextType

class PublicLink extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <context.Consumer>
        {({ accessToken, loading }) => {
          return !accessToken && !loading ? <Link to={props.to}>{props.children}</Link> : <></>
        }}
      </context.Consumer>
    )
  }
}

export default PublicLink
