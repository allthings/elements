import PropTypes from 'prop-types'
import React from 'react'
import View from '../../atoms/View'
import { css } from 'glamor'
import { color, lightness } from 'kewler'
import Theme from '../../behaviour/Theme'

const style = backgroundColor =>
  css({
    backgroundColor,
    border: 'none',
    transition: '250ms ease-in-out',
    ':focus': {
      outline: 'none',
    },
    ':hover': {
      cursor: 'pointer',
      background: backgroundColor.includes('#')
        ? color(backgroundColor, lightness(-10))
        : backgroundColor,
    },
  })

/**
 * CardButton can to enable users to do actions directly related to content on
 * on cards. It should always go into a [CardFooter](CardFooter.md).
 */
export default function CardButton({
  children,
  onClick = noop => noop,
  backgroundColor = '#ffffff',
  ...props
}) {
  return (
    <Theme>
      {({ colorize }) => (
        <View
          alignH="center"
          flex="flex"
          alignV="center"
          direction="row"
          onClick={onClick}
          htmlElement="button"
          {...style(colorize(backgroundColor))}
          {...props}
        >
          {children}
        </View>
      )}
    </Theme>
  )
}

CardButton.propTypes = {
  children: PropTypes.node,
  /** Callback when button is clicked **/
  onClick: PropTypes.func,
  /** Color of the button **/
  backgroundColor: PropTypes.string,
}
