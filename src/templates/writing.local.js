import React from 'react'
import { graphql, Link } from 'gatsby'
import SEO from '../components/SEO'
import Layout from '../components/Layout'
import R2Image from '../components/R2Image'

// Custom markdown renderer for R2 images
const MarkdownContent = ({ html }) => {
  // Replace r2:// URLs in HTML with R2Image components
  const processedHtml = html.replace(
    /<img[^>]+src="r2:\/\/([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g,
    (match, src, alt) => {
      return `<img src="r2://${src}" alt="${alt}" class="mx-auto my-2 rounded-lg shadow-md" loading="lazy" />`
    }
  )

  return (
    <div 
      className="prose prose-lg max-w-none text-themeOffWhite prose-headings:text-themeOffWhite prose-a:text-themeBlue hover:prose-a:text-themeRed prose-strong:text-themeOffWhite prose-code:text-themeOffWhite prose-code:bg-gray-700"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  )
}

const WritingTemplate = ({ data }) => {
  const writing = data.markdownRemark

  return (
    <Layout>
      <SEO title={writing.frontmatter.title} />
      <div className="flex flex-wrap w-full font-manrope text-themeOffWhite mx-auto justify-center xl:w-5/6">
        <div className="flex w-full justify-start ml-4 items-baseline mt-1">
          <h1 className="text-3xl sm:text-4xl font-light textshadow-blue">
            {writing.frontmatter.title}
          </h1>
          <p className="text-md sm:text-lg mt-12 font-extralight textshadow-red">
            ~{writing.frontmatter.date}
          </p>
        </div>
        <div className="w-11/12 mt-6 mb-12 text-left max-w-xl lg:max-w-2xl xl:max-w-5xl">
          <MarkdownContent html={writing.html} />
        </div>
      </div>
    </Layout>
  )
}

export default WritingTemplate

export const query = graphql`
  query WritingBySlug($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        slug
        preview
        metadata
      }
    }
  }
`
