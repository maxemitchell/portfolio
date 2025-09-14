const path = require('path')

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    const loadArtboards = new Promise((resolve, reject) => {
        graphql(
        `
          {
            allMarkdownRemark(filter: { frontmatter: { type: { eq: "artboard" } } }) {
              edges {
                node {
                  frontmatter {
                    title
                    slug
                  }
                }
              }
            }
          }
        `
        ).then(result => {
            if (result.errors) {
              reject(result.errors)
            }

            const artboards = result.data.allMarkdownRemark.edges

            artboards.forEach((artboard) => {
              createPage({
                path: `/artboards/${artboard.node.frontmatter.slug}/`,
                component: path.resolve('./src/templates/artboard.js'),
                context: {
                  slug: artboard.node.frontmatter.slug
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

    const loadWritings = new Promise((resolve, reject) => {
      graphql(
        `
          {
            allMarkdownRemark(filter: { frontmatter: { type: { eq: "writing" } } }) {
              edges {
                node {
                  frontmatter {
                    title
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        const writings = result.data.allMarkdownRemark.edges

        writings.forEach((writing) => {
          createPage({
            path: `/writings/${writing.node.frontmatter.slug}/`,
            component: path.resolve('./src/templates/writing.js'),
            context: {
              slug: writing.node.frontmatter.slug
            },
          })
        })
        resolve()
      })
    })

    return Promise.all([loadArtboards, loadPhotoCollections, loadWritings])
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(glsl|frag|vert|geom|comp|vs|fs|gs|vsh|fsh|gsh|vshader|fshader|gshader)$/,
          use: ['raw-loader'],
        },
      ],
    },
  })

  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /p5/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}