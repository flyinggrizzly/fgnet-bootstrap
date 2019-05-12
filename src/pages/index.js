import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from 'components/layout'
import CTA from 'components/cta'
import markdownify from 'utils/markdownify'

import styles from 'styles/blog_index.module.css'

const BlogIndex = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMdx.edges

  return (
    <div className="App">
      <Layout>
        { posts.map(post => {
          let { fields: { date, title, slug, excerpt } } = post.node

          return (
            <PostPreview
              key={ slug }
              title={ title }
              date={ date }
              slug={ slug }
              excerpt={ excerpt }
            />
          )
        }) }
      </Layout>
    </div>
  )
}
export default BlogIndex

const PostPreview = ({ title, date, slug, excerpt }) => {
  return (
    <section className={ styles.postPreview }>
      <h1 className={ styles.postPreviewTitle }>
        <Link to={ slug }>{ title }</Link>
      </h1>
      <h3 className={ styles.postPreviewDate }>{ date }</h3>
      <div className={ styles.postPreviewExerpt }>
        { markdownify(excerpt) }
      </div>
      <CTA target={ slug }>Read post</CTA>
    </section>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(
      sort: { fields: [ fields___date ], order: DESC }
    ) {
      edges {
        node {
         excerpt
          fields {
            slug
            date
            title
            excerpt
          }
        }
      }
    }
  }
`
