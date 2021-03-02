# rex-jwt-client

rex-jwt-client is the client side corresponding package for [rex-jwt-middleware](https://www.npmjs.com/package/rex-jwt-middleware).  Easily manage client side authentication on a react/express application.

# Contents

- [Installation](#installation)
- [Example](#example)
- [AuthProvider](#authprovider)
- [Routing Components](#routing)
  - [PrivateLink and PublicLink](#links)
  - [PrivateRoute and PublicRoute](#routes)
- [useProtectedFetch](#useProtectedFetch)
- [Description](#description)

# Installation <a name="installation"></a>
```
npm i rex-jwt-client
```  
or
```
yarn add rex-jwt-client
```

# Example <a name="example"></a>
First, let's take a look at a working example.  We'll break it down afterwards in the coming sections.
```javascript
import React from  'react'
import { BrowserRouter as Router, Switch, Route, Link } from  'react-router-dom'
import { 
  AuthProvider, 
  PrivateRoute, 
  PublicRoute,
  PublicLink,
  PrivateLink
} from  'rex-jwt-client'
import Home from  './pages/Home'
import Login from  './pages/Login'
import Register from  './pages/Register'
import SecretPage from  './pages/SecretPage'
import Loader from  './components/Loader'

const  App  = () => {
  return (
    <AuthProvider  refreshRoute='/api/refresh'  loader={Loader}>
      <Router>
        <nav>
          <Link  to='/'>Home</Link>
          <PrivateLink  to='/secret'>Secret</PrivateLink>
          <PublicLink  to='/login'>Log In</PublicLink>
          <PublicLink  to='/register'>Register</PublicLink>
        </nav>
        <Switch>
          <Route  
            exact
            path='/' 
            component={Home}
          />
          <PrivateRoute
            exact  
            path='/secret'  
            redirect='/'  
            component={SecretPage} 
          />
          <PublicRoute
            exact
            path='/login'
            redirect='/secret'
            component={Login}
          />
          <PublicRoute
            exact
            path='/register'
            redirect='/secret'
            component={Register}
          />
        </Switch>
      </Router>
    </AuthProvider>
  )
}
export  default App
```
Let's break it down piece by piece.
# AuthProvider <a name="authprovider"></a>
 
The AuthProvider is just a React context provider that holds all of the user's authentication details.
It takes a couple props:
| prop | description |
|--|--|
| refreshRoute | Requried parameter, which is a route that should match the route set up to refresh the accessToken in the back end. |
| loader | Optional parameter.  If you want one specific loading component to be accessible in every place where a request with **useProtectedFetch** is made, just add your component here.  |
---
To access the loader in other child components of the AuthProvider:
```javascript
import  { AuthProvider }  from  'rex-jwt-client'
const { loader } = useContext(AuthProvider.contextType)
```

# Routing Components <a name="routing"></a>
All Route and Link components are dependent on the package `react-router-dom` and must be used in a `BrowserRouter` component as shown above.  A CLI will be made in the future to more easily incorporate this option.  For now, `react-router-dom` can be installed by doing:
```
npm i react-router-dom
```
or
```
yarn add react-router-dom
```
### PrivateLink and PublicLink <a name="links"></a>
A PrivateLink is a link that only exists/gets shown when a user's access token is.  A PublicLink is a link that's only shown when a user is not logged in.
| prop | description |
|--|--|
| to | Path that the link links to. Same as an href in an anchor tag. |

### PrivateRoute and PublicRoute <a name="routes"></a>
A PrivateRoute is a route that's accessible only when a user is logged in.  A PublicRoute is a route that's accessible only shown when a user is not logged in.  Any of the same props that can be added to a Route component from react-router-dom can be added to these components with one addition.  The following are the main props:
| prop | description |
|--|--|
| component | Component to be shown when URL matches **path**. |
| path | URL that corresponds to **component**. |
| redirect | Redirect URL. If authenticated user tries accessing PublicRoute, they will be redirected to this URL. The same with an unauthenticated user trying to access a PrivateRoute. |
| exact | Makes sure that **component** is shown only if URL matches **path** exactly. |


# useProtectedFetch <a name="useProtectedFetch"></a>
This is a special hook that fetches and/or sends info along a protected route in the api.  If the access token has expired, but the refresh token hasn't expired, it will refresh the access token before accessing the protected route.

Let's take a look at the `SecretPage` component we imported in the example above:
```javascript
import React, { useContext } from  'react'
import { AuthProvider, useProtectedFetch } from  'rex-jwt-client'

const  SecretPage  = () => {
  const { loader: Loader } = useContext(AuthProvider.contextType)
  const { data, loading, error } = useProtectedFetch({
    route: '/api/secret',
    method: 'GET',
    responseType: 'text',
  })

  if (loading) return  <Loader  />

  if (error) return  <div>{error}</div>

  return  <div>Secret data: {data}</div>
}
export  default SecretPage
```
**useProtectedFetch** takes the following parameters: 
| parameter | description |  Is required  |
|--|--|--|
| route | Route that the request is being made to. | ✔ |
| method | Method being used for request. 'GET', 'POST', etc. | ✔ |
| headers | Additional parameters like `'Content-Type'`, same as headers that can be put in a regular fetch call. | ✖ |
| body | Body of request. | ✖ |
| responseType | Specify how the data will be parsed upon being received.  Currently, `"text"` and `"json"` are the only valid options. If no option is specified, json is used. | ✖ |
---
As shown above, this hook returns 3 things:
- **data** - Parsed data received from fetch request.
- **loading** - State that shows whether or not we're still waiting for data.
- **error** - Error message if fetch call went wrong.

# Description of the process: <a name="description"></a>

This package uses two JWT's to carry out authentication, an access token and a refresh token.  When a user logs into the site, they receive these two tokens.  The access token can be stored either in memory or localStorage, and the refresh token gets stored in an HTTP only cookie.  

The access token is what allows a user to access protected routes.  Once the access token expires, as long as the refresh token hasn't expired, the refresh route can be used to get a new access token before accessing a protected route.

I hope this package can help make react/express authentication easier, and if there's any improvements that can be made, I'm always open to looking at pull requests in the GitHub repo.

All the best. 👋