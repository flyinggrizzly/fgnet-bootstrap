import React, { Component } from 'react'
import UniqueSlugContext from 'contexts/unique_slug_context'
import { GoLink as LinkIcon } from 'react-icons/go'

import styles from 'styles/mdx_components.module.css'

export default class AutolinkHeading extends Component {
  render() {
    let { size: H, children, ...props } = this.props
    let slugGenerator = this.context
    let slug = slugGenerator.slug(children)

    return (
      <H { ...props } className={ styles.heading }>
        <a id={ slug } href={ `#${slug}` } className={ styles.headingAutolinkIcon }>
          <LinkIcon />
        </a>
        { children }
      </H>
    )
  }
}
AutolinkHeading.contextType = UniqueSlugContext

