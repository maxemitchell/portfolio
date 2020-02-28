const path = require('path')

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    const loadArtboards = new Promise((resolve, reject) => {
        graphql(
        `
          {
            allContentfulArtboard(
                sort: { fields: [artboardDate], order: DESC }
            ) {
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

    return Promise.all([loadArtboards])
}
