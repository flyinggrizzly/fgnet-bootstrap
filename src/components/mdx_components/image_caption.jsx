import React, { Component } from 'react'
import PropTypes from 'prop-types'

import markdownify from 'utils/markdownify'

import styles from 'styles/image_caption.module.css'

export default class ImageCaption extends Component {
  render() {
    return (
      <div className={ styles.element }>
        { markdownify(this.props.children) }
      </div>
    )
  }
}

ImageCaption.propTypes = {
  children: PropTypes.node.isRequired,
}
