import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Video from '../components/Video'
import Img from 'gatsby-image'

const Index = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const profilePicture = data.contentfulSiteData.secondaryImage
  const artboards = data.allContentfulArtboard.edges
  const photoCollections = data.allContentfulPhotoCollection.edges
  const youtubeVideos = data.allYoutubeVideo.edges

  return (
    <Layout>
      <Helmet title={siteTitle} />
      <div className="w-full max-w-6xl mx-auto">

        <div className="flex w-full flex-no-wrap mt-8 justify-center">
          <Img
            className="picture-border-sm-1 ml-4 w-3/5 max-w-xl"
            alt="Featured Image"
            fluid={profilePicture.fluid}
          />

          <div className="flex flex-wrap w-2/5 font-manrope px-3 sm:px-6 content-center max-w-lg">
            <p className="w-full text-left text-4xl sm:text-5xl lg:text-6xl font-light">
              hi!
            </p>
            <p className="w-full text-center text-2xl sm:text-3xl lg:text-5xl font-light">
              I'm
              <Link to="/about" className="inline text-themeBlue"> Max</Link>
            </p>
            <p className="w-full text-left md:text-center text-lg sm:text-xl lg:text-2xl font-light pt-3">
              I study
              <a href="https://ece.illinois.edu/" className="inline text-themeBlue"> computer engineering</a> at
              <a href="https://illinois.edu/" className="inline text-themeRed"> UIUC</a>
            </p>
            <p className="w-full text-left md:text-center text-base sm:text-lg lg:text-xl font-light pt-4">
              I also take
              <Link to="/photos" className="inline text-themeBlue"> pictures</Link>, make
              <Link to="/videos" className="inline text-themeBlue"> videos</Link>, and
              <Link to="/code" className="inline text-themeBlue"> code</Link>
            </p>
            <p className="w-full text-center text-xl sm:text-2xl lg:text-3xl font-normal pt-6">
              enjoy!
              <p className="inline text-themeBlue"> :)</p>
            </p>
          </div>
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

      <div className="flex w-full flex-wrap justify-center">

        <h2 className="w-full text-center mt-1 text-4xl lg:text-5xl font-light">
          recent photo_collections
        </h2>

        {photoCollections.map(({ node: photoCollection }) => {
          return (
            <Link
              className="w-full sm:w-2/5 mx-4 mb-3"
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

        <h2 className="w-full text-center mb-2 text-4xl lg:text-5xl font-light">
          recent video
        </h2>

        {youtubeVideos.map(({ node: youtubeVideo }) => {
          return (
            <div className="w-full h-64 mx-4 mb-3 picture-border-sm-1">
              <Video
                videoSrcURL={
                  'https://www.youtube.com/embed/' + youtubeVideo.videoId
                }
                videoTitle={youtubeVideo.title}
                className="h-full w-full"
              />
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
    contentfulSiteData {
      secondaryImage {
        fluid(maxHeight: 800) {
          ...GatsbyContentfulFluid_withWebp
        }
      }
    }
    allContentfulArtboard(
      limit: 2
    ) {
      edges {
        node {
          title
          slug
          artboard {
            fluid(maxWidth: 1200) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
        }
      }
    }
    allContentfulPhotoCollection(limit: 3) {
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
    allYoutubeVideo(limit: 1) {
      edges {
        node {
          title
          description
          videoId
        }
      }
    }
  }
`
