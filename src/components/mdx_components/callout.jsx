import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from 'styles/callout.module.css'

function Heading(props) {
  return <h1 className={ styles.heading }>{ props.content }</h1>
}

export default class Callout extends Component {
  render() {
    return (
      <section className={ styles.element }>
        <Heading content={ this.props.heading } />
        { this.props.children }
      </section>
    )
  }
}

Callout.propTypes = {
  heading: PropTypes.string,
  children: PropTypes.node,
}

