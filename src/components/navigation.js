import React from 'react'
import { useStaticQuery, graphql } from "gatsby"
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import NavItem from './navItem';

const Navigation = () => {
  const data = useStaticQuery(graphql`
    query {
      logoHoriz: file(relativePath: { eq: "logo_horiz_crop.png" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <nav
      role="navigation"
      className="flex items-start flex-wrap justify-center sm:justify-between w-full pt-2 bg-themePurple mb-4 pb-1 nav-border max-w-4xl mx-auto"
    >
      <Link
        to="/"
        className="mb-1 flex w-4/5 sm:ml-2 sm:mb-0 md:hidden"
      >
        <Img
          alt="Max Mitchell"
          fluid={data.logoHoriz.childImageSharp.fluid}
          className="w-full"
        />
      </Link>

      <div className="flex w-5/6 flex-no-wrap items-end justify-center sm:w-24 mt-3 sm:flex-wrap md:flex-no-wrap md:w-full md:items-end md:mt-0">
        <NavItem to="/photos" className="first boxshadow-3d-left">photos</NavItem>
        <NavItem to="/videos" className="boxshadow-3d-left">videos</NavItem>

        <Link
          to="/"
          className="hidden md:flex md:w-1/3 md:max-w-lg md:mr-8"
        >
          <Img
            alt="Max Mitchell"
            fluid={data.logoHoriz.childImageSharp.fluid}
            className="w-full"
          />
        </Link>

        <NavItem to="/code" className="first boxshadow-3d-left md:boxshadow-3d-right">code</NavItem>
        <NavItem to="/about" className="last boxshadow-3d-left md:boxshadow-3d-right sm:bottom sm:mr-5 md:last">about</NavItem>
      </div>
    </nav>
  )
}

export default Navigation
