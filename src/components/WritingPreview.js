import React from 'react'
import { Link } from 'gatsby'
import Header from './Header'

const WritingPreview = ({ slug, title }) => {
  return (
    <Link
      className="w-1/2 sm:w-5/12 md:w-5/12 lg:w-1/3 px-4 mb-3 group"
      to={`/writings/${slug}/`}
    >
      <Header variant="2">{title}</Header>
      {/* <h3 className="w-full text-lg sm:text-xl md:text-2xl mb-1 font-medium text-themeBlue group-hover:text-themeRed duration-500">
        {title}
      </h3> */}
    </Link>
  );
}

export default WritingPreview
