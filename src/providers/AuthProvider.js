import React, { Component, createContext } from 'react'

const AuthContext = createContext(null)

export default class AuthProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loader: this.props.loader,
      refreshRoute: this.props.refreshRoute,
      userInfo: {},
      accessToken: '',
      loading: true,
      refresh: true,
      setAccessToken: (accessToken) => this.setState({ accessToken }),
      setRefresh: (refresh) => this.setState({ refresh }),
      setUserInfo: (userInfo) => this.setState({ userInfo }),
    }
  }

  refreshToken() {
    this.setState({ refresh: false })

    fetch(this.state.refreshRoute, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        this.setState({
          userInfo: data.userInfo,
          accessToken: data.accessToken,
          loading: false,
        })
      })
      .catch((err) => {
        console.log(err.message)
        this.setState({
          userInfo: {},
          accessToken: '',
          loading: false,
        })
      })
  }

  componentDidMount() {
    if (this.state.refresh) this.refreshToken()
  }

  componentDidUpdate() {
    if (this.state.refresh) this.refreshToken()
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

AuthProvider.contextType = AuthContext
