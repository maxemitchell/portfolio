import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

const PhotoCollectionPreview = ({ slug, title, fluid }) => {
  return (
    <Link
      className="w-1/2 sm:w-5/12 md:w-5/12 lg:w-1/3 px-4 mb-3 group"
      to={`/photo_collections/${slug}/`}
    >
      <h3 className="w-full text-lg sm:text-xl md:text-2xl mb-1 font-medium text-themeBlue group-hover:text-themeRed duration-500">
        {title}
      </h3>
      <Img
        className="picture-border-sm-2 w-full max-w-xl group-hover:picture-border-sm-1 duration-500"
        alt="Featured Image"
        fluid={fluid}
        loading="lazy"
      />
    </Link>
  )
}

export default PhotoCollectionPreview
