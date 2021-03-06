import React from 'react'
import { preToCodeBlock } from 'mdx-utils'

import AutolinkHeading from './autolink_heading'
import Code from './code'
import Table from './table'

import Callout from './callout'
import ImageCaption from './image_caption'

const mdxComponents = {
  // Markdown syntax overrides
  h1: props => <AutolinkHeading size="h1" { ...props } />,
  h2: props => <AutolinkHeading size="h2" { ...props } />,
  h3: props => <AutolinkHeading size="h3" { ...props } />,
  h4: props => <AutolinkHeading size="h4" { ...props } />,
  h5: props => <AutolinkHeading size="h5" { ...props } />,
  h6: props => <AutolinkHeading size="h6" { ...props } />,
  table: props => <Table { ...props } />,
  th: props => <Table.CollapsingTH { ...props } />,
  pre: preProps => {
    const props = preToCodeBlock(preProps)
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <Code {...props} />
    } else {
      // it's possible to have a pre without a code in it
      return <pre {...preProps} />
    }
  },

  // Post short-code components
  Callout: props => <Callout { ...props } />,
  ImageCaption: props => <ImageCaption { ...props } />,
}
export default mdxComponents
