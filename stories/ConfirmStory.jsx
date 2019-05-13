import React from 'react'
import { Button, confirm, ThemeProvider, View } from '../src'
import { css } from 'glamor'

export default class FormStory extends React.Component {
  state = {
    backgroundColor: 'white',
  }

  handleClick = async () => {
    const backgroundColor =
      this.state.backgroundColor === 'white' ? 'black' : 'white'

    const response = await confirm({
      message: `Turn the background ${backgroundColor}?`,
      acceptButtonLabel: 'Okidoki',
      cancelButtonLabel: 'Nope',
    })
    if (response) {
      this.setState({ backgroundColor })
    }
  }

  render() {
    return (
      <View
        fill
        direction="column"
        alignH="center"
        alignV="center"
        {...css({ backgroundColor: this.state.backgroundColor })}
      >
        <ThemeProvider>
          <Button onClick={this.handleClick}>Show a confirm dialog</Button>
        </ThemeProvider>
      </View>
    )
  }
}
