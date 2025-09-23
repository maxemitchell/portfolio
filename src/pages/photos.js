import React from 'react'
import { graphql } from 'gatsby'
import SEO from '../components/SEO'
import Layout from '../components/Layout'
import Header from '../components/Header'
import ArtboardPreview from '../components/ArtboardPreview'
import PhotoCollectionPreview from '../components/PhotoCollectionPreview'

const Photos = ({ data }) => {
  const artboards = data.artboards.edges
  const photoCollections = data.photoCollections.edges

  return (
    <Layout>
      <SEO
        title="Photos"
        desc="A collection of photos I've taken, usually of friends, nature, and views on vacation."
      />
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex w-full flex-wrap justify-around items-end mt-6">
          <div className="w-full">
            <Header variant="3">photo collections</Header>
          </div>

          {photoCollections.map(({ node: photoCollection }) => {
            const { title, slug, featuredImage, featuredImageMetadata } =
              photoCollection.frontmatter
            const r2FolderName =
              photoCollection.frontmatter.r2FolderName || slug
            const image = `photo_collections/${r2FolderName}/${featuredImage}.jpg`

            return (
              <PhotoCollectionPreview
                slug={slug}
                title={title}
                image={image}
                imageMetadata={featuredImageMetadata}
                key={title}
              />
            )
          })}
        </div>

        <div className="flex w-full flex-wrap justify-center">
          <div className="w-full">
            <Header variant="3">artboards</Header>
          </div>

          {artboards.map(({ node: artboard }) => {
            return (
              <ArtboardPreview
                slug={artboard.frontmatter.slug}
                title={artboard.frontmatter.title}
                image={artboard.frontmatter.artboard}
                artboardMetadata={artboard.frontmatter.artboardMetadata}
                key={artboard.frontmatter.title}
              />
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export default Photos

export const query = graphql`
  query Photos {
    artboards: allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "artboard" } } }
      sort: { fields: [frontmatter___artboardDate], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            slug
            artboard
            artboardMetadata {
              aspectRatio
              dominantColor
            }
          }
        }
      }
    }
    photoCollections: allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "photo-collection" } } }
      sort: { fields: [frontmatter___collectionDate], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            slug
            r2FolderName
            featuredImage
            featuredImageMetadata {
              aspectRatio
              dominantColor
            }
          }
        }
      }
    }
  }
`
