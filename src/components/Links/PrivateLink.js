import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthProvider from '../../providers/AuthProvider'

const context = AuthProvider.contextType

class PrivateLink extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <context.Consumer>
        {({ accessToken, loading }) => {
          return accessToken && !loading ? (
            <Link to={this.props.to} {...this.props}>
              {this.props.children}
            </Link>
          ) : (
            <></>
          )
        }}
      </context.Consumer>
    )
  }
}

export default PrivateLink
