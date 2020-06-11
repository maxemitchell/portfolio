import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

const ArtboardPreview = ({ slug, title, fluid }) => {
  return (
    <Link
      className="w-full mx-4 mb-3 group"
      to={`/artboards/${slug}/`}
    >
      <h3 className="w-full text-lg sm:text-xl md:text-2xl mb-2 font-medium text-themeBlue group-hover:text-themeRed duration-500">
        {title}
      </h3>
      <Img
        className="picture-border-sm-2 w-full group-hover:picture-border-sm-1 duration-500"
        alt="Featured Image"
        fluid={fluid}
        loading="lazy"
      />
    </Link>
  )
}

export default ArtboardPreview
