import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

const ArtboardPreview = ({ slug, title, image }) => {
  return (
    <Link className="mx-4 mb-3 group mx-auto" to={`/artboards/${slug}/`}>
      <h3 className="w-full text-lg sm:text-xl md:text-2xl mb-2 font-medium text-themeBlue group-hover:text-themeRed duration-500">
        {title}
      </h3>
      <GatsbyImage
        image={image}
        className="picture-border-sm-2 group-hover:picture-border-sm-1 duration-500"
        alt="Featured Image"
        loading="lazy"
      />
    </Link>
  )
}

export default ArtboardPreview
