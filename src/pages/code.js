import React from 'react'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'

const Index = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const numRepos = data.githubData.data.viewer.repositories.totalCount;
  const githubRepos = data.githubData.data.viewer.repositories.nodes;

  return (
    <Layout>
      <div className="">
        <Helmet title={siteTitle} />
        <div className="">
          <h2 className="">my {numRepos} github repos:</h2>
          {githubRepos.map((repo) => {
            return (
              <div>
                <h3>{repo.name}</h3>
                Check it out <a href={repo.url}>here</a>
                <p>
                  {repo.readme.text}
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
              readme {
                text
              }
            }
          }
        }
      }
    }
  }
`
