import React from 'react'
import { Link } from 'gatsby'

const NavItem = props => {
  return (
    <Link
      to={props.to}
      className={`flex no-underline text-sm sm:text-base text-themeOffWhite font-manrope font-thin justify-center w-1/5 p-1 mr-5 md:mr-6 md:w-1/12 hover:boxshadow-3d-collapse hover:gradient ${props.className} `}
      activeClassName="gradient boxshadow-3d-collapse text-themePurple"
    >
      <p>{props.children}</p>
    </Link>
  )
}

export default NavItem
