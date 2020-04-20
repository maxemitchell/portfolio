import React from 'react'
import Navigation from './navigation'

const Layout = ({ children }) => {
  return (
    <div className="bg-themePurple text-themeOffWhite h-full min-h-screen antialiased">
      <Navigation />
      {children}
    </div>
  )
}

export default Layout
