import React from 'react'
import Navigation from './Navigation'

const Layout = ({ children }) => {
  return (
    <div className="text-themeOffWhite font-manrope h-full min-h-screen antialiased">
      <Navigation />
      {children}
    </div>
  )
}

export default Layout
