import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Video from '../components/Video'

const Index = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const youtubeVideos = data.allYoutubeVideo.edges

  return (
    <Layout>
      <div className="">
        <Helmet title={siteTitle} />
        <div className="">
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
  query Videos {
    site {
      siteMetadata {
        title
      }
    }
    allYoutubeVideo {
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
