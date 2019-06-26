import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import Input from '../atoms/Input'
import Calendar from '../molecules/Calendar'
import Relative from '../atoms/Relative'
import Absolute from '../atoms/Absolute'
import Icon from '../atoms/Icon'

/**
 * `DateInput` shows a calendar on click and provides to select a single day.
 */
class DateInput extends React.Component {
  static propTypes = {
    /** Name of the input for a form **/
    name: PropTypes.string.isRequired,
    /** The label of the input */
    label: PropTypes.string,
    /** The locale decides on how to render date strings. Falls back to user locale if no value is provided **/
    locale: PropTypes.string,
    /** Called when a day is selected **/
    onChange: PropTypes.func,
    /** If a date should not be a changeable **/
    readOnly: PropTypes.bool,
    /** Set the default value which is shown on the first render **/
    defaultValue: PropTypes.instanceOf(Date),
    /** The placeholder for the input field */
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    onChange: () => {},
    defaultValue: undefined,
    readOnly: false,
    placeholder: '',
  }

  state = {
    date: this.props.defaultValue,
    showCalendar: false,
  }

  handleChange = date => {
    this.setState({ date, showCalendar: false })
    this.props.onChange(date)
  }

  handleClear = () => {
    this.setState({ date: undefined })
    this.props.onChange('')
  }

  render() {
    const {
      locale,
      label,
      name,
      onChange,
      readOnly,
      placeholder,
      ...props
    } = this.props
    const { date, showCalendar } = this.state

    const stringValue = date
      ? date.toLocaleDateString(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : ''

    return (
      <Relative direction="column">
        <Input
          name={name}
          placeholder={placeholder}
          value={stringValue}
          label={label}
          icon="calendar-check"
          readOnly
          {...css({ cursor: !readOnly && 'pointer' })}
          onClick={() =>
            !readOnly &&
            this.setState(prevState => ({
              showCalendar: !prevState.showCalendar,
            }))
          }
        />
        {showCalendar && (
          <Calendar
            locale={locale}
            onChange={this.handleChange}
            value={date}
            {...props}
          />
        )}
        {date && !showCalendar && !readOnly && (
          <Absolute
            right={0}
            top={0}
            bottom={0}
            direction="row"
            alignV="center"
            {...css({ padding: 20, cursor: 'pointer' })}
          >
            <Icon
              name="remove-light"
              color="black"
              size={10}
              onClick={this.handleClear}
              {...css({ marginTop: -6 })}
            />
          </Absolute>
        )}
      </Relative>
    )
  }
}

export default DateInput