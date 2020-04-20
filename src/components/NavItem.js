import React from 'react'
import { Link } from 'gatsby'

const NavItem = (props) => {
  return(
    <Link
      to={props.to}
      className={`flex no-underline text-md text-themeOffWhite font-manrope font-medium justify-center w-1/5 p-1 mr-5 sm:w-full sm:mb-4 md:w-1/12 md:mr-10 md:mb-0 hover:boxshadow-3d-collapse hover:text-themePurple hover:gradient ${props.className} `}
      activeClassName="gradient boxshadow-3d-collapse text-themePurple md:boxshadow-3d-collapse md:text-themePurple"
    >
      <p>
        {props.children}
      </p>
    </Link>
  )
}

export default NavItem
