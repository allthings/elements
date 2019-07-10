import { addParameters, configure } from '@storybook/react'

addParameters({
  options: {
    panelPosition: 'right',
  },
})

function loadStories() {
  require('../stories/index')
}

configure(loadStories, module)
