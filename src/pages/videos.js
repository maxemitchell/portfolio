import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Video from '../components/Video'
import Header from '../components/Header'

const Index = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const youtubeVideos = data.allYoutubeVideo.edges

  return (
    <Layout>
      <Helmet title={siteTitle} />
      <div className="w-full max-w-5xl mx-auto">

        <div className="flex w-full flex-wrap justify-center">

          <Header variant="3">
            recent videos
          </Header>

          {youtubeVideos.map(({ node: youtubeVideo }, index) => {
            return (
              <div className="flex flex-wrap md:flex-no-wrap w-full justify-center items-center mb-6 mx-4" key={youtubeVideo.videoId}>
                {index % 2 == 1 &&
                  <p className="hidden md:flex w-full md:w-1/2 mr-6 text-base font-manrope font-thin">
                    {youtubeVideo.description}
                  </p>
                }
                <div className="w-full md:w-1/2">
                  <h3 className="w-full text-left text-2xl font-manrope font-light text-themeBlue mb-2">
                    {youtubeVideo.title}
                  </h3>
                  <div className="w-full h-64 mb-2 picture-border-sm-2">
                    <Video
                      videoSrcURL={
                        'https://www.youtube.com/embed/' + youtubeVideo.videoId
                      }
                      videoTitle={youtubeVideo.title}
                      className="h-full w-full"
                    />
                  </div>
                </div>
                {index % 2 === 0 &&
                  <p className="hidden md:flex w-full md:w-1/2 ml-6 text-base font-manrope font-thin">
                    {youtubeVideo.description}
                  </p>
                }
                <p className="w-full md:hidden text-base font-manrope font-thin">
                  {youtubeVideo.description}
                </p>
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
          title
          description
          videoId
        }
      }
    }
  }
`
