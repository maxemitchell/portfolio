import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'
import Layout from '../components/layout'

const PhotoCollectionTemplate = ({ data }) => {
  const photoCollection = data.contentfulPhotoCollection

  return (
    <Layout>
      <Helmet title={photoCollection.title} />
      <h1 className="">{photoCollection.title}</h1>
      <div className="p-1 md:p-2 lg:p-4 col-count-1 md:col-count-2 lg:col-count-3 xl:col-count-4 col-gap-sm md:col-gap-md lg:col-gap-lg">
        {photoCollection.photos.map(({ fluid: photo, id: id }) => {
          return (
            <Img
              className="mb-1 inline-block w-full"
              alt={photoCollection.title}
              fluid={photo}
              key={id}
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
        fluid(maxHeight: 1080, background: "rgb:000000") {
          ...GatsbyContentfulFluid_tracedSVG
        }
        id
      }
      description {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
