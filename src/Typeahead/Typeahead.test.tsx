import { mount, shallow } from 'enzyme'
import React from 'react'
import Typeahead from './Typeahead'
// TODO: we should having to test within those instances but Enzyme unmount()
// method is buggy!
// See https://github.com/airbnb/enzyme/issues/941

const DEFAULT_VALUE = 'Abomasnow'

const CLEAR_SELECTION = 'div[onClick]'

const INPUT = (instance: string | number) => `input#downshift-${instance}-input`

const SELECTED_ITEM_ICON = 'strong'

const ITEMS = [
  { value: '1', label: DEFAULT_VALUE },
  { value: '2', label: 'Abra' },
  { value: '3', label: 'Absol' },
  { value: '4', label: 'Accelgor' },
  { value: '5', label: 'Aegislash' },
  { value: '6', label: 'Aerodactyl' },
  { value: '7', label: 'Aggron' },
  { value: '8', label: 'Aipom' },
  { value: '9', label: 'Alakazam' },
  { value: '10', label: 'Alomomola' },
]

const NICK = 'nick'

const PLACEHOLDER = "Select Nick's Pokemon"

const DOWNSHIFT_ITEM = (instance: string | number, index: string | number) =>
  `div#downshift-${instance}-item-${index}`

let INPUT_HINT = 'input[name="hint-demo"]'

