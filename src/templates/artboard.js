import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import Img from 'gatsby-image'
import Layout from '../components/Layout'

const ArtboardTemplate = ({ data }) => {
  const artboard = data.contentfulArtboard
  const descriptionTags =
    artboard.description.childMarkdownRemark.htmlAst.children

  return (
    <Layout>
      <Helmet title={artboard.title} />
      <div className="flex flex-wrap w-full font-manrope text-themeOffWhite mx-auto justify-center xl:w-5/6">
        <div className="flex w-full justify-start ml-4 items-baseline mt-1">
          <h1 className="text-3xl sm:text-4xl font-light textshadow-blue">
            {artboard.title}
          </h1>
          <p className="text-md sm:text-lg font-thin textshadow-red">
            ~{artboard.artboardDate}
          </p>
        </div>

        <Img
          className="flex w-full picture-border-2 mx-4 mt-2"
          alt={artboard.title}
          fluid={artboard.artboard.fluid}
        />
        <div className="w-11/12 mt-6 text-left max-w-xl lg:max-w-2xl xl:max-w-5xl">
          {descriptionTags.map((item, key) => {
            if (item.type === 'element' && item.tagName === 'h1') {
              return (
                <h1
                  className="text-2xl font-light text-center md:text-3xl"
                  key={key}
                >
                  {item.children[0].value}
                </h1>
              )
            } else if (item.type === 'element' && item.tagName === 'p') {
              return (
                <p
                  className="mt-3 text-md font-thin lg:text-lg lg:mb-5"
                  key={key}
                >
                  {item.children[0].value}
                </p>
              )
            }
          })}
        </div>
      </div>
    </Layout>
  )
}

export default ArtboardTemplate

export const query = graphql`
  query ArtboardBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulArtboard(slug: { eq: $slug }) {
      title
      artboard {
        fluid(maxWidth: 1920) {
          ...GatsbyContentfulFluid_withWebp
        }
      }
      description {
        childMarkdownRemark {
          htmlAst
        }
      }
      artboardDate
      metadata
    }
  }
`
