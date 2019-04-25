import React, { Component } from 'react'
import { graphql } from 'gatsby'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import { Row, Col } from 'react-bootstrap'

import Layout from 'components/layout'

import postStyles from 'styles/blog_post.module.css'

export default class BlogPost extends Component {
  render() {
    let { mdx: post } = this.props.data
    let { fields: metadata } = post

    return (
      <Layout>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <h1 className={ postStyles.postTitle }>{ metadata.title }</h1>
            <h6>{ metadata.date }</h6>
            <MDXRenderer>
              { post.code.body }
            </MDXRenderer>
          </Col>
        </Row>
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
