import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import NavItem from './NavItem'

const Navigation = () => {
  const data = useStaticQuery(graphql`
    query {
      logoHoriz: file(relativePath: { eq: "logo_horiz_crop_transparent.png" }) {
        childImageSharp {
          fluid(
            traceSVG: { background: "#342e37", color: "#0bbcd6" }
          ) {
            ...GatsbyImageSharpFluid_tracedSVG
          }
        }
      }
    }
  `)

  return (
    <nav
      role="navigation"
      className="flex items-start flex-wrap justify-center w-full mb-3 pb-1 nav-border max-w-6xl mx-auto bg-themePurple"
    >
      <Link to="/" className="flex w-1/2 md:hidden mb-3 mt-1">
        <Img
          alt="Max Mitchell"
          fluid={data.logoHoriz.childImageSharp.fluid}
          className="w-full"
        />
      </Link>

      <div className="flex w-11/12 flex-no-wrap items-end justify-around mt-2">
        <NavItem to="/photos" className="first boxshadow-3d-left">
          photos
        </NavItem>
        <NavItem to="/videos" className="boxshadow-3d-left">
          videos
        </NavItem>

        <Link to="/" className="hidden md:flex md:w-4/12 md:mr-6">
          <Img
            alt="Max Mitchell"
            fluid={data.logoHoriz.childImageSharp.fluid}
            className="w-full"
          />
        </Link>

        <NavItem
          to="/code"
          className="first boxshadow-3d-left md:boxshadow-3d-right"
        >
          code
        </NavItem>
        <NavItem
          to="/about"
          className="last boxshadow-3d-left md:boxshadow-3d-right"
        >
          about
        </NavItem>
      </div>
    </nav>
  )
}

export default Navigation
