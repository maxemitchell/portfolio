import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'
import Layout from '../components/Layout'

const PhotoCollectionTemplate = ({ data }) => {
  const photoCollection = data.contentfulPhotoCollection
  const collectionTags = photoCollection.description.childMarkdownRemark.htmlAst.children
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState();

  const handleClick = (e, photo) => {
    e.stopPropagation()
    setShowModal(showModal => !showModal)
    setCurrentImage(photo);
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <Layout>
      <Helmet
        title={photoCollection.title}
      />
      <div
        className="flex flex-wrap w-full font-manrope text-themeOffWhite mx-auto justify-center xl:w-5/6"
        onClick={handleClose}
      >

        <div className="flex w-full justify-start ml-2 md:ml-4 items-baseline mt-1">
          <h1 className="text-3xl sm:text-4xl font-light textshadow-blue">{photoCollection.title}</h1>
          <p className="text-md sm:text-lg font-thin textshadow-red">~{photoCollection.collectionDate}</p>
        </div>

        <div className="w-full px-2 md:px-4 col-count-2 md:pt-1 md:col-count-3 xl:col-count-4 col-gap-md md:col-gap-lg">

          {photoCollection.photos.map((photo, key) => {
            if(key === (Math.ceil(photoCollection.photos.length/2))){
              return(
                <>
                  <div
                    onClick={e => handleClick(e, photo)}
                    className="mb-2 md:mb-4 inline-block w-full cursor-pointer border-themeOffWhite border-2 "
                  >
                    <Img
                      alt={photoCollection.title}
                      fluid={photo.fluid}
                      key={photo.id}
                    />
                  </div>

                  <div className="inline-block w-full">
                    {collectionTags.map((item, key) => {
                      if(item.type === "element" && item.tagName === "h1"){
                        return(
                          <h1 className="text-xl font-light text-center md:text-2xl xl:text-3xl" key={key}>
                            {item.children[0].value}
                          </h1>
                        )
                      }else if(item.type === "element" && item.tagName === "p"){
                        return(
                          <p className="mt-3 text-sm font-thin md:text-base md:mb-4 text-center" key={key}>
                            {item.children[0].value}
                          </p>
                        )
                      }
                    })}
                  </div>
                </>
              )
            }else {
              return (
                <div
                  onClick={e => handleClick(e, photo)}
                  className="mb-2 md:mb-4 inline-block w-full cursor-pointer border-themeOffWhite border-2"
                >
                  <Img
                    alt={photoCollection.title}
                    fluid={photo.fluid}
                    key={photo.id}
                  />
                </div>
              )
            }
          })}

        </div>

        {showModal &&
          <div
            className="fixed flex justify-center items-center h-screen w-full top-0 left-0 bg-blurred"
          >
            <Img
              className="relative flex flex-1 max-w-screen-lg cursor-pointer border-themeOffWhite border-4 p-16"
              alt={photoCollection.title}
              fluid={currentImage.fluid}
              key={currentImage.id}
            />
          </div>
        }

      </div>
    </Layout>
  )
}

export default PhotoCollectionTemplate

export const query = graphql`
  query PhotoCollectiondBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulPhotoCollection(slug: { eq: $slug }) {
      title
      photos {
        fluid(maxWidth: 1080) {
          ...GatsbyContentfulFluid
        }
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
