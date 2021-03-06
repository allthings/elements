import { css } from 'glamor'
import React from 'react'
import { useTheme } from '../Theme'
import View, { IViewProps } from '../View'

const circle = (
  backgroundColor: string,
  outline: boolean,
  outlineColor: string,
  fill: boolean,
  radius: number,
) =>
  css({
    border: outline && `1px solid ${outlineColor || backgroundColor}`,
    backgroundColor: fill && backgroundColor,
    borderRadius: '50%',
    height: radius,
    width: radius,
    transition: 'background-color 120ms linear',
  })

export interface ICircleProps extends IViewProps {
  /** Color of the Circle. Allows theme names (like 'primary') or hex colors  */
  readonly color?: string
  /** Radius of Circle, defaults to 40 */
  readonly radius?: number
  /** If true it will only render the outline */
  readonly outline?: boolean
  /** If passed outline will use as outline color instead of color */
  readonly outlineColor?: string
  /** If true it will fill the circle */
  readonly fill?: boolean
}

/**
 * Simple circle element that is used to build other things...
 *
 * Check out ProfileImage to see it in action.
 *
 * ```example
 * <ThemeProvider>
 *   <ResourceProvider>
 *     <View direction="row" alignV="center">
 *       <Circle outline fill={false} outlineColor="lightGrey">
 *         <Icon size="s" name="remove-filled" color="lightGrey" />
 *       </Circle>
 *       <Circle color="primary" />
 *       <Circle color="#bada55" radius={20} />
 *       <Circle color="gray" radius={10} />
 *     </View>
 *   </ResourceProvider>
 * </ThemeProvider>
 * ```
 **/
const Circle = ({
  fill = true,
  color = 'primary',
  outline = false,
  outlineColor = 'primary',
  radius = 40,
  children,
  ...props
}: ICircleProps) => {
  const { colorize } = useTheme()

  return (
    <View
      {...circle(
        colorize(color),
        outline,
        colorize(outlineColor),
        fill,
        radius,
      )}
      alignV="center"
      alignH="center"
      direction="column"
      {...props}
    >
      {children}
    </View>
  )
}

export default Circle
