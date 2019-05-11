import React, { Component } from "react"
import { Navbar, Nav } from 'react-bootstrap'

import { FaRss as RssIcon } from 'react-icons/fa'

import layoutStyles from 'styles/layout.module.css'

export default class HeaderNav extends Component {
  constructor(props) {
    super(props)

    this.state = { pageY: -1, fixed: undefined }

    this.notifyScroll = this.notifyScroll.bind(this)
  }

  render() {
    return (
      <Navbar expand="md" variant="dark" bg="dark"
        sticky={ this.state.fixed }
        className={ layoutStyles.nav }
      >
        <Navbar.Brand href="/">
          <img src="/flying-grizzly.png" alt="a flying grizzly bear"
            className="d-inline-block align-bottom"
            height="40"
          />
          <span className={ layoutStyles.navTitle }>Flying Grizzly</span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ml-auto">
            <Nav.Link href="/feed.xml"><RssIcon /></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  componentDidMount() {
    window.addEventListener('scroll', this.notifyScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.notifyScroll)
  }

  notifyScroll(e) {
    let { pageY } = e
    let previousPageY = this.state.pageY

    this.setState({ pageY })

    if (pageY < previousPageY)
      this.setState({ fixed: 'top' })
    else if (pageY > previousPageY)
      this.setState({ fixed: undefined })
  }
}
