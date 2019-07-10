import React from 'react'
import View from '../atoms/View'
import { css } from 'glamor'
import { colorCode } from '../propTypes/color'

const line = (color: string) =>
  css({
    backgroundColor: color,
    height: '1px',
    width: '100%',
  })

/**
 * Just walking the line.
 *
 * ```example
 * <Line color="primary" />
 * ```
 */
const Line = ({
  color,
}: {
  /** Color of the Line */
  color: string
}) => (
  <View
    {...line(colorCode(color))}
    alignV="center"
    alignH="center"
    direction="column"
  />
)

export default Line
