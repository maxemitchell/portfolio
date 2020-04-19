import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'
import Layout from '../components/layout'

const ArtboardTemplate = ({ data }) => {
  const artboard = data.contentfulArtboard
  const descriptionTags = artboard.description.childMarkdownRemark.htmlAst.children

  return (
    <Layout>
      <Helmet
        title={artboard.title}
      />
      <div className="flex flex-wrap w-full font-manrope text-themeOffWhite max-w-6xl mx-auto justify-center">

        <div className="flex w-full justify-start ml-4 items-baseline mt-1">
          <h1 className="text-4xl font-light textshadow-blue">{artboard.title}</h1>
          <p className="text-lg font-thin textshadow-red">~{artboard.artboardDate}</p>
        </div>

        <Img
          className="flex w-full picture-border-2 mx-4 mt-2"
          alt={artboard.title}
          fluid={artboard.artboard.fluid}
        />
        <div className="w-11/12 sm:w-10/12 md:w-9/12 lg:w-6/12 mt-6 text-left">
          {descriptionTags.map((item, key) => {
            if(item.type === "element" && item.tagName === "h1"){
              return(
                <h1 className="text-2xl font-light text-center md:text-3xl" key={key}>
                  {item.children[0].value}
                </h1>
              )
            }else if(item.type === "element" && item.tagName === "p"){
              return(
                <p className="mt-4 text-md font-thin lg:text-lg lg:mb-8" key={key}>
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
        fluid(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulFluid
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
