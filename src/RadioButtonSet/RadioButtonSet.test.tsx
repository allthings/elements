import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import renderer from 'react-test-renderer'
import RadioButton from '../RadioButton'
import ThemeProvider from '../ThemeProvider'
import RadioButtonSet from './RadioButtonSet'

describe('<RadioButtonSet />', () => {
  it('should render without error', () => {
    const tree = renderer
      .create(
        <ThemeProvider>
          <RadioButtonSet name="colors">
            <RadioButton value="blue">Blue</RadioButton>
            <RadioButton value="gray">Gray</RadioButton>
          </RadioButtonSet>
        </ThemeProvider>,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should chain the onChange property', () => {
    const handleChange = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider>
        <RadioButtonSet name="colors" onChange={handleChange}>
          <RadioButton value="blue">Blue</RadioButton>
          <RadioButton value="gray">Gray</RadioButton>
        </RadioButtonSet>
      </ThemeProvider>,
    )

    fireEvent.click(getByLabelText('Gray', { selector: 'input' }))
    // @todo The current implementation of RadioButtonSet triggers handleChange twice
    expect(handleChange).toHaveBeenCalled()
  })
})
