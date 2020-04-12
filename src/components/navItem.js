import React from 'react'
import { Link } from 'gatsby'

const NavItem = (props) => {
  return(
    <Link
      to={props.to}
      className={`flex justify-center w-1/5 p-1 mr-5 sm:w-full sm:mb-4 md:w-1/12 md:mr-10 md:mb-0 hover:boxshadow-3d-collapse hover:text-themeBlue ${props.className} `}
    >
      <p>
        {props.children}
      </p>
    </Link>
  )
}

export default NavItem
