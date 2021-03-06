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

      // TODO: mention how these setState functions are different than regular React setState functions
      setAccessToken: (accessToken) => this.setState({ accessToken }),
      setRefresh: (refresh) => this.setState({ refresh }),
      setUserInfo: (newUserInfo) =>
        this.setState({ userInfo: { ...this.state.userInfo, ...newUserInfo } }),

      loader: this.props.loader,
      refreshRoute: this.props.refreshRoute,
      loginEmailAndPassword: this.loginEmailAndPassword.bind(this),
      logoutEmailAndPassword: this.logoutEmailAndPassword.bind(this),
      register: this.register.bind(this),
      registerAndLogin: this.registerAndLogin.bind(this),
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

  async register(registerRoute, newUserObject) {
    const res = await fetch(registerRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUserObject),
    })
    const data = await res.json()

    if (data.error) throw new Error(data.error)

    return data.msg
  }

  async registerAndLogin(route, newUserObject) {
    const res = await fetch(route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUserObject),
    })
    const data = await res.json()

    if (data.error) throw new Error(data.error)

    const { accessToken, userInfo } = data

    this.setState({ accessToken, userInfo })
  }

  async loginEmailAndPassword(loginRoute, email, password) {
    const res = await fetch(loginRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (data.error) {
      this.setState({ accessToken: '', userInfo: {} })
      throw new Error(data.error)
    }

    const { accessToken, userInfo } = data

    this.setState({ accessToken, userInfo })
  }

  async logoutEmailAndPassword(logoutRoute) {
    await fetch(logoutRoute, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.state.accessToken}` },
    })
    this.refreshToken()
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
