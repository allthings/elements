import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import View from '../atoms/View'
import { colorCode } from '../propTypes/color'
import { withTheme } from '../behaviour/ThemeProvider'

const box = background =>
  css({
    height: 50,
    backgroundColor: colorCode(background),
    position: 'relative',
    zIndex: 2,
  })

class TitleBar extends React.Component {
  static propTypes = {
    /** Callback when title bar is clicked */
    onClick: PropTypes.func,
    /** Color of the title bar */
    color: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    color: 'grey',
  }

  render() {
    const { children, color, ...props } = this.props
    return (
      <View direction="row" alignV="center" {...props} {...box(color)}>
        {children}
      </View>
    )
  }
}

const mapThemeToProps = theme => ({
  color: theme.primary,
})

export default withTheme(mapThemeToProps, 'TitleBar')(TitleBar)
