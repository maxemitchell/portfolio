import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Img from 'gatsby-image'

const Index = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const artboards = data.allContentfulArtboard.edges
  const photoCollections = data.allContentfulPhotoCollection.edges

  return (
    <Layout>
      <Helmet title={siteTitle} />
      <div className="w-full max-w-6xl mx-auto">

        <div className="flex w-full flex-wrap justify-center">

          <h2 className="w-full text-center mt-1 text-4xl lg:text-5xl font-light">
            recent photo_collections
          </h2>

          {photoCollections.map(({ node: photoCollection }) => {
            return (
              <Link
                className="w-5/12 md:w-2/5 mx-4 mb-3"
                to={`/photo_collections/${photoCollection.slug}/`}
              >
                <h3 className="w-full text-xl mb-1 font-medium text-themeBlue">
                  {photoCollection.title}
                </h3>
                <Img
                  className="picture-border-sm-2 w-full picture-border-1 max-w-xl"
                  alt="Featured Image"
                  fluid={photoCollection.featuredImage.fluid}
                />
              </Link>
            )
          })}
        </div>

        <div className="flex w-full flex-wrap justify-center">

          <h2 className="w-full text-center mt-2 text-4xl lg:text-5xl font-light">
            recent artboards
          </h2>

          {artboards.map(({ node: artboard }) => {
            return (
              <Link
                className="w-full mx-4 mb-3"
                to={`/artboards/${artboard.slug}/`}
              >
                <h3 className="w-full text-xl mb-1 font-medium text-themeBlue">
                  {artboard.title}
                </h3>
                <Img
                  className="picture-border-sm-2 w-full picture-border-1"
                  alt="Featured Image"
                  fluid={artboard.artboard.fluid}
                />
              </Link>
            )
          })}
        </div>

      </div>
    </Layout>
  )
}

export default Index

export const query = graphql`
  query Photos {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulArtboard(
      sort: { fields: [artboardDate], order: DESC }
    ) {
      edges {
        node {
          title
          slug
          artboard {
            fluid(maxWidth: 1200, resizingBehavior: SCALE) {
              ...GatsbyContentfulFluid_withWebp
            }
          }

        }
      }
    }
    allContentfulPhotoCollection(
      sort: { fields: collectionDate, order: DESC }
    ) {
      edges {
        node {
          title
          slug
          featuredImage {
            fluid(maxHeight: 720) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
        }
      }
    }
  }
`
