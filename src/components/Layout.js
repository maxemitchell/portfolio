import React from 'react'
import Navigation from './Navigation'
import Helmet from 'react-helmet'

const Layout = ({ children }) => {
  return (
    <div className="bg-themePurple text-themeOffWhite h-full min-h-screen antialiased">
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
      </Helmet>
      <Navigation />
      {children}
    </div>
  )
}

export default Layout
