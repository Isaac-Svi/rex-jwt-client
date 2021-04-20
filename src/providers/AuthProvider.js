import React, { Component, createContext } from 'react'

const AuthContext = createContext(null)

export default class AuthProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userInfo: {},
      accessToken: '',
      loading: true,
      refresh: true,
      setAccessToken: (accessToken) => this.setState({ accessToken }),
      setRefresh: (refresh) => this.setState({ refresh }),
      setUserInfo: (userInfo) => this.setState({ userInfo }),
      loader: this.props.loader,
      refreshRoute: this.props.refreshRoute,
      loginEmailAndPassword: this.loginEmailAndPassword.bind(this),
      logoutEmailAndPassword: this.logoutEmailAndPassword.bind(this),
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

  async loginEmailAndPassword(loginRoute, email, password) {
    try {
      const res = await fetch(loginRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      const { accessToken, userInfo } = data

      this.setState({ accessToken, userInfo })
    } catch (err) {
      console.log(err.message)
      this.setState({ accessToken: '', userInfo: {} })
    }
  }

  async logoutEmailAndPassword(logoutRoute) {
    try {
      await fetch(logoutRoute, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.state.accessToken}`,
        },
      })
      this.refreshToken()
    } catch (err) {
      console.log(err.message)
    }
  }

  componentDidMount() {
    if (this.state.refresh) this.refreshToken()
  }

  componentDidUpdate() {
    if (this.state.refresh) this.refreshToken()
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>
    )
  }
}

AuthProvider.contextType = AuthContext
