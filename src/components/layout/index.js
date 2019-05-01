import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import { MDXProvider } from '@mdx-js/react'

import { Container, Navbar } from 'react-bootstrap'
import mdxComponents from 'components/mdx_components'

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
        <Navbar expand="md" variant="dark" bg="dark" sticky="top" className={ layoutStyles.nav }>
          <Navbar.Brand href="/">
            <img src="/flying-grizzly.png" alt="a flying grizzly bear"
              className="d-inline-block align-bottom"
              height="40"
            />
            <span className={ layoutStyles.navTitle }>Flying Grizzly</span>
          </Navbar.Brand>
        </Navbar>
        <Container className={ layoutStyles.mainContent }>
          <MDXProvider components={ mdxComponents }>
            { children }
          </MDXProvider>
        </Container>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
