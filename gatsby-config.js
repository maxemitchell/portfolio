require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

const contentfulConfig = {
  spaceId: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  host: process.env.CONTENTFUL_HOST
}

const youtubeAPIKey = process.env.YOUTUBE_API_KEY;

const { spaceId, accessToken } = contentfulConfig

if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful spaceId and the access token need to be provided.'
  )
}

if (!youtubeAPIKey) {
  throw new Error(
    'YouTube API key needs to be provided.'
  )
}

module.exports = {
  siteMetadata: {
    title: 'maxemitchell portfolio',
  },
  plugins: [
    'gatsby-transformer-remark',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-plugin-postcss',
    {
        resolve: 'gatsby-source-youtube-v2',
        options: {
            channelId: 'UC9HSIRP_CkJJznkRd3E0-ZA',
            apiKey: youtubeAPIKey,
            maxVideos: 10
        },
    },
    {
      resolve: 'gatsby-source-contentful',
      options: contentfulConfig,
    },
    {
        resolve: 'gatsby-plugin-purgecss',
        options: {
            printRejected: false,
            develop: false,
            tailwind: true
        }
    },
    {
        resolve: 'gatsby-plugin-manifest',
        options: {
            name: 'maxemitchell',
            short_name: 'maxemitchell',
            start_url: '/',
            background_color: '#FFFFFF',
            theme_color: '#000000',
            display: 'standalone',
            icon: `src/images/icon.png`,
        }
    }
  ],
}
