import React from 'react'
import { Link } from 'gatsby'
import { Button } from 'react-bootstrap'

import { FaPlay } from 'react-icons/fa'
import styles from 'styles/cta.module.css'

const CTA = ({ target, children }) => {
  return (
    <div className={ styles.cta }>
      <Link to={ target }>
        <Button variant="outline-primary" className={ styles.ctaButton }>
          <FaPlay style={{ height: '.7em', marginTop: '-1px' }}/>
          &nbsp;
          { children }
        </Button>
      </Link>
    </div>
  )
}

export default CTA
