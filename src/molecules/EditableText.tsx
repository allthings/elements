import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import React, { KeyboardEvent } from 'react'

import Icon, { IconType } from '../atoms/Icon'
import Text from '../atoms/Text'
import View from '../atoms/View'

const DEFAULT_DECORATION_COLOR = 'grey'
const DEFAULT_ICON = 'edit'
const DEFAULT_ICON_COLOR = 'black'
const ENTER = 'Enter'

const STYLES = {
  editable: (decorationColor: string) =>
    css({
      borderBottom: `1px dashed ${ColorPalette[decorationColor]}`,
      ':focus': {
        borderBottom: `1px solid ${ColorPalette[decorationColor]}`,
      },
    }),
  icon: css({
    marginLeft: '4px',
  }),
}

const EditableText = ({
  children,
  decorationColor = DEFAULT_DECORATION_COLOR,
  icon = DEFAULT_ICON,
  iconColor = DEFAULT_ICON_COLOR,
  ...props
}: IEditableTextProps) => (
  <View alignV="center" direction="row">
    <Text
      block
      contentEditable
      // Disable multi-line editing.
      onKeyPress={(event: KeyboardEvent<HTMLElement>) =>
        event.key === ENTER && event.preventDefault()
      }
      spellCheck={false}
      // https://reactjs.org/docs/dom-elements.html#suppresscontenteditablewarning
      suppressContentEditableWarning
      {...STYLES.editable(decorationColor)}
      {...props}
    >
      {children}
    </Text>
    <View>
      <Icon
        color={ColorPalette[iconColor]}
        name={icon}
        size={12}
        {...STYLES.icon}
      />
    </View>
  </View>
)

interface IEditableTextProps {
  /** Text content passed to the component as children */
  children?: string
  /** Color of the emulated text decoration (border bottom) */
  decorationColor?: string
  /** Icon displayed on the right side of the text */
  icon?: IconType
  /** Color of the icon */
  iconColor?: string
}

export default EditableText
