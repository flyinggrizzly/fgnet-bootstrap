import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import { MDXProvider } from '@mdx-js/react'
import UniqueSlugContext from 'contexts/unique_slug_context'
import GithubSlugger from 'github-slugger'

import { Container } from 'react-bootstrap'
import mdxComponents from 'components/mdx_components'

import Nav from './nav'

import layoutStyles from 'styles/layout.module.css'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Nav />
        <Container className={ layoutStyles.mainContent }>
          <UniqueSlugContext.Provider value={ new GithubSlugger() }>
            <MDXProvider components={ mdxComponents }>
              { children }
            </MDXProvider>
          </UniqueSlugContext.Provider>
        </Container>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
