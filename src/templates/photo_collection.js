import React, { useState } from 'react'
import { graphql } from 'gatsby'
import SEO from '../components/SEO'
import { GatsbyImage } from 'gatsby-plugin-image'
import Layout from '../components/Layout'

const PhotoCollectionTemplate = ({ data }) => {
  const photoCollection = data.contentfulPhotoCollection
  const collectionTags =
    photoCollection.description.childMarkdownRemark.htmlAst.children
  const [showModal, setShowModal] = useState(false)
  const [currentImage, setCurrentImage] = useState()

  const handleClick = (e, photo) => {
    e.stopPropagation()
    setShowModal((showModal) => !showModal)
    setCurrentImage(photo)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <Layout>
      <SEO title={photoCollection.title} />
      <div
        className="flex flex-wrap w-full font-manrope text-themeOffWhite mx-auto justify-center xl:w-5/6"
        onClick={handleClose}
      >
        <div className="flex w-full justify-start ml-2 md:ml-4 items-baseline mt-1">
          <h1 className="text-3xl sm:text-4xl font-light textshadow-blue">
            {photoCollection.title}
          </h1>
          <p className="text-md sm:text-lg font-extralight textshadow-red">
            ~{photoCollection.collectionDate}
          </p>
        </div>

        <div className="w-full px-2 md:px-4 col-count-2 md:pt-1 md:col-count-3 xl:col-count-4 gap-x-md md:gap-x-lg">
          {photoCollection.photos.map((photo, key) => {
            if (key === Math.ceil(photoCollection.photos.length / 2)) {
              return (
                <div key={key}>
                  <div
                    onClick={(e) => handleClick(e, photo)}
                    className="mb-2 md:mb-4 inline-block w-full cursor-pointer border-themeOffWhite border-2 hover:border-themeRed duration-500"
                  >
                    <GatsbyImage
                      image={photo.gatsbyImageData}
                      alt={photoCollection.title}
                      key={photo.id}
                    />
                  </div>

                  <div className="inline-block w-full">
                    {collectionTags.map((item, key2) => {
                      if (item.type === 'element' && item.tagName === 'h1') {
                        return (
                          <h1
                            className="text-xl font-light text-center md:text-2xl xl:text-3xl"
                            key={key2 + key}
                          >
                            {item.children[0].value}
                          </h1>
                        )
                      } else if (
                        item.type === 'element' &&
                        item.tagName === 'p'
                      ) {
                        return (
                          <p
                            className="mt-3 text-sm font-extralight md:text-base md:mb-4 text-center"
                            key={key2 + key}
                          >
                            {item.children[0].value}
                          </p>
                        )
                      }
                    })}
                  </div>
                </div>
              )
            } else {
              return (
                <div
                  onClick={(e) => handleClick(e, photo)}
                  className="mb-2 md:mb-4 inline-block w-full cursor-pointer border-themeOffWhite border-2 hover:border-themeRed duration-500"
                  key={key}
                >
                  <GatsbyImage
                    image={photo.gatsbyImageData}
                    alt={photoCollection.title}
                    key={photo.id}
                  />
                </div>
              )
            }
          })}
        </div>

        {showModal && (
          <div className="fixed flex justify-center items-center h-screen w-full top-0 left-0 bg-blurred overflow-hidden">
            <GatsbyImage
              image={currentImage.gatsbyImageData}
              className="relative flex flex-1 max-w-screen-lg max-h-screen cursor-pointer p-16"
              alt={photoCollection.title}
              key={currentImage.id}
              objectFit="contain"
            />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default PhotoCollectionTemplate

export const query = graphql`
  query PhotoCollectiondBySlug($slug: String!) {
    contentfulPhotoCollection(slug: { eq: $slug }) {
      title
      photos {
        gatsbyImageData(layout: CONSTRAINED, width: 1200)
        id
      }
      description {
        childMarkdownRemark {
          htmlAst
        }
      }
      collectionDate
    }
  }
`
