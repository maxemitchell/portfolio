import React from 'react'
import { graphql } from 'gatsby'
import SEO from '../components/SEO'
import Layout from '../components/Layout'
import Header from '../components/Header'
import WritingPreview from '../components/WritingPreview'

const Writings = ({ data }) => {
  const writings = data.allContentfulWriting.edges

  return (
    <Layout>
      <SEO title="Writings" />
      <div className="w-full max-w-6xl mx-auto">

        <div className="flex w-full flex-wrap justify-around items-end mt-6">

          <Header variant="3">
            writings
          </Header>

          {writings.map(({ node: writing }) => {
            return (
              <div key={writing.title}>
                <WritingPreview
                  slug={writing.slug}
                  title={writing.title}
                />
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export default Writings

export const query = graphql`
  query Writings {
    allContentfulWriting(
      sort: { fields: writingDate, order: DESC }
    ) {
      edges {
        node {
          title
          slug
        }
      }
    }
  }
`
