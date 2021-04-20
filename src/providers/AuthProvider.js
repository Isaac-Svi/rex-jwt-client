import React, { Component, createContext } from 'react'

const AuthContext = createContext(null)

// TODO: Make login function and logout function

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
    }

    this.value = {
      ...this.state,
      loader: this.props.loader,
      refreshRoute: this.props.refreshRoute,
      loginEmailAndPassword: this.loginEmailAndPassword,
      logoutEmailAndPassword: this.logoutEmailAndPassword,
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
    this.setState({ loading: true })
    try {
      const res = await fetch(loginRoute, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      const { accessToken, userInfo } = data

      this.setState({ accessToken, userInfo, loading: false })
    } catch (err) {
      console.log(err.message)
      this.setState({ accessToken: '', userInfo: {}, loading: false })
    }
  }

  async logoutEmailAndPassword(logoutRoute) {
    this.setState({ loading: true })
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
      <AuthContext.Provider value={this.value}>{this.props.children}</AuthContext.Provider>
    )
  }
}

AuthProvider.contextType = AuthContext
