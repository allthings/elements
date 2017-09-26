import PropTypes from 'prop-types'
import React from 'react'
import { css } from 'glamor'
import { View } from '@allthings/react-view'

const styles = {
  textarea: css({
    outline: 'none',
    border: 0,
    fontSize: 13,
    resize: 'none',
    flex: 1,
    maxHeight: '25vh',
    width: '100%',
    paddingLeft: 15,
  }),
}

export default class ExpandingTextarea extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    onEnter: PropTypes.func,
    onHeightChange: PropTypes.func,
    containerStyle: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.string,
    onFocus: PropTypes.func,
    onTextarea: PropTypes.func,
  }

  static defaultProps = {
    autoFocus: false,
  }

  componentDidMount() {
    this.adjustTextareaHeight()
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.autoFocus === true &&
      this.props.autoFocus === false &&
      this.textarea
    ) {
      this.textarea.focus()
      this.props.onFocus && this.props.onFocus()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.adjustTextareaHeight()
    }
  }

  setTextarea = textarea => {
    this.textarea = textarea
    this.props.onTextarea && this.props.onTextarea(textarea)
  }

  handleChange = e => {
    this.props.onChange && this.props.onChange(e)
    this.adjustTextareaHeight()
  }

  adjustTextareaHeight = () => {
    const { textarea } = this
    if (textarea) {
      const { onHeightChange } = this.props

      textarea.style.height = 0
      textarea.style.height = `${textarea.scrollHeight}px`

      if (onHeightChange) {
        const actualHeight = Math.min(
          textarea.scrollHeight,
          textarea.offsetHeight
        )
        onHeightChange(actualHeight)
      }
    }
  }

  render() {
    // eslint-disable-next-line
    const { placeholder, containerStyle, onTextarea, ...restProps } = this.props

    return (
      <View
        {...css(containerStyle)}
        alignV="center"
        flex="flex"
        direction="row"
      >
        <textarea
          {...restProps}
          cols="1"
          rows="1"
          placeholder={placeholder}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          ref={this.setTextarea}
          {...styles.textarea}
        />
      </View>
    )
  }
}
