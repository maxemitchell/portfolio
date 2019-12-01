import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'
import Layout from '../components/layout'

const ArtboardTemplate = ({ data }) => {
    const artboard = data.contentfulArtboard

    return(
        <Layout>
          <div className="">
            <Helmet title={artboard.title} />
            <h1 className="">{artboard.title}</h1>
            <div className="">
              <Img
                className=""
                alt={artboard.title}
                fluid={artboard.artboard.fluid}
              />
            </div>
            <div className="">
              <p className="">
                {artboard.publishDate}
              </p>
              <div
                dangerouslySetInnerHTML={{
                  __html: artboard.description.childMarkdownRemark.html,
                }}
              />
            </div>
          </div>
        </Layout>
    )

}

export default ArtboardTemplate

export const query = graphql`
    query ArtboardBySlug($slug: String!) {
        site {
            siteMetadata {
                title
            }
        }
        contentfulArtboard(slug: { eq: $slug }) {
            title
            artboard {
                fluid(maxWidth: 1180, background: "rgb:000000") {
                  ...GatsbyContentfulFluid_tracedSVG
                }
            }
            description{
                childMarkdownRemark{
                    html
                }
            }
            artboardDate
        }
    }
`
