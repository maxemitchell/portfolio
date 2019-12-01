import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout'

const Index = ({ data }) => {
    const siteTitle =  data.site.siteMetadata.title
    const artboards = data.allContentfulArtboard.edges

    return (
      <Layout>
        <div className="">
          <Helmet title={siteTitle} />
          <div className="">
            <h2 className="">Recent artboards</h2>
            <ul className="">
              {artboards.map(({ node: artboard }) => {
                return (
                  <li key={artboard.slug}>{artboard.title}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Layout>
    )
}

export default Index

export const query = graphql`
  query Index {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulArtboard(sort: { fields: [artboardDate], order: DESC }) {
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
  }
`
