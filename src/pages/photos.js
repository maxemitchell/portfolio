import React from 'react'
import { graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../components/Layout'
import Header from '../components/Header'
import ArtboardPreview from '../components/ArtboardPreview'
import PhotoCollectionPreview from '../components/PhotoCollectionPreview'

const Index = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const artboards = data.allContentfulArtboard.edges
  const photoCollections = data.allContentfulPhotoCollection.edges

  return (
    <Layout>
      <Helmet title={siteTitle} />
      <div className="w-full max-w-6xl mx-auto">

        <div className="flex w-full flex-wrap justify-around items-end mt-6">

          <Header variant="3">
            photo collections
          </Header>

          {photoCollections.map(({ node: photoCollection }) => {
            return (
              <PhotoCollectionPreview
                slug={photoCollection.slug}
                title={photoCollection.title}
                fluid={photoCollection.featuredImage.fluid}
              />
            )
          })}
        </div>

        <div className="flex w-full flex-wrap justify-center">

          <Header variant="3">
            artboards
          </Header>

          {artboards.map(({ node: artboard }) => {
            return (
              <ArtboardPreview
                slug={artboard.slug}
                title={artboard.title}
                fluid={artboard.artboard.fluid}
              />
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
