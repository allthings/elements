import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { css } from 'glamor'

/**
 * Appends 'flex-' to 'start' and 'end'
 * @param {String} alignment
 * @return {String}
 */
function getCssAlignValue(alignment) {
  if (alignment === 'start' || alignment === 'end') {
    return `flex-${alignment}`
  }
  return alignment
}

/**
 *
 * @param {String|Number} flex
 * @returns {Object}
 */
function getCssFlexValue(flex) {
  if (typeof flex === 'number') {
    if (flex === 33) flex = 100 / 3
    if (flex === 66) flex = 200 / 3
    return `1 1 ${flex}%`
  }

  /**
   * CSS value of flex: flex-grow flex-shrink flex-basis
   */
  switch (flex) {
    case 'none':
      return '0 0 auto'
    case 'flex':
      return '1'
    case 'nogrow':
      return '0 1 auto'
    case 'grow':
      return '1 1 100%'
    case 'initial':
      return '0 1 auto'
    case 'auto':
      return '1 1 auto'
    case 'noshrink':
      return '1 0 auto'
  }
}

/**
 * This Component is rebuild of angular-material's flexbox directives.
 *
 * Different to angular's directive implementation, which can be used independent of each other,
 * this component combines layout and element attributes within one component.
 *
 * For explanation see:
 * - https://material.angularjs.org/latest/layout/alignment
 * - https://material.angularjs.org/latest/layout/children
 *
 * ```example
 * <ThemeProvider>
 *   <View fill direction="row" alignH="end">
 *     <Text>Say Hello!</Text>
 *   </View>
 * </ThemeProvider>
 * ```
 */
class View extends Component {
  static defaultProps = {
    alignH: 'start',
    alignV: 'stretch',
    htmlElement: 'div',
    fill: false,
    flex: 'none',
    onRef: _ => _,
  }

  static propTypes = {
    children: PropTypes.node,
    htmlElement: PropTypes.string,

    /** horizontal alignment */
    alignH: PropTypes.oneOf([
      'none',
      'start',
      'center',
      'end',
      'space-around',
      'space-between',
    ]),

    /** vertical alignment */
    alignV: PropTypes.oneOf(['none', 'start', 'center', 'end', 'stretch']),

    /** direction */
    direction: PropTypes.oneOf([
      'row',
      'column',
      'row-reverse',
      'column-reverse',
    ]),

    /** Passing true, will make the view fill out available space */
    fill: PropTypes.bool,

    /** Defining how children will wrap */
    wrap: PropTypes.oneOf([
      'inherit',
      'initial',
      'wrap',
      'nowrap',
      'wrap-reverse',
    ]),

    /** Flex values, can be 5, 10, 15 ... 100 or 33, 66 */
    flex: PropTypes.oneOf([
      'none',
      'flex',
      'nogrow',
      'grow',
      'initial',
      'auto',
      'noshrink',
      5,
      10,
      15,
      20,
      25,
      30,
      35,
      40,
      45,
      50,
      55,
      60,
      65,
      70,
      75,
      80,
      95,
      90,
      100,
      33,
      66,
    ]),

    onClick: PropTypes.func,

    /** @deprecated */
    onRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  }

  render() {
    const {
      alignH,
      alignV,
      children,
      htmlElement,
      direction,
      fill,
      flex,
      onRef,
      wrap,
      ...restProps
    } = this.props

    const styles = {
      ...((direction || flex) && { boxSizing: 'border-box' }),
      ...(direction && {
        alignContent: getCssAlignValue(alignV),
        alignItems: getCssAlignValue(alignV),
        display: 'flex',
        flexDirection: direction,
        justifyContent: getCssAlignValue(alignH),
        ...(wrap && { flexWrap: wrap }),
        ...(fill && {
          height: '100%',
          margin: 0,
          minHeight: '100%',
          width: '100%',
        }),
        ...(restProps.onClick && {
          cursor: 'pointer',
        }),
      }),
      flex,
    }

    if (flex) {
      styles.flex = getCssFlexValue(flex)
    }

    return React.createElement(
      htmlElement,
      {
        ref: onRef,
        ...css(styles),
        ...restProps,
      },
      children
    )
  }
}

export default View
