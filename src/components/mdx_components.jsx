import React, { Component } from 'react'
import UniqueSlugContext from 'contexts/unique_slug_context'
import { preToCodeBlock } from 'mdx-utils'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

import { GoLink as LinkIcon } from 'react-icons/go'
import styles from 'styles/mdx_components.module.css'

import ImageCaption from 'components/image_caption'

const mdxComponents = {
  // Markdown syntax overrides
  h1: props => <AutolinkHeading size="h1" { ...props } />,
  h2: props => <AutolinkHeading size="h2" { ...props } />,
  h3: props => <AutolinkHeading size="h3" { ...props } />,
  h4: props => <AutolinkHeading size="h4" { ...props } />,
  h5: props => <AutolinkHeading size="h5" { ...props } />,
  h6: props => <AutolinkHeading size="h6" { ...props } />,
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
  ImageCaption: props => <ImageCaption { ...props } />,
}
export default mdxComponents

export class AutolinkHeading extends Component {
  render() {
    let { size: H, children, ...props } = this.props
    let slugGenerator = this.context
    let slug = slugGenerator.slug(children)

    return (
      <H { ...props }>
        <a id={ slug } href={ `#${slug}` } className={ styles.headingAutolinkIcon }>
          <LinkIcon />
        </a>
        { children }
      </H>
    )
  }
}
AutolinkHeading.contextType = UniqueSlugContext

export const Code = ({ codeString, language, ...props }) => {
  if (props['react-live']) {
    return (
      <LiveProvider code={codeString} noInline={true}>
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
    )
  } else {
    return (
      <Highlight {...defaultProps} code={codeString} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    )
  }
}

