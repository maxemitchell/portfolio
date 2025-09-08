import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import SEO from '../components/SEO'
import Layout from '../components/Layout'

const PhotoCollectionTemplate = ({ data }) => {
  const collection = data.photoCollection

  return (
    <Layout>
      <SEO title={collection.title} />
      <div className="flex flex-wrap w-full font-manrope text-themeOffWhite mx-auto justify-center xl:w-5/6">
        <div className="flex w-full justify-start ml-4 items-baseline mt-1">
          <h1 className="text-3xl sm:text-4xl font-light textshadow-blue">
            {collection.title}
          </h1>
          <p className="text-md sm:text-lg mt-12 font-extralight textshadow-red">
            ~{collection.date}
          </p>
        </div>
        
        <div className="w-11/12 mt-6 mb-12">
          {collection.description && (
            <div className="mb-8 text-center">
              <p className="text-lg leading-relaxed text-gray-300 max-w-2xl mx-auto">
                {collection.description}
              </p>
            </div>
          )}
          
          {collection.metadata && (collection.metadata.location || collection.metadata.equipment) && (
            <div className="mb-8 text-center text-sm text-gray-400">
              {collection.metadata.location && (
                <span>📍 {collection.metadata.location}</span>
              )}
              {collection.metadata.location && collection.metadata.equipment && (
                <span className="mx-2">•</span>
              )}
              {collection.metadata.equipment && (
                <span>📷 {collection.metadata.equipment}</span>
              )}
            </div>
          )}
          
          {collection.images && collection.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.images.map((image, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    {image.imageFile ? (
                      <GatsbyImage
                        image={getImage(image.imageFile)}
                        alt={image.alt || `Image ${index + 1} from ${collection.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <img
                        src={image.url}
                        alt={image.alt || `Image ${index + 1} from ${collection.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                  </div>
                  {image.caption && (
                    <p className="mt-2 text-sm text-gray-400 text-center">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default PhotoCollectionTemplate

export const query = graphql`
  query PhotoCollectionBySlug($slug: String!) {
    photoCollection(slug: { eq: $slug }) {
      id
      title
      description
      date(formatString: "MMMM DD, YYYY")
      slug
      coverImage
      coverImageFile {
        childImageSharp {
          gatsbyImageData(width: 1200, quality: 90)
        }
      }
      images {
        url
        imageFile {
          childImageSharp {
            gatsbyImageData(width: 600, quality: 85)
          }
        }
        alt
        caption
      }
      metadata {
        location
        equipment
      }
    }
  }
`
