import React, { Component, ChangeEvent, PropsWithChildren } from 'react'
import { css } from 'glamor'
import Absolute from '../atoms/Absolute'
import Circle from '../atoms/Circle'
import Relative from '../atoms/Relative'
import Text from '../atoms/Text'
import View from '../atoms/View'
import Theme from '../behaviour/Theme'

const styles = {
  radioElement: css({
    marginRight: 40,
    width: 'auto',
  }),
  radio: css({
    opacity: 0,
    margin: 0,
  }),
  required: css({
    position: 'absolute',
    right: 10,
  }),
}

export interface IRadioButtonProps {
  /** Background color of the form item */
  backgroundColor?: string
  id?: string
  /** Set to true to controll radio button */
  checked?: boolean
  /** The name of this input field */
  name?: string
  /** Called when a radio button is clicked */
  onChange?: (e: ChangeEvent) => void
  /** Mark if the RadioButton is required */
  required?: boolean
  /** The value the checkbox will have */
  value: string
}

interface IState {
  checked: boolean
}

/**
 * RadioButtonSet can be used to render a set of RadioButtons to allow users to select exactly one item from a set.
 * Like gender (male / female) or sizes (s,m,l,xl)
 *
 * ```example
 * <RadioButtonSet name="gender" defaultValue="male" required>
 *   <RadioButton value="female">Female</RadioButton>
 *   <RadioButton value="male">Male</RadioButton>
 * </RadioButtonSet>
 * ```
 */
class RadioButton extends Component<
  PropsWithChildren<IRadioButtonProps>,
  IState
> {
  static defaultProps = {
    required: false,
  }

  state = {
    // set initial value to boolean, to avoid the warning:
    // `A component is changing an uncontrolled input of type radio to be controlled.`
    checked: !!this.props.checked,
  }

  static getDerivedStateFromProps(props: IRadioButtonProps) {
    if (props.checked === true) {
      return {
        checked: true,
      }
    } else if (props.checked === false) {
      return {
        checked: false,
      }
    } else {
      return null
    }
  }

  handleChange = (e: ChangeEvent) => {
    this.props.onChange && this.props.onChange(e)
    this.setState(({ checked }) => ({ checked: !checked }))
  }

  render() {
    const {
      backgroundColor,
      checked,
      children,
      id,
      name,
      onChange,
      value,
      ...props
    } = this.props

    const realId = id || value

    return (
      <Theme>
        {({ theme }) => (
          <View {...styles.radioElement} {...props}>
            <Relative direction="row" alignV="center" alignH="center">
              <View htmlElement="label">
                <Relative top={10}>
                  <Circle
                    color={`${
                      this.state.checked ? theme.primary : 'lightGrey'
                    }`}
                    radius={20}
                  >
                    <Circle color="white" radius={16}>
                      <Circle
                        color={`${
                          this.state.checked ? theme.primary : 'white'
                        }`}
                        radius={10}
                      />
                    </Circle>
                  </Circle>
                </Relative>
                <Relative
                  top={-8}
                  style={{
                    marginLeft: 30,
                  }}
                >
                  {typeof children === 'string' ? (
                    <Text size="m">{children}</Text>
                  ) : (
                    children
                  )}
                </Relative>
                <Absolute top={0} left={0} right={0} bottom={0}>
                  <input
                    id={realId}
                    type="radio"
                    name={name}
                    {...styles.radio}
                    value={value}
                    checked={this.state.checked}
                    onChange={this.handleChange}
                  />
                </Absolute>
              </View>
            </Relative>
          </View>
        )}
      </Theme>
    )
  }
}

export default RadioButton
