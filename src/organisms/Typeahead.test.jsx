import React from 'react'
import Typeahead from './Typeahead'

// TODO: we should having to test within those instances but Enzyme unmount()
// method is buggy!
// See https://github.com/airbnb/enzyme/issues/941

const DEFAULT_VALUE = 'Abomasnow'

const CLEAR_SELECTION = 'div[onClick]'

const INPUT = instance => `input#downshift-${instance}-input`

const INPUT_HINT = 'input[name="hint"]'

const ITEMS = [
  { value: 1, label: DEFAULT_VALUE },
  { value: 2, label: 'Abra' },
  { value: 3, label: 'Absol' },
  { value: 4, label: 'Accelgor' },
  { value: 5, label: 'Aegislash' },
  { value: 6, label: 'Aerodactyl' },
  { value: 7, label: 'Aggron' },
  { value: 8, label: 'Aipom' },
  { value: 9, label: 'Alakazam' },
  { value: 10, label: 'Alomomola' },
]

const NICK = 'nick'

const PLACEHOLDER = "Select Nick's Pokemon"

const DOWNSHIFT_ITEM = (instance, index) =>
  `div#downshift-${instance}-item-${index}`

describe('Test the typeahead component', () => {
  it('should be a simple static one - in depth testing of the core behavior', () => {
    const wrapper = mount(<Typeahead items={ITEMS} placeholder={PLACEHOLDER} />)
    const clickAndPress = (value, last) => {
      // Simulate press `a`.
      // See https://github.com/airbnb/enzyme/issues/76.
      wrapper.find(INPUT(0)).simulate('change', { target: { value } })
      // Check the input value.
      expect(wrapper.find(INPUT(0)).prop('value')).toBe(value)
      // We should have a pokemon for this last index or not at all.
      expect(wrapper.find(DOWNSHIFT_ITEM(0, last || 0))).toHaveLength(
        typeof last === 'undefined' ? 0 : 1
      )
      // Check for no next item.
      if (last) {
        expect(wrapper.find(DOWNSHIFT_ITEM(0, last + 1))).toHaveLength(0)
      }
    }
    expect(wrapper).toMatchSnapshot()
    // Perform a click on the input.
    wrapper.find(INPUT(0)).simulate('click')
    // No menu should be there!
    expect(wrapper.find(DOWNSHIFT_ITEM(0, 0))).toHaveLength(0)
    // 1st case scenario: select by clicking the item.
    clickAndPress('a', 9)
    wrapper.find(DOWNSHIFT_ITEM(0, 0)).simulate('click')
    expect(wrapper.find(DOWNSHIFT_ITEM(0, 0))).toHaveLength(0)
    expect(wrapper.find(INPUT(0)).prop('value')).toBe(ITEMS[0].label)
    // 2nd case scenario: select with ENTER key.
    clickAndPress('a', 9)
    wrapper.find(INPUT(0)).simulate('keyDown', { key: 'Enter' })
    expect(wrapper.find(DOWNSHIFT_ITEM(0, 0))).toHaveLength(0)
    expect(wrapper.find(INPUT(0)).prop('value')).toBe(ITEMS[0].label)
    // 3nd case scenario: select with TAB key.
    clickAndPress('a', 9)
    wrapper.find(INPUT(0)).simulate('keyDown', { key: 'Tab' })
    expect(wrapper.find(DOWNSHIFT_ITEM(0, 0))).toHaveLength(0)
    expect(wrapper.find(INPUT(0)).prop('value')).toBe(ITEMS[0].label)
    // Now a bit of autocompletion - no results.
    clickAndPress('nick')
    // We should only get 3 matches for the following sequence.
    clickAndPress('ala', 2)
    // We should still get one for this one.
    clickAndPress('z', 0)
    // We should get nothing with a space.
    clickAndPress(' ')
    // Should also match reversing letters.
    clickAndPress('az', 0)
    clickAndPress('za', 0)
    // Of course clicking Enter should pick that one, even if the input value
    // and the actual item value don't match!
    wrapper.find(INPUT(0)).simulate('keyDown', { key: 'Enter' })
    expect(wrapper.find(DOWNSHIFT_ITEM(0, 0))).toHaveLength(0)
    expect(wrapper.find(INPUT(0)).prop('value')).toBe(ITEMS[8].label)
    // We should be able to clear it.
    expect(wrapper.find(CLEAR_SELECTION)).toHaveLength(1)
    wrapper.find(CLEAR_SELECTION).simulate('click')
    expect(wrapper.find(INPUT(0)).prop('value')).toBe('')
    // The menu should be opened back for selection.
    expect(wrapper.find(DOWNSHIFT_ITEM(0, 0))).toHaveLength(1)
  })
  it('should be a simple static one which auto open on click', () => {
    const wrapper = mount(
      <Typeahead autoOpen items={ITEMS} placeholder={PLACEHOLDER} />
    )
    // Perform a click on the input.
    wrapper.find(INPUT(1)).simulate('click')
    // A menu should be there!
    expect(wrapper.find(DOWNSHIFT_ITEM(1, 0))).toHaveLength(1)
    expect(wrapper).toMatchSnapshot()
  })
  it('should use the limit property', () => {
    const wrapper = mount(
      <Typeahead autoOpen items={ITEMS} limit={2} placeholder={PLACEHOLDER} />
    )
    // Perform a click on the input.
    wrapper.find(INPUT(2)).simulate('click')
    // We should only get 2 items.
    expect(wrapper.find(DOWNSHIFT_ITEM(2, 0))).toHaveLength(1)
    expect(wrapper.find(DOWNSHIFT_ITEM(2, 1))).toHaveLength(1)
    expect(wrapper.find(DOWNSHIFT_ITEM(2, 2))).toHaveLength(0)
    expect(wrapper).toMatchSnapshot()
  })
  it('should clear on select if clearOnSelect is used', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        clearOnSelect
        items={ITEMS}
        placeholder={PLACEHOLDER}
      />
    )
    // Perform a click on the input.
    wrapper.find(INPUT(3)).simulate('click')
    // Select the first item.
    wrapper.find(INPUT(3)).simulate('keyDown', { key: 'Enter' })
    expect(wrapper.find(INPUT(3)).prop('value')).toBe('')
  })
  it('should use the defaultValue property (uncontrolled component)', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        defaultValue={DEFAULT_VALUE}
        items={ITEMS}
        placeholder={PLACEHOLDER}
      />
    )
    expect(wrapper.find(INPUT(4)).prop('value')).toBe(DEFAULT_VALUE)
  })
  it('should use the value property (controlled component)', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        items={ITEMS}
        placeholder={PLACEHOLDER}
        value={DEFAULT_VALUE}
      />
    )
    expect(wrapper.find(INPUT(5)).prop('value')).toBe(DEFAULT_VALUE)
    // Without controlling the value from the outside, we can't change it!
    wrapper.find(INPUT(5)).simulate('change', { target: { value: NICK } })
    expect(wrapper.find(INPUT(5)).prop('value')).toBe(DEFAULT_VALUE)
    // Control it now.
    wrapper.setProps({ value: NICK })
    expect(wrapper.find(INPUT(5)).prop('value')).toBe(NICK)
  })
  it('should render differently when loading', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        isLoading={false}
        items={ITEMS}
        placeholder={PLACEHOLDER}
      />
    )
    expect(wrapper).toMatchSnapshot()
    // Load!
    wrapper.setProps({ isLoading: true })
    expect(wrapper).toMatchSnapshot()
  })
  it('should handle the callback props - onClearSelection', () => {
    const handleOnClearSelection = jest.fn()
    const wrapper = mount(
      <Typeahead
        autoOpen
        items={ITEMS}
        onClearSelection={handleOnClearSelection}
        placeholder={PLACEHOLDER}
      />
    )
    expect(handleOnClearSelection.mock.calls.length).toBe(0)
    // Open the menu.
    wrapper.find(INPUT(7)).simulate('click')
    // Select the first item.
    wrapper.find(INPUT(7)).simulate('keyDown', { key: 'Enter' })
    // Check for the clear selection button.
    expect(wrapper.find(CLEAR_SELECTION)).toHaveLength(1)
    wrapper.find(CLEAR_SELECTION).simulate('click')
    expect(wrapper.find(INPUT(7)).prop('value')).toBe('')
    expect(handleOnClearSelection.mock.calls.length).toBe(1)
  })
  it('should handle the callback props - onOpen', () => {
    const handleOnOpen = jest.fn()
    const wrapper = mount(
      <Typeahead
        autoOpen
        items={ITEMS}
        onOpen={handleOnOpen}
        placeholder={PLACEHOLDER}
      />
    )
    expect(handleOnOpen.mock.calls.length).toBe(0)
    // Open the menu.
    wrapper.find(INPUT(8)).simulate('click')
    expect(handleOnOpen.mock.calls.length).toBe(1)
  })
  it('should handle the callback props - onClose', () => {
    const handleOnClose = jest.fn()
    const wrapper = mount(
      <Typeahead
        autoOpen
        items={ITEMS}
        onClose={handleOnClose}
        placeholder={PLACEHOLDER}
      />
    )
    expect(handleOnClose.mock.calls.length).toBe(0)
    // Open the menu.
    wrapper.find(INPUT(9)).simulate('click')
    // Select the first item.
    wrapper.find(INPUT(9)).simulate('keyDown', { key: 'Enter' })
    expect(handleOnClose.mock.calls.length).toBe(1)
  })
  it('should handle the callback props - onInputValueChange', () => {
    const handleOnInputValueChange = jest.fn()
    const wrapper = mount(
      <Typeahead
        autoOpen
        items={ITEMS}
        onInputValueChange={handleOnInputValueChange}
        placeholder={PLACEHOLDER}
      />
    )
    expect(handleOnInputValueChange.mock.calls.length).toBe(0)
    // Enter something.
    wrapper.find(INPUT(10)).simulate('change', { target: { value: NICK } })
    expect(handleOnInputValueChange.mock.calls.length).toBe(1)
  })
  it('should handle the callback props - onSelect', () => {
    const handleOnSelect = jest.fn()
    const wrapper = mount(
      <Typeahead
        autoOpen
        items={ITEMS}
        onSelect={handleOnSelect}
        placeholder={PLACEHOLDER}
      />
    )
    expect(handleOnSelect.mock.calls.length).toBe(0)
    // Open the menu.
    wrapper.find(INPUT(11)).simulate('click')
    // Select the first item.
    wrapper.find(INPUT(11)).simulate('keyDown', { key: 'Enter' })
    expect(handleOnSelect.mock.calls.length).toBe(1)
  })
  it('should handle warn the user if the clearOnSelect property is used on a controlled or uncontrolled component', () => {
    const hasWarned = jest
      .spyOn(console, 'warn')
      .mockImplementationOnce(() => true)
    expect(hasWarned.mock.calls.length).toBe(0)
    shallow(
      <Typeahead
        autoOpen
        items={ITEMS}
        clearOnSelect
        defaultValue={NICK}
        placeholder={PLACEHOLDER}
      />
    )
    expect(hasWarned.mock.calls.length).toBe(1)
    shallow(
        <Typeahead
          autoOpen
          clearOnSelect
          items={ITEMS}
          placeholder={PLACEHOLDER}
          value={NICK}
        />
      )
      expect(hasWarned.mock.calls.length).toBe(2)
  })
  it('should use autocomplete="off" for both inputs', () => {
    const wrapper = mount(
      <Typeahead
        items={ITEMS}
        placeholder={PLACEHOLDER}
      />
    )
    expect(wrapper.find(INPUT(12)).prop('autoComplete')).toBe('off')
    expect(wrapper.find(INPUT_HINT).prop('autoComplete')).toBe('off')
  })
})
