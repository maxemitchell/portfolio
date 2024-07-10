import React from 'react'
import { Link } from 'gatsby'

const NavItem = (props) => {
  return (
    <Link
      to={props.to}
      className={`flex no-underline text-sm md:text-lg text-themeOffWhite font-manrope font-light justify-center w-1/4 p-1 mr-5 md:mr-6 md:w-2/12 duration-700 hover:boxshadow-3d-collapse hover:gradient ${props.className} `}
      activeClassName="gradient boxshadow-3d-collapse"
    >
      <p>{props.children}</p>
    </Link>
  )
}

export default NavItem
