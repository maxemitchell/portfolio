import React from 'react'
import { graphql } from 'gatsby'
import SEO from '../components/SEO'
import Layout from '../components/Layout'

const MarkdownWritingTemplate = ({ data }) => {
  const writing = data.markdownRemark
  const { title, writingDate } = writing.frontmatter

  return (
    <Layout>
      <SEO title={title} />
      <div className="flex flex-wrap w-full font-manrope text-themeOffWhite mx-auto justify-center xl:w-5/6">
        <div className="flex w-full justify-start ml-4 items-baseline mt-1">
          <h1 className="text-3xl sm:text-4xl font-light textshadow-blue">
            {title}
          </h1>
          <p className="text-md sm:text-lg mt-12 font-extralight textshadow-red">
            ~{writingDate}
          </p>
        </div>
        <div className="w-11/12 mt-6 mb-12 text-left max-w-xl lg:max-w-2xl xl:max-w-5xl">
          <div className="markdown-content text-themeOffWhite">
            <div dangerouslySetInnerHTML={{ __html: writing.html }} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query MarkdownWritingBySlug($slug: String!) {
    markdownRemark(
      frontmatter: { slug: { eq: $slug }, type: { eq: "writing" } }
    ) {
      html
      excerpt(pruneLength: 160)
      timeToRead
      frontmatter {
        title
        slug
        writingDate
        metadata
      }
    }
  }
`

export default MarkdownWritingTemplate
