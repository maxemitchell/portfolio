const path = require('path')

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    const loadArtboards = new Promise((resolve, reject) => {
        graphql(
        `
          {
            allContentfulArtboard {
              edges {
                node {
                  title
                  slug
                }
              }
            }
          }
        `
        ).then(result => {
            if (result.errors) {
              console.log(result.errors)
              reject(result.errors)
            }

            const artboards = result.data.allContentfulArtboard.edges

            artboards.forEach((artboard) => {
              createPage({
                path: `/artboards/${artboard.node.slug}/`,
                component: path.resolve('./src/templates/artboard.js'),
                context: {
                  slug: artboard.node.slug
                },
              })
            })
            resolve()
        })
    })

    const loadPhotoCollections = new Promise((resolve, reject) => {
        graphql(
        `
          {
            allContentfulPhotoCollection {
              edges {
                node {
                  title
                  slug
                }
              }
            }
          }
        `
        ).then(result => {
            if (result.errors) {
              console.log(result.errors)
              reject(result.errors)
            }

            const photoCollections = result.data.allContentfulPhotoCollection.edges

            photoCollections.forEach((photoCollection) => {
              createPage({
                path: `/photo_collections/${photoCollection.node.slug}/`,
                component: path.resolve('./src/templates/photo_collection.js'),
                context: {
                  slug: photoCollection.node.slug
                },
              })
            })
            resolve()
        })
    })

    return Promise.all([loadArtboards, loadPhotoCollections])
}
