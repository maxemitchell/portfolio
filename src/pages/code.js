import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'

const Index = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const numRepos = data.githubData.data.viewer.repositories.totalCount
  const githubRepos = data.githubData.data.viewer.repositories.nodes

  return (
    <Layout>
      <Helmet title={siteTitle} />
      <div className="w-full max-w-5xl mx-auto">

        <div className="flex w-full flex-wrap justify-center">

          <h2 className="w-full text-center mb-2 text-4xl lg:text-5xl font-light">
            my {numRepos} public github repos:
          </h2>

          {githubRepos.map((repo, index) => {
            return (
              <a
                className="flex flex-wrap w-full justify-center items-center mb-6 mx-4" key={index.videoId}
                href={repo.url}
                target="_blank"
              >
                <h3 className="w-full text-left text-2xl font-manrope font-light text-themeBlue mb-2">
                  {repo.name}
                </h3>
                <p className="w-full text-base font-manrope font-thin">
                  {repo.description}
                </p>
              </a>
            )
          })}
        </div>

      </div>
    </Layout>
  )
}

export default Index

export const query = graphql`
  query Code {
    site {
      siteMetadata {
        title
      }
    }
    githubData {
      data {
        viewer {
          repositories {
            totalCount
            nodes {
              description
              name
              url
              stargazers {
                totalCount
              }
            }
          }
        }
      }
    }
  }
`
