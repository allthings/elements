import React, { Component } from 'react'
import { IntlProvider } from 'react-intl'
import { ResourceProviderContext } from '../ResourceProvider'

export const loadLanguage = async (
  resourcePath: string,
  project: string,
  variation: string,
  locale: string,
  stage: string,
): Promise<object> => {
  const countryCode = locale.split('_')[0]
  const translations = await fetch(
    `${resourcePath}/${project}/${stage}/i18n/${countryCode}/${variation}.json`,
  )
  return translations.json()
}

interface IBasicProps {
  readonly project: string
  readonly locale: string
  readonly onDone?: () => void
  readonly messages?: object
  readonly stage: 'prerelease' | 'production' | 'staging'
  readonly variation?: string
}

const defaultProps = {
  onDone: () => {},
  stage: 'production',
  variation: 'default',
}

type IProps = IBasicProps & typeof defaultProps

interface IState {
  messages?: object
}

class CDNIntlProvider extends Component<IProps, IState> {
  static defaultProps = defaultProps

  static contextType = ResourceProviderContext

  constructor(props: IProps, context: any) {
    super(props, context)
    const messages = props.messages
    this.state = {
      messages,
    }
    if (!messages && typeof document !== 'undefined') {
      const container = document.getElementById('__ELEMENTS_INTL__')
      if (container) {
        const stateString = container.getAttribute('data-state') as string
        this.state = { messages: JSON.parse(stateString) }
      } else {
        this.loadLanguages(props)
      }
    }
  }

  componentDidUpdate(prevProps: IProps) {
    const { project, locale, variation } = this.props
    if (
      prevProps.project !== project ||
      prevProps.locale !== locale ||
      prevProps.variation !== variation
    ) {
      this.loadLanguages(this.props)
    }
  }

  loadLanguages = async (props: IProps) => {
    const { project, variation, locale, stage, onDone } = props

    const messages = await loadLanguage(
      this.context.resourcePath,
      project,
      variation,
      locale,
      stage,
    )

    this.setState({ messages }, onDone)
  }

  renderSideEffect = (messages?: object) => (
    <span
      id="__ELEMENTS_INTL__"
      style={{ display: 'none' }}
      data-state={messages && JSON.stringify(messages)}
    />
  )

  render() {
    const countryCode = this.props.locale.split('_')[0]
    const { messages } = this.state

    return (
      <IntlProvider locale={countryCode} messages={messages}>
        <>
          {this.renderSideEffect(messages)}
          {messages && this.props.children}
        </>
      </IntlProvider>
    )
  }
}

export default CDNIntlProvider
