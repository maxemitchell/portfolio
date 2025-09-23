import React from 'react'
import { Link } from 'gatsby'
import CDNImage from './CDNImage'

const ArtboardPreview = ({ slug, title, image, artboardMetadata }) => {
  return (
    <Link
      className="flex w-full flex-col mx-4 mb-3 group sm:mx-auto"
      to={`/artboards/${slug}/`}
    >
      <h3 className="w-full text-lg sm:text-xl md:text-2xl mb-2 font-medium text-themeBlue group-hover:text-themeRed duration-500">
        {title}
      </h3>
      <CDNImage
        src={image}
        className="picture-border-sm-2 group-hover:picture-border-sm-1 duration-500"
        alt="Featured Image"
        loading="lazy"
        width={800}
        quality={80}
        layout="constrained"
        aspectRatio={artboardMetadata && artboardMetadata.aspectRatio}
        dominantColor={artboardMetadata && artboardMetadata.dominantColor}
      />
    </Link>
  )
}

export default ArtboardPreview
