import React from 'react'
import { Link } from 'gatsby'
import { StaticImage } from "gatsby-plugin-image";
import NavItem from './NavItem'

const Navigation = () => {
  return (
    <nav
      role="navigation"
      className="flex items-start flex-wrap justify-center w-full mb-6 pb-1 nav-border max-w-6xl mx-auto bg-black"
    >
      <Link to="/" className="flex w-1/2 md:hidden mb-3 mt-1">
        <StaticImage 
          src="../images/logo_horiz_crop_transparent.png"
          alt="Max Mitchell"
          className="w-full"
          layout="constrained"
          placeholder="tracedSVG"
          tracedSVGOptions={{background: "#000000", color: "#0bbcd6"}}
        />
      </Link>

      <div className="flex w-11/12 flex-nowrap items-end justify-around mt-2">
        <Link to="/" className="hidden first md:flex md:w-4/12 md:mr-6">
          <StaticImage 
            src="../images/logo_horiz_crop_transparent.png"
            alt="Max Mitchell"
            className="w-full"
            layout="constrained"
            placeholder="tracedSVG"
            tracedSVGOptions={{background: "#000000", color: "#0bbcd6"}}
          />
        </Link>
        <NavItem to="/photos/" className="boxshadow-3d-right">
          photos
        </NavItem>
        <NavItem to="/videos/" className="boxshadow-3d-right">
          videos
        </NavItem>

        <NavItem
          to="/code_art/"
          className="boxshadow-3d-center md:boxshadow-3d-right"
        >
          code_art
        </NavItem>

        <NavItem
          to="/writings/"
          className="boxshadow-3d-left md:boxshadow-3d-right"
        >
          writings
        </NavItem>

        <NavItem
          to="/about/"
          className="last boxshadow-3d-left md:boxshadow-3d-right"
        >
          about
        </NavItem>
      </div>
    </nav>
  );
}

export default Navigation
