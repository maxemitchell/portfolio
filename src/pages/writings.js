import React from 'react'
import { graphql } from 'gatsby'
import SEO from '../components/SEO'
import Layout from '../components/Layout'
import Header from '../components/Header'
import WritingPreview from '../components/WritingPreview'

const Writings = ({ data }) => {
  const writings = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO
        title="Writings"
        desc="A collection of writings on various topics, from AI to crohn's to crypto."
      />
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex w-full flex-wrap mt-6">
          <div className="w-full mb-6 mt-1">
            <Header variant="3">weekly writings</Header>
          </div>

          {writings.map(({ node: writing }) => {
            const preview = writing.excerpt
            return (
              <WritingPreview
                slug={writing.frontmatter.slug}
                title={writing.frontmatter.title}
                preview={preview}
                writingDate={writing.frontmatter.writingDate}
                key={writing.frontmatter.slug}
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
    allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "writing" } } }
      sort: { fields: frontmatter___writingDate, order: DESC }
    ) {
      edges {
        node {
          excerpt(pruneLength: 180)
          frontmatter {
            title
            slug
            writingDate
          }
        }
      }
    }
  }
`
