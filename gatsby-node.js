const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const postTemplate = path.resolve(`./src/components/templates/blog_post.jsx`)

  return graphql(
    `
      {
        allMdx(
          sort: { fields: [fields___date], order: DESC }
        ) {
          edges {
            node {
              body
              id
              fields {
                slug
                date
                title
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: postTemplate,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === "Mdx") {
    const filepath = createFilePath({ node, getNode }) // => /2019-04-01-post-title/
    const [ , year, month, day, title ] = filepath.match(/^\/([\d]{4})-([\d]{2})-([\d]{2})-([\w-]+)\/$/)
    const slug = `/${year}/${month}/${title}/`
    const date = `${year}-${month}-${day}`

    createNodeField({ name: 'slug', node, value: slug, })
    createNodeField({ name: 'date', node, value: date, })
    createNodeField({ name: 'title', node, value: node.frontmatter.title })
  }
}
