import React from 'react'
import { graphql } from 'gatsby'
import SEO from '../components/SEO'
import Layout from '../components/Layout'

const Index = ({ data }) => {
  const githubRepos = data.githubData.data.viewer.repositories.nodes

  return (
    <Layout>
      <SEO title="Code" />
      <div className="w-full max-w-5xl mx-auto">

        <div className="flex w-full flex-wrap justify-center">

          {githubRepos.map((repo, index) => {
            return (
              <a
                className="flex flex-wrap w-full justify-center items-center mt-3 mb-3 mx-4 hover:code-bg duration-500" key={index}
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
