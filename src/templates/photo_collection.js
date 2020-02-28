import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'
import Layout from '../components/layout'

const PhotoCollectionTemplate = ({ data }) => {
    const photoCollection = data.contentfulPhotoCollection

    return(
        <Layout>
          <div className="">
            <Helmet title={photoCollection.title} />
            <h1 className="">{photoCollection.title}</h1>
            <div className="">
              {photoCollection.photos.map(({fluid: photo}) => {
                  return(
                      <Img
                      className=""
                      alt={photoCollection.title}
                      fluid={photo}
                      />
                  )
              })}
            </div>
            <div className="">
              <div
                dangerouslySetInnerHTML={{
                  __html: photoCollection.description.childMarkdownRemark.html,
                }}
              />
            </div>
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
                fluid(maxWidth: 400, background: "rgb:000000") {
                  ...GatsbyContentfulFluid_tracedSVG
                }
            }
            description{
                childMarkdownRemark{
                    html
                }
            }
        }
    }
`
