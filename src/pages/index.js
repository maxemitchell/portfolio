import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Video from '../components/Video'
import Img from 'gatsby-image'

const Index = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const featuredImage = data.contentfulSiteData.featuredImage
  const secondaryImage = data.contentfulSiteData.secondaryImage
  const artboards = data.allContentfulArtboard.edges
  const photoCollections = data.allContentfulPhotoCollection.edges
  const youtubeVideos = data.allYoutubeVideo.edges

  return (
    <Layout>
      <Helmet title={siteTitle} />
      <div className="w-full max-w-6xl mx-auto">

        <div className="flex w-full flex-no-wrap mt-8 justify-center">
          <Img
            className="picture-border-sm-1 ml-4 w-3/5 picture-border-1 max-w-xl"
            alt="Featured Image"
            fluid={secondaryImage.fluid}
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
    contentfulSiteData {
      featuredImage {
        fluid(maxHeight: 2000, background: "rgb:342e37") {
          ...GatsbyContentfulFluid_tracedSVG
        }
      }
      secondaryImage {
        fluid(maxHeight: 2000, background: "rgb:342e37") {
          ...GatsbyContentfulFluid_tracedSVG
        }
      }
    }
    allContentfulArtboard(
      sort: { fields: [artboardDate], order: DESC }
      limit: 2
    ) {
      edges {
        node {
          title
          slug
          # artboardDate(formatString: "MMMM Do, YYYY")
          # artboard {
          #   fluid(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
          #     ...GatsbyContentfulFluid
          #   }
          # }
          # description {
          #   childMarkdownRemark {
          #     html
          #   }
          # }
        }
      }
    }
    allContentfulPhotoCollection(limit: 4) {
      edges {
        node {
          title
          slug
          # description {
          #   childMarkdownRemark {
          #     html
          #   }
          # }
        }
      }
    }
    allYoutubeVideo(limit: 1) {
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
