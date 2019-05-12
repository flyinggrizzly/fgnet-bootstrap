import React from 'react'
import { Table as BSTable } from 'react-bootstrap'
import _ from 'lodash'

const Table = (props) => (
  <BSTable striped bordered hover size="sm" { ...props } />
)

const CollapsingTH = (props) => {
  if (_.isEmpty(props.children))
    return null

  return (
    <th { ...props } />
  )
}

Table.CollapsingTH = CollapsingTH

export default Table
