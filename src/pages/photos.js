import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'

const Index = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const artboards = data.allContentfulArtboard.edges
  const photoCollections = data.allContentfulPhotoCollection.edges

  return (
    <Layout>
      <div className="">
        <Helmet title={siteTitle} />
        <div className="">
          <h2 className="">Recent artboards</h2>
          {artboards.map(({ node: artboard }) => {
            return (
              <Link to={`/artboards/${artboard.slug}/`}>
                <h3>{artboard.title}</h3>
              </Link>
            )
          })}
        </div>
        <div className="">
          <h2 className="">Recent photo_collections</h2>
          {photoCollections.map(({ node: photoCollection }) => {
            return (
              <Link to={`/photo_collections/${photoCollection.slug}/`}>
                <h3>{photoCollection.title}</h3>
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
        sort: { fields: [artboardDate], order: DESC },
        limit: 5
    ){
      edges {
        node {
          title
          slug
          artboardDate(formatString: "MMMM Do, YYYY")
          artboard {
            fluid(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
          description {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
    allContentfulPhotoCollection(limit: 5) {
      edges {
        node {
          title
          slug
          description {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
  }
`
