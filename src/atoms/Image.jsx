import PropTypes from 'prop-types'
import React from 'react'
import View from '@allthings/react-view'
import { css } from 'glamor'

/**
 * Images make thing more interesting. They can be used
 * to display user image content and UI graphics.
 * If something goes wrong when loading the image, a placeholder will
 * be shown instead.
 */
export default class Image extends React.Component {
  static propTypes = {
    /** Alternative image to use */
    alt: PropTypes.string,
    /** Will be called when the image is clicked */
    onClick: PropTypes.func,
    /** The URL of the image */
    src: PropTypes.string.isRequired,
    /** The URL of the fallback image */
    srcFallback: PropTypes.string,
    /** The Position behavior of image. If passed, image will be rendered as background image. */
    size: PropTypes.oneOf(['contain', 'cover']),
  }

  state = {
    useFallback: false,
  }

  static contextTypes = {
    resourcePath: PropTypes.string,
  }

  componentDidMount() {
    this.loadImage(this.props.src)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ useFallback: false })
    if (nextProps.src !== this.props.src) {
      this.loadImage(nextProps.src)
    }
  }

  loadImage = src => {
    const image = new Image()
    image.onerror = this.onError
    image.src = src
  }

  getFallbackUrl = () => {
    const baseUrl = typeof this.context.resourcePath === 'undefined'
        ? 'https://static.allthings.me/app/prod/'
        : this.context.resourcePath

    return `${baseUrl}/static/img/default/image.svg`
  }

  onError = () => this.props.srcFallback && this.setState({ useFallback: true })

  render() {
    const { srcFallback, src, size, ...props } = this.props

    const imageUrl = this.state.useFallback ? srcFallback || this.getFallbackUrl() : src

    return (
      <View
        {...css({
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: size,
        })}
        {...props}
      />
    )
  }
}
