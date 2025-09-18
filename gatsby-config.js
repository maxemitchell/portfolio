require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})


const youtubeAPIKey = process.env.YOUTUBE_API_KEY
const githubAPIKey = process.env.GITHUB_API_KEY
const googleMeasurementId = process.env.GOOGLE_MEASUREMENT_ID

if(process.env.gatsby_executing_command != 'serve'){  
  if (!youtubeAPIKey) {
    throw new Error(
      'YouTube API key needs to be provided.'
    )
  }
}

module.exports = {
  siteMetadata: {
    siteUrl: "https://www.maxemitchell.com",
    title: "Max Mitchell",
    titleTemplate: "Max Mitchell | %s",
    description: "Max Mitchell's personal portfolio website showcasing his photography, YouTube videos, coding projects, and work history.",
    banner: "/logo_horiz_crop.png",
    headline: "Max Mitchell's Personal Portfolio Website",
    siteLanguage: "en",
    ogLanguage: "en_US",
    author: "Max Mitchell",
    twitter: "@maxemitchell",
    facebook: "Max Mitchell",
  },
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1200,
              showCaptions: true,
              markdownCaptions: true
            }
          },
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaults: {
          quality: 10,
          
        },
      },
    },
    'gatsby-plugin-postcss',
    {
        resolve: 'gatsby-source-youtube-v3',
        options: {
            channelId: 'UC9HSIRP_CkJJznkRd3E0-ZA',
            apiKey: youtubeAPIKey,
            maxVideos: 10
        },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-source-github-api',
      options: {
        token: githubAPIKey,
        graphQLQuery: `
          query {
            viewer {
              repositories(last: 10, orderBy: {field: PUSHED_AT, direction: DESC}) {
                totalCount
                nodes {
                  name
                  description
                  url
                  stargazers {
                    totalCount
                  }
                  readme: object(expression:"master:README.md"){
                    ... on Blob{
                      text
                    }
                  }
                }
              }
            }
          }
        `
      },
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Manrope\:200,300,400,500,600,700',
        ],
        display: 'swap'
      },
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
            name: 'Max Mitchell',
            short_name: 'maxemitchell',
            start_url: '/',
            background_color: '#342e37',
            theme_color: '#342e37',
            display: 'standalone',
            icon: `src/images/icon.png`,
        }
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          googleMeasurementId
        ],
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        pluginConfig: {
          head: false,
          respectDNT: true,
        },
      },
    }
  ],
}
