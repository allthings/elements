import React from 'react'
import Absolute from '../atoms/Absolute'
import { withTheme } from '../behaviour/ThemeProvider'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import View from '../atoms/View'

class FloatingButton extends React.Component {
  static propTypes = {
    color: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    disabledColor: PropTypes.string.isRequired,
  }

  render() {
    const { color, disabled, disabledColor, ...props } = this.props
    return (
      <View>
        <View style={{ height: 50 }} />
        <Absolute
          alignH="center"
          alignV="center"
          bottom={0}
          direction="row"
          flex="flex"
          {...css({
            backgroundColor: disabled ? disabledColor : color,
            boxShadow: '0px -2px 10px 0px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            height: 50,
            overflow: 'hidden',
            width: '100%',
          })}
          {...props}
        />
      </View>
    )
  }
}

const mapThemeToProps = theme => ({
  color: theme.primary,
  disabledColor: 'lightGray',
})

export default withTheme(mapThemeToProps)(FloatingButton)
