import React, { Component } from 'react'
import { graphql } from 'gatsby'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'

import Layout from 'components/layout'

export default class BlogPost extends Component {
  render() {
    let { mdx } = this.props.data

    return (
      <Layout>
        <h1>{ mdx.frontmatter.title }</h1>
        <MDXRenderer>
          { mdx.code.body }
        </MDXRenderer>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query BlogPostQuery($slug: String) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      frontmatter {
        title
      }
      fields {
        date
        slug
        title
      }
      code {
        body
      }
    }
  }
`
