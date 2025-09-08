import React from 'react'
import { graphql, Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import SEO from '../components/SEO'
import Layout from '../components/Layout'

const ArtboardTemplate = ({ data }) => {
  const artboard = data.artboard

  return (
    <Layout>
      <SEO title={artboard.title} />
      <div className="flex flex-wrap w-full font-manrope text-themeOffWhite mx-auto justify-center xl:w-5/6">
        <div className="flex w-full justify-start ml-4 items-baseline mt-1">
          <h1 className="text-3xl sm:text-4xl font-light textshadow-blue">
            {artboard.title}
          </h1>
          <p className="text-md sm:text-lg mt-12 font-extralight textshadow-red">
            ~{artboard.date}
          </p>
        </div>
        
        <div className="w-11/12 mt-6 mb-12 flex flex-col items-center">
          {artboard.images && artboard.images.mainImage && (
            <div className="w-full max-w-4xl mb-6">
              <GatsbyImage
                image={getImage(artboard.images.mainImage)}
                alt={artboard.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
          
          {artboard.description && (
            <div className="w-full max-w-2xl text-center">
              <p className="text-lg leading-relaxed text-gray-300">
                {artboard.description}
              </p>
            </div>
          )}
          
          {artboard.metadata && artboard.metadata.tools && (
            <div className="mt-6 flex flex-wrap gap-2">
              {artboard.metadata.tools.map((tool, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-themeBlue text-white rounded-full text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ArtboardTemplate

export const query = graphql`
  query ArtboardBySlug($slug: String!) {
    artboard(slug: { eq: $slug }) {
      id
      title
      description
      date(formatString: "MMMM DD, YYYY")
      slug
      images {
        main
        mainImage {
          childImageSharp {
            gatsbyImageData(width: 1200, quality: 90)
          }
        }
        thumbnail
        thumbnailImage {
          childImageSharp {
            gatsbyImageData(width: 400, quality: 80)
          }
        }
      }
      metadata {
        dimensions
        tools
      }
    }
  }
`
