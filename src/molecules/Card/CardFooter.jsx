import PropTypes from 'prop-types'
import React from 'react'
import { css } from 'glamor'
import { View } from '@allthings/react-view'

const style = css({
  borderTop: '1px solid #e7ecee',
  '> *': {
    padding: '10px 13px',
    textAlign: 'center',
  },
  '> :not(:last-child)': {
    borderRight: '1px solid #e7ecee',
  },
})

export default function CardFooter({ children }) {
  return (
    <View direction="row" alignV="center" alignH="space-around" {...style}>
      {children}
    </View>
  )
}

CardFooter.propTypes = {
  children: PropTypes.node,
}