describe('Test the typeahead component', () => {
  const RealDateNow = Date.now

  Date.now = () => 1594731727942

  INPUT_HINT = `input[name="hint-${Date.now()}"]`

  afterAll(() => {
    Date.now = RealDateNow
  })

  it('should be a simple static one - in depth testing of the core behavior', () => {
    const wrapper = mount(<Typeahead items={ITEMS} placeholder={PLACEHOLDER} />)
    const clickAndPress = (value: string | number, last?: number) => {
      // Simulate press `a`.
      // See https://github.com/airbnb/enzyme/issues/76.
      wrapper.find(INPUT(0)).simulate('change', { target: { value } })
      // Check the input value.
      expect(wrapper.find(INPUT(0)).prop('value')).toBe(value)
      // We should have a pokemon for this last index or not at all.
      expect(wrapper.find(DOWNSHIFT_ITEM(0, last || 0))).toHaveLength(
        typeof last === 'undefined' ? 0 : 1,
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
      <Typeahead autoOpen items={ITEMS} placeholder={PLACEHOLDER} />,
    )
    // Perform a click on the input.
    wrapper.find(INPUT(1)).simulate('click')
    // A menu should be there!
    expect(wrapper.find(DOWNSHIFT_ITEM(1, 0))).toHaveLength(1)
    expect(wrapper).toMatchSnapshot()
  })
  it('should use the limit property', () => {
    const wrapper = mount(
      <Typeahead autoOpen items={ITEMS} limit={2} placeholder={PLACEHOLDER} />,
    )
    // Perform a click on the input.
    wrapper.find(INPUT(2)).simulate('click')
    // We should only get 2 items.
    expect(wrapper.find(DOWNSHIFT_ITEM(2, 0))).toHaveLength(1)
    expect(wrapper.find(DOWNSHIFT_ITEM(2, 1))).toHaveLength(1)
    expect(wrapper.find(DOWNSHIFT_ITEM(2, 2))).toHaveLength(0)
    expect(wrapper).toMatchSnapshot()
  })
  it('should use the top placement property', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        items={ITEMS}
        placeholder={PLACEHOLDER}
        placement="top"
      />,
    )
    // Perform a click on the input.
    wrapper.find(INPUT(3)).simulate('click')
    // We should get all the items.
    expect(wrapper.find(DOWNSHIFT_ITEM(3, 9))).toHaveLength(1)
    expect(wrapper.find(DOWNSHIFT_ITEM(3, 10))).toHaveLength(0)
    expect(wrapper).toMatchSnapshot()
  })
  it('should clear on select if clearOnSelect is used', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        clearOnSelect
        items={ITEMS}
        placeholder={PLACEHOLDER}
      />,
    )
    // Perform a click on the input.
    wrapper.find(INPUT(4)).simulate('click')
    // Select the first item.
    wrapper.find(INPUT(4)).simulate('keyDown', { key: 'Enter' })
    expect(wrapper.find(INPUT(4)).prop('value')).toBe('')
  })
  it('should use the defaultValue property (uncontrolled component)', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        defaultValue={DEFAULT_VALUE}
        items={ITEMS}
        placeholder={PLACEHOLDER}
      />,
    )
    expect(wrapper.find(INPUT(5)).prop('value')).toBe(DEFAULT_VALUE)
    expect(wrapper).toMatchSnapshot()
  })
  it('should use the value property (controlled component)', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        items={ITEMS}
        placeholder={PLACEHOLDER}
        value={DEFAULT_VALUE}
      />,
    )
    expect(wrapper.find(INPUT(6)).prop('value')).toBe(DEFAULT_VALUE)
    // Without controlling the value from the outside, we can't change it!
    wrapper.find(INPUT(6)).simulate('change', { target: { value: NICK } })
    expect(wrapper.find(INPUT(6)).prop('value')).toBe(DEFAULT_VALUE)
    // Control it now.
    wrapper.setProps({ value: NICK })
    expect(wrapper.find(INPUT(6)).prop('value')).toBe(NICK)
  })
  it('should render differently when loading', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        isLoading={false}
        items={ITEMS}
        placeholder={PLACEHOLDER}
      />,
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
      />,
    )
    expect(handleOnClearSelection.mock.calls.length).toBe(0)
    // Open the menu.
    wrapper.find(INPUT(8)).simulate('click')
    // Select the first item.
    wrapper.find(INPUT(8)).simulate('keyDown', { key: 'Enter' })
    // Check for the clear selection button.
    expect(wrapper.find(CLEAR_SELECTION)).toHaveLength(1)
    wrapper.find(CLEAR_SELECTION).simulate('click')
    expect(wrapper.find(INPUT(8)).prop('value')).toBe('')
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
      />,
    )
    expect(handleOnOpen.mock.calls.length).toBe(0)
    // Open the menu.
    wrapper.find(INPUT(9)).simulate('click')
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
      />,
    )
    expect(handleOnClose.mock.calls.length).toBe(0)
    // Open the menu.
    wrapper.find(INPUT(10)).simulate('click')
    // Select the first item.
    wrapper.find(INPUT(10)).simulate('keyDown', { key: 'Enter' })
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
      />,
    )
    expect(handleOnInputValueChange.mock.calls.length).toBe(0)
    // Enter something.
    wrapper.find(INPUT(11)).simulate('change', { target: { value: NICK } })
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
      />,
    )
    expect(handleOnSelect.mock.calls.length).toBe(0)
    // Open the menu.
    wrapper.find(INPUT(12)).simulate('click')
    // Select the first item.
    wrapper.find(INPUT(12)).simulate('keyDown', { key: 'Enter' })
    expect(handleOnSelect.mock.calls.length).toBe(1)
  })
  it('should handle warn the user if the clearOnSelect property is used on a controlled or uncontrolled component', () => {
    console.warn = jest.fn()

    shallow(
      <Typeahead
        autoOpen
        items={ITEMS}
        clearOnSelect
        defaultValue={NICK}
        placeholder={PLACEHOLDER}
      />,
    )
    expect(console.warn).toBeCalled()
    shallow(
      <Typeahead
        autoOpen
        clearOnSelect
        items={ITEMS}
        placeholder={PLACEHOLDER}
        value={NICK}
      />,
    )
    expect(console.warn).toBeCalledTimes(2)
    ;(console.warn as any).mockRestore()
  })
  it('should use autocomplete="off" for both inputs', () => {
    const wrapper = mount(<Typeahead items={ITEMS} placeholder={PLACEHOLDER} />)
    expect(wrapper.find(INPUT(13)).prop('autoComplete')).toBe('off')
    expect(wrapper.find(INPUT_HINT).prop('autoComplete')).toBe('off')
  })
  it('should not display a clear icon as a controlled component when value is an emtpy string', () => {
    const wrapper = mount(
      <Typeahead autoOpen items={ITEMS} placeholder={PLACEHOLDER} value={''} />,
    )
    expect(wrapper.find(INPUT(14)).prop('value')).toBe('')
    expect(wrapper.find(CLEAR_SELECTION)).toHaveLength(0)
  })
  it('should not display a clear icon as a controlled component when value is undefined', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        items={ITEMS}
        placeholder={PLACEHOLDER}
        value={undefined}
      />,
    )
    expect(wrapper.find(INPUT(15)).prop('value')).toBe('')
    expect(wrapper.find(CLEAR_SELECTION)).toHaveLength(0)
  })
  it('should not display a clear icon as a uncontrolled component when defaultValue is an emtpy string', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        defaultValue={''}
        items={ITEMS}
        placeholder={PLACEHOLDER}
      />,
    )
    expect(wrapper.find(INPUT(16)).prop('value')).toBe('')
    expect(wrapper.find(CLEAR_SELECTION)).toHaveLength(0)
  })
  it('should not display a clear icon as a uncontrolled component when defaultValue is undefined', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        defaultValue={undefined}
        items={ITEMS}
        placeholder={PLACEHOLDER}
      />,
    )
    expect(wrapper.find(INPUT(17)).prop('value')).toBe('')
    expect(wrapper.find(CLEAR_SELECTION)).toHaveLength(0)
  })
  it('should not display a clear icon as a controlled component when value cleared', () => {
    const wrapper = mount(
      <Typeahead
        autoOpen
        items={ITEMS}
        placeholder={PLACEHOLDER}
        value={DEFAULT_VALUE}
      />,
    )
    expect(wrapper.find(INPUT(18)).prop('value')).toBe(DEFAULT_VALUE)
    expect(wrapper.find(CLEAR_SELECTION)).toHaveLength(1)
    // Simulate clearing the input with the keyboard.
    wrapper.setProps({ value: '' })
    expect(wrapper.find(CLEAR_SELECTION)).toHaveLength(0)
  })

  describe('Test typeahead component with jsx labels', () => {
    const LabelIcon = ({ text }: { text: string }) => <div>{text[0]}</div>

    const ITEMS = [
      {
        label: 'White',
        value: '#FFF',
        icon: <LabelIcon text="White" />,
      },
      {
        label: 'Black',
        value: '#000',
        icon: <LabelIcon text="Black" />,
      },
      {
        label: 'Grey',
        value: '#666',
        icon: <LabelIcon text="Grey" />,
      },
    ]
    it('should be a simple static one - in depth testing of the core behavior with JSX labels', () => {
      const wrapper = mount(
        <Typeahead items={ITEMS} placeholder={PLACEHOLDER} />,
      )
      expect(wrapper).toMatchSnapshot()
      // SELECTED_ITEM_ICON should not be visible at this point
      expect(wrapper.find(SELECTED_ITEM_ICON)).toHaveLength(0)
      // Perform a click on the input.
      wrapper.find(INPUT(19)).simulate('click')
      // No menu should be there!
      expect(wrapper.find(DOWNSHIFT_ITEM(19, 0))).toHaveLength(0)
      // 1st case scenario: select by clicking the item.
      wrapper.find(INPUT(19)).simulate('change', { target: { value: 'B' } })
      // Check the input value.
      expect(wrapper.find(INPUT(19)).prop('value')).toBe('B')
      // Black color is found
      expect(wrapper.find(DOWNSHIFT_ITEM(19, 0))).toHaveLength(1)
      // Click on found item from list
      wrapper.find(DOWNSHIFT_ITEM(19, 0)).simulate('click')
      // SELECTED_ITEM_ICON should be displayed
      expect(wrapper.find(SELECTED_ITEM_ICON)).toHaveLength(1)
      // check value is displayed correctly
      expect(wrapper.find(SELECTED_ITEM_ICON).text()).toBe('B')
      // We should be able to clear it.
      expect(wrapper.find(CLEAR_SELECTION)).toHaveLength(1)
      wrapper.find(CLEAR_SELECTION).simulate('click')
      // SELECTED_ITEM_ICON is not visible anymore
      expect(wrapper.find(SELECTED_ITEM_ICON)).toHaveLength(0)
      expect(wrapper.find(INPUT(19))).toHaveLength(1)
      // list of items is open and all 3 items are visible
      expect(wrapper.find(DOWNSHIFT_ITEM(19, 0))).toHaveLength(1)
      expect(wrapper.find(DOWNSHIFT_ITEM(19, 1))).toHaveLength(1)
      expect(wrapper.find(DOWNSHIFT_ITEM(19, 2))).toHaveLength(1)
    })
  })
})
