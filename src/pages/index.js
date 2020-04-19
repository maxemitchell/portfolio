import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import Video from '../components/video'
// import Img from 'gatsby-image'

const Index = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  // const featuredImage = data.contentfulSiteData.featuredImage
  // const secondaryImage = data.contentfulSiteData.secondaryImage
  const artboards = data.allContentfulArtboard.edges
  const photoCollections = data.allContentfulPhotoCollection.edges
  const youtubeVideos = data.allYoutubeVideo.edges

  return (
    <Layout>
      <Helmet title={siteTitle} />
      <div className="w-full bg-themePurple max-w-6xl mx-auto">

        {/* <div className="mt-8 ml-8 flex flex-wrap">

          <div className="w-full flex flex-no-wrap justify-around">
            <Img
              className="w-3/5 mt-2 picture-border-1 md:w-4/5"
              alt="Featured Image"
              fluid={featuredImage.fluid}
            />

            <div className="w-2/5 text-center">
              - photography
              - video
            </div>
          </div>

          <div className="w-full flex flex-no-wrap justify-end">
            <Img
              className="w-1/2 mt-8 picture-border-2 md:ml-8 md:w-1/3"
              alt="Secondary Image"
              fluid={secondaryImage.fluid}
            />
          </div>

        </div> */}

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
        <div className="w-full">
          <h2 className="">Recent videos:</h2>
          {youtubeVideos.map(({ node: youtubeVideo }) => {
            return (
              <div>
                <p>{youtubeVideo.title}</p>
                <Video
                  videoSrcURL={
                    'https://www.youtube.com/embed/' + youtubeVideo.videoId
                  }
                  videoTitle={youtubeVideo.title}
                />
                <p>{youtubeVideo.description}</p>
              </div>
            )
          })}
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
    # contentfulSiteData {
    #   featuredImage {
    #     fluid(maxHeight: 1500, background: "rgb:342e37") {
    #       ...GatsbyContentfulFluid_tracedSVG
    #     }
    #   }
    #   secondaryImage {
    #     fluid(maxHeight: 1500, background: "rgb:342e37") {
    #       ...GatsbyContentfulFluid_tracedSVG
    #     }
    #   }
    # }
    allContentfulArtboard(sort: { fields: [artboardDate], order: DESC }, limit: 2) {
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
    allContentfulPhotoCollection(limit: 4) {
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
    allYoutubeVideo (limit: 1){
      edges {
        node {
          id
          title
          description
          videoId
          publishedAt
          privacyStatus
          channelTitle
        }
      }
    }
  }
`
