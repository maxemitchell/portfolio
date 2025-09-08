const path = require('path')

// Updated gatsby-node.js for local content (replaces Contentful)
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Templates
  const writingTemplate = path.resolve('./src/templates/writing.js')
  const artboardTemplate = path.resolve('./src/templates/artboard.js') 
  const photoCollectionTemplate = path.resolve('./src/templates/photo_collection.js')

  const result = await graphql(`
    query {
      # Writings from markdown files
      writings: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/writings/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          id
          frontmatter {
            slug
            title
            date
          }
          fileAbsolutePath
        }
      }
      
      # Artboards from JSON files  
      artboards: allArtboard(sort: { date: DESC }) {
        nodes {
          id
          slug
          title
          date
        }
      }
      
      # Photo collections from JSON files
      photoCollections: allPhotoCollection(sort: { date: DESC }) {
        nodes {
          id
          slug
          title
          date
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('Error loading content', result.errors)
    return
  }

  // Create writing pages
  const writings = result.data.writings.nodes
  writings.forEach((writing) => {
    const slug = writing.frontmatter.slug
    createPage({
      path: `/writings/${slug}/`,
      component: writingTemplate,
      context: {
        id: writing.id,
        slug: slug,
      },
    })
  })

  // Create artboard pages
  const artboards = result.data.artboards.nodes
  artboards.forEach((artboard) => {
    createPage({
      path: `/artboard/${artboard.slug}/`,
      component: artboardTemplate,
      context: {
        id: artboard.id,
        slug: artboard.slug,
      },
    })
  })

  // Create photo collection pages
  const photoCollections = result.data.photoCollections.nodes
  photoCollections.forEach((collection) => {
    createPage({
      path: `/photography/${collection.slug}/`,
      component: photoCollectionTemplate,
      context: {
        id: collection.id,
        slug: collection.slug,
      },
    })
  })

  reporter.info(`Created ${writings.length} writing pages`)
  reporter.info(`Created ${artboards.length} artboard pages`) 
  reporter.info(`Created ${photoCollections.length} photo collection pages`)
}

// Create schema for JSON content types with remote image support
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
    type Artboard implements Node {
      id: ID!
      title: String!
      description: String
      date: Date! @dateformat
      slug: String!
      images: ArtboardImages
      metadata: ArtboardMetadata
    }
    
    type ArtboardImages {
      main: String
      mainImage: File @remoteFile(url: "main")
      thumbnail: String
      thumbnailImage: File @remoteFile(url: "thumbnail")
    }
    
    type ArtboardMetadata {
      dimensions: String
      tools: [String]
      contentfulId: String
      createdAt: String
      updatedAt: String
    }

    type PhotoCollection implements Node {
      id: ID!
      title: String!
      description: String
      date: Date! @dateformat
      slug: String!
      coverImage: String
      coverImageFile: File @remoteFile(url: "coverImage")
      images: [PhotoCollectionImage]
      metadata: PhotoCollectionMetadata
    }
    
    type PhotoCollectionImage {
      url: String
      imageFile: File @remoteFile(url: "url")
      alt: String
      caption: String
    }
    
    type PhotoCollectionMetadata {
      location: String
      equipment: String
      contentfulId: String
      createdAt: String
      updatedAt: String
    }

    type SiteData implements Node {
      id: ID!
      title: String
      metadata: SiteDataMetadata
    }
    
    type SiteDataMetadata {
      contentfulId: String
      createdAt: String
      updatedAt: String
    }
  `

  createTypes(typeDefs)
}

// Transform R2 URLs to full URLs before remote file processing
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  // Convert r2:// URLs to full URLs for remote file processing
  if (node.internal.type === 'Artboard' && node.images) {
    const baseUrl = process.env.GATSBY_R2_CDN_URL || 'https://images.maxemitchell.com'
    
    if (node.images.main && node.images.main.startsWith('r2://')) {
      node.images.main = node.images.main.replace('r2://', `${baseUrl}/`)
    }
    if (node.images.thumbnail && node.images.thumbnail.startsWith('r2://')) {
      node.images.thumbnail = node.images.thumbnail.replace('r2://', `${baseUrl}/`)
    }
  }

  if (node.internal.type === 'PhotoCollection') {
    const baseUrl = process.env.GATSBY_R2_CDN_URL || 'https://images.maxemitchell.com'
    
    if (node.coverImage && node.coverImage.startsWith('r2://')) {
      node.coverImage = node.coverImage.replace('r2://', `${baseUrl}/`)
    }
    
    if (node.images && Array.isArray(node.images)) {
      node.images.forEach(image => {
        if (image.url && image.url.startsWith('r2://')) {
          image.url = image.url.replace('r2://', `${baseUrl}/`)
        }
      })
    }
  }
}
