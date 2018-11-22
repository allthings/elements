import React from 'react'
import ReactDOM from 'react-dom'
import ConfirmDialog from '../molecules/ConfirmDialog'
import ThemeProvider from './ThemeProvider'

const confirm = customization =>
  new Promise(resolve => {
    const {
      acceptButtonLabel,
      appendDialogTo,
      cancelButtonLabel,
      message,
    } = customization
    const div = document.createElement('div')
    const nodeToAppendTo = appendDialogTo || document.body
    nodeToAppendTo.appendChild(div)

    const resolveAndClean = response => {
      ReactDOM.unmountComponentAtNode(div)
      nodeToAppendTo.removeChild(div)
      resolve(response)
    }

    ReactDOM.render(
      <ThemeProvider>
        <ConfirmDialog
          acceptButtonLabel={acceptButtonLabel}
          cancelButtonLabel={cancelButtonLabel}
          message={message}
          onCancel={() => resolveAndClean(false)}
          onSuccess={() => resolveAndClean(true)}
          resolveAndClean={resolveAndClean}
        />
      </ThemeProvider>,
      div
    )
  })

export default confirm