import React from 'react'
import { graphql, Link } from 'gatsby'
import SEO from '../components/SEO'
import Layout from '../components/Layout'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"

const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <b className="font-bold">{text}</b>,
    [MARKS.ITALIC]: (text) => <i className="font-italic">{text}</i>,
    [MARKS.UNDERLINE]: (text) => <u className="underline">{text}</u>,
    [MARKS.CODE]: (text) => (
      <code className="font-mono px-1 py-2 mx-1 bg-gray-100 rounded text-sm">
        {text}
      </code>
    ),
  },
  renderNode: {
    [INLINES.ENTRY_HYPERLINK]: (node, children) => {
      const { slug } = node.data.target
      console.log(node)
      return (
        <Link
          to={`/writings/${slug}`}
        >
          {children}
        </Link>
      )
    },
    [BLOCKS.PARAGRAPH]: (node, children) => {
      if (node.content[0].value === '') {
        return <br />
      } else {
        return <p className="leading-loose text-lg font-light">{children}</p>
      }
    },
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { gatsbyImageData, description } = node.data.target
      return (
        <GatsbyImage
          image={getImage(gatsbyImageData)}
          alt={description}
          loading="lazy"
        />
      )
    },
  },
}


const WritingTemplate = ({ data }) => {
  const writing = data.contentfulWriting

  return (
    <Layout>
      <SEO title={writing.title} />
      <div className="flex flex-wrap w-full font-manrope text-themeOffWhite mx-auto justify-center xl:w-5/6">
        <div className="flex w-full justify-start ml-4 items-baseline mt-1">
          <h1 className="text-3xl sm:text-4xl font-light textshadow-blue">
            {writing.title}
          </h1>
          <p className="text-md sm:text-lg mt-12 font-extralight textshadow-red">
            ~{writing.writingDate}
          </p>
        </div>
        <div className="w-11/12 mt-6 mb-12 text-left max-w-xl lg:max-w-2xl xl:max-w-5xl">
          {renderRichText(writing.body, options)}
        </div>
      </div>
    </Layout>
  );
}

export default WritingTemplate

export const query = graphql`
  query WritingBySlug($slug: String!) {
    contentfulWriting(slug: { eq: $slug }) {
      title
      body {
        raw
        references {
          ... on ContentfulAsset {
            contentful_id
            title
            description
            gatsbyImageData(width: 1000)
            __typename
          }
          ... on ContentfulWriting {
            contentful_id
            __typename
            title
            slug
          }
        }
      }
      writingDate
      metadata
    }
  }
`
