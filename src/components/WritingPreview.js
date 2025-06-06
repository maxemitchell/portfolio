import React from 'react'
import { Link } from 'gatsby'
import Header from './Header'

const WritingPreview = ({ slug, title, preview, writingDate }) => {
  return (
    <Link
      className="flex mx-auto mb-6 w-5/6 lg:w-5/12 px-4 items-start justify-start flex-wrap place-content-between boxshadow-3d-left"
      to={`/writings/${slug}/`}
    >
      <div>
        <div className="flex w-full ml-1 items-start">
          <Header variant="clean-multiline">{title}</Header>
        </div>

        <p className="flex w-5/6 ml-4 text-base lg:text-lg font-extralight">
          {preview}.........
        </p>
      </div>

      <p className="flex w-full mr-3 mt-3 mb-3 text-sm lg:text-base font-extrabold textshadow-red justify-end">
        ~{writingDate}
      </p>
    </Link>
  )
}

export default WritingPreview
