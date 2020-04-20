import React from 'react'
import Navigation from './Navigation'
import Helmet from 'react-helmet'

const Layout = ({ children }) => {
  return (
    <div className="bg-themePurple text-themeOffWhite h-full min-h-screen antialiased">
      <Navigation />
      {children}
    </div>
  )
}

export default Layout
