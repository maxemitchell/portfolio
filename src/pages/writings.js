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
        <div className="flex w-full flex-wrap mt-6">
          <div className="w-full mb-6 mt-1">
            <Header variant="3">weekly writings</Header>
          </div>

          {writings.map(({ node: writing }) => {
            const preview = writing.preview.internal.content
            return (
              <WritingPreview
                slug={writing.slug}
                title={writing.title}
                preview={preview}
                writingDate={writing.writingDate}
                key={writing.title}
              />
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
    allContentfulWriting(sort: { fields: writingDate, order: DESC }) {
      edges {
        node {
          title
          slug
          writingDate
          preview {
            internal {
              content
            }
          }
        }
      }
    }
  }
`
