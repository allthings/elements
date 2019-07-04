import React, { FunctionComponent, ChangeEvent } from 'react'
import View, { IViewProps } from '../atoms/View'
import { css } from 'glamor'

const styles = {
  container: css({
    maxWidth: 250,
    '> *': {
      margin: '10px 0',
    },
  }),
  editor: css({
    boxShadow: '0 0 14px 0 rgba(0,0,0,0.05)',
    alignSelf: 'center',
    borderRadius: '50%',
    overflow: 'hidden',
    height: 224,
    width: 224,
    margin: '21px 0',
  }),
  slider: css({
    WebkitAppearance: 'none',
    width: '100%',
    margin: '7px 0',
    ':focus': {
      outline: 'none',
    },
    '::-webkit-slider-runnable-track': {
      width: '100%',
      height: 2,
      cursor: 'pointer',
      background: '#4a5256',
      borderRadius: 4,
      border: '0px solid #010101',
    },
    '::-webkit-slider-thumb': {
      border: '0px solid #000000',
      height: 16,
      width: 16,
      borderRadius: '50%',
      background: '#4a5256',
      cursor: 'pointer',
      WebkitAppearance: 'none',
      marginTop: '-7px',
    },
    ':focus::-webkit-slider-runnable-track': {
      background: '#646f74',
    },
    '::-moz-range-track': {
      width: '100%',
      height: 2,
      cursor: 'pointer',
      background: '#4a5256',
      borderRadius: 4,
      border: '0px solid #010101',
    },
    '::-moz-range-thumb': {
      border: '0px solid #000000',
      height: 16,
      width: 16,
      borderRadius: '50%',
      background: '#4a5256',
      cursor: 'pointer',
    },
    '::-ms-track': {
      width: '100%',
      height: 2,
      cursor: 'pointer',
      background: 'transparent',
      borderColor: 'transparent',
      color: 'transparent',
    },
    '::-ms-fill-lower': {
      background: '#303538',
      border: '0px solid #010101',
      borderRadius: 4,
    },
    '::-ms-fill-upper': {
      background: '#4a5256',
      border: '0px solid #010101',
      borderRadius: 4,
    },
    '::-ms-thumb': {
      border: '0px solid #000000',
      height: 2,
      width: 16,
      borderRadius: '50%',
      background: '#4a5256',
      cursor: 'pointer',
    },
    ':focus::-ms-fill-lower': {
      background: '#4a5256',
    },
    ':focus::-ms-fill-upper': {
      background: '#646f74',
    },
  }),
}

/**
 * Slider give the user a way to select from a limited range of numbers.
 *
 * ```example
 * <Slider
 *   min={20}
 *   max={200}
 *   step={10}
 * />
 * ```
 */

interface ISliderProps extends IViewProps {
  /** Minimum selectable value **/
  min: number
  /** Maximum selectable value **/
  max: number
  /** Step interval **/
  step?: number
  /** Current value to show **/
  value?: number
  /** Callback when the users changes the value **/
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Slider: FunctionComponent<ISliderProps> = ({
  min,
  max,
  step = 0.1,
  value,
  onChange,
  ...props
}) => (
  <View {...props}>
    <input
      max={max}
      min={min}
      onChange={onChange}
      step={step}
      type="range"
      value={value}
      {...styles.slider}
    />
  </View>
)

export default Slider
