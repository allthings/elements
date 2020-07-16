import { alpha, ColorPalette } from '@allthings/colors'
import Downshift, {
  DownshiftState,
  GetItemPropsOptions,
  StateChangeOptions,
} from 'downshift'
import { css, keyframes } from 'glamor'
import matchSorter from 'match-sorter'
import React, { createRef, PureComponent, ReactNode } from 'react'
import Absolute from '../Absolute'
import Icon from '../Icon'
import { Input, List, ListItem, Text } from '../index'
import Relative from '../Relative'
import Spinner from '../Spinner'
import escapeRegex from '../utils/escapeRegex'
import View from '../View'

const INPUT_FIELD_HEIGHT = '50px'

const bounceDownwardsAnim = keyframes('bounce', {
  '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
  '40%': { transform: 'translateY(-10px)' },
  '60%': { transform: 'translateY(-10px)' },
})

const bounceUpwardsAnim = keyframes('bounce', {
  '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
  '40%': { transform: 'translateY(+10px)' },
  '60%': { transform: 'translateY(+10px)' },
})

const Placement = {
  top: 'top',
  bottom: 'bottom',
}

type Placement = 'top' | 'bottom'

export interface ITypeaheadItem {
  label: string
  value: string
  icon?: ReactNode
}

interface ITypeaheadProps {
  /** Forces the menu to be opened when clicking in the input. */
  readonly autoOpen?: boolean
  /** Automatically clears the selection. Must not be used with controlled
   * and uncontrolled components. */
  readonly clearOnSelect?: boolean
  /** The defaultbooleancomponent, without making it controlled. */
  readonly defaultValue?: string
  /** If "top", then the list should be reversed and extended upwards, if "bottom" (default) then downwards */
  readonly placement?: Placement
  /** The loading state of the component, e.g when externally fetching some
   * data. */
  readonly isLoading?: boolean
  /** The itebooleanomponent as an array of objects. (icon is optional) */
  readonly items: ReadonlyArray<ITypeaheadItem>
  /** The maximum number of items displayed in the menu. */
  readonly limit?: number
  /** The height of the menu in pixels. */
  readonly menuHeight?: number
  /** Callback triggered when clearing the selection. */
  readonly onClearSelection?: () => void
  /** Callback triggered when the menu is closed. */
  readonly onClose?: () => void
  /** Callback triggered when the input value is modified. */
  readonly onInputValueChange?: (inputValue: string) => void
  /** Callback triggered when the menu is opened. */
  readonly onOpen?: () => void
  /** Callback triggered when selecting an item. */
  readonly onSelect?: (item: ITypeaheadItem) => void
  /** The placeholder displayed in the input field. */
  readonly placeholder?: string
  /** The value of the component, makes this a controlled component. */
  readonly value?: string
}

interface IState {
  showScrollArrow: boolean
}

const defaultProps = {
  limit: 20,
  menuHeight: 300,
  placement: Placement.bottom,
}

type MyProps = typeof defaultProps & ITypeaheadProps

export default class Typeahead extends PureComponent<MyProps, IState> {
  static defaultProps = defaultProps

  constructor(props: MyProps) {
    super(props)
    if (
      process &&
      process.env &&
      process.env.NODE_ENV !== 'production' &&
      Object.prototype.hasOwnProperty.call(props, 'clearOnSelect') &&
      (Object.prototype.hasOwnProperty.call(props, 'defaultValue') ||
        Object.prototype.hasOwnProperty.call(props, 'value'))
    ) {
      console.warn(
        [
          'The clearOnSelect property should not be used on a controlled',
          'or uncontrolled component in order to avoid side-effects.',
        ].join(''),
      )
    }
    this.state = {
      showScrollArrow: false,
    }
  }

  inputRef = createRef<HTMLInputElement>()
  listRef = createRef<HTMLDivElement>()

  componentDidMount() {
    if (this.listRef.current) {
      this.showArrowIfNecessary()
    }
  }

  clearSelection = (downshiftClearSelection: () => void) => () => {
    // Focus back on the input.
    this.inputRef.current && this.inputRef.current.focus()
    // Trigger the Downshift method.
    downshiftClearSelection()
    // Trigger the prop one.
    this.props.onClearSelection && this.props.onClearSelection()
  }

  getHintText = (inputValue: string, itemText: string) => {
    if (itemText.toLowerCase().startsWith(inputValue.toLowerCase())) {
      const escaped = escapeRegex(inputValue)
      const restText = itemText
        .split(new RegExp(`(${escaped})`, 'i'))
        .slice(2)
        .join('')

      return inputValue + restText
    }
    return ''
  }

  stateReducer = (
    state: DownshiftState<ITypeaheadItem>,
    changes: StateChangeOptions<ITypeaheadItem>,
  ) => {
    const { clearOnSelect, placement } = this.props
    const minOfLimits = Math.min(
      this.props.items.length - 1,
      this.props.limit - 1,
    )
    switch (changes.type) {
      // Special case when the clearOnSelect property is used and we want to
      // clear the input.
      // case Downshift.stateChangeTypes.clickItem:
      case Downshift.stateChangeTypes.keyDownEnter:
        return {
          ...changes,
          ...(clearOnSelect && { inputValue: '' }),
        }
      case Downshift.stateChangeTypes.keyDownArrowUp:
        return placement === Placement.top
          ? {
              ...state,
              highlightedIndex:
                state.highlightedIndex! >= minOfLimits
                  ? 0
                  : state.highlightedIndex! + 1,
            }
          : { ...state, ...changes }
      case Downshift.stateChangeTypes.keyDownArrowDown:
        return placement === Placement.top
          ? {
              ...state,
              highlightedIndex:
                state.highlightedIndex! > minOfLimits
                  ? minOfLimits
                  : state.highlightedIndex! <= 0
                  ? minOfLimits
                  : state.highlightedIndex! - 1,
            }
          : { ...state, ...changes }

      case Downshift.stateChangeTypes.changeInput:
        return {
          // When the input value is cleared then also clear the selection.
          ...changes,
          selectedItem: changes.inputValue === '' ? null : state.selectedItem,
        }

      default:
        return {
          // When the clear selection button is used then reopen the menu
          // in order to be consistent with what happens when clearing the
          // selection with the keyboard.
          ...changes,
          // This should not happen when clearOnSelect is used and if the menu
          // is already opened.
          ...(!clearOnSelect &&
            !state.isOpen && {
              isOpen: !changes.inputValue ? true : state.isOpen,
            }),
        }
    }
  }

  handleStateChange = (changes: StateChangeOptions<string>) => {
    if (changes.isOpen === true) this.props.onOpen && this.props.onOpen()
    if (changes.isOpen === false) this.props.onClose && this.props.onClose()
    if (Object.prototype.hasOwnProperty.call(changes, 'inputValue'))
      this.showArrowIfNecessary()
  }

  createRenderListItem = ({
    clearSelection,
    getItemProps,
    highlightedIndex,
  }: {
    clearSelection: () => void
    getItemProps: (options: GetItemPropsOptions<ITypeaheadItem>) => any
    highlightedIndex: null | number
  }) => (item: ITypeaheadItem, index: number) => (
    <ListItem
      {...getItemProps({
        index,
        item,
        key: item.value,
        style: {
          backgroundColor:
            highlightedIndex === index
              ? alpha(ColorPalette.background.bright, 0.5, true)
              : ColorPalette.background.white,
        },
        ...(this.props.clearOnSelect && {
          onClick: () =>
            // Perform it on next tick.
            setTimeout(() => this.clearSelection(clearSelection)()),
        }),
      })}
    >
      {item.icon ? (
        <span {...css({ marginRight: '15px' })}>{item.icon}</span>
      ) : null}
      <Text size="m">{item.label}</Text>
    </ListItem>
  )

  showArrowIfNecessary = () =>
    this.listRef.current &&
    this.setState({
      showScrollArrow:
        this.listRef.current.scrollHeight > this.props.menuHeight,
    })

  handleListScroll = (e: any) => {
    if (this.state.showScrollArrow && e.target.scrollTop > 0) {
      this.setState({ showScrollArrow: false })
    }
  }

  render() {
    const {
      autoOpen,
      clearOnSelect,
      defaultValue,
      placement,
      isLoading,
      items,
      limit,
      menuHeight,
      onInputValueChange,
      onSelect,
      placeholder,
      value,
    } = this.props
    const { showScrollArrow } = this.state
    const defaultSelectedItem = items.filter(
      ({ label }) => label === defaultValue,
    )[0]
    const selectedItem =
      value !== '' && items.filter(({ label }) => label === value)[0]

    return (
      <Downshift
        initialHighlightedIndex={0}
        defaultHighlightedIndex={0}
        initialInputValue={defaultValue}
        initialSelectedItem={defaultSelectedItem}
        inputValue={value}
        itemToString={item => (item ? item.label : '')}
        onChange={onSelect}
        onInputValueChange={onInputValueChange}
        onStateChange={this.handleStateChange}
        selectedItem={selectedItem}
        stateReducer={this.stateReducer}
      >
        {({
          clearSelection,
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
          selectHighlightedItem,
          toggleMenu,
        }) => {
          const filtered = matchSorter(items, String(inputValue), {
            keys: ['label'],
          }).slice(0, limit)

          const highlightedFilteredItem =
            highlightedIndex !== null ? filtered[highlightedIndex] : null

          const showIcon =
            selectedItem &&
            highlightedFilteredItem &&
            highlightedFilteredItem.icon

          const itemText =
            highlightedFilteredItem && highlightedFilteredItem.label
              ? highlightedFilteredItem.label
              : ''
          const hintValue =
            inputValue && filtered.length > 0
              ? this.getHintText(inputValue, itemText)
              : ''

          // Opt for <div> here because we don't want to mess with downshifts
          // getRootProps and refKey, which is kind of strange.
          return (
            <div
              {...css({
                alignItems: 'stretch',
                background: 'transparent',
                border: 'none',
                boxShadow: isOpen && '1px 1px 3px rgba(29, 29, 29, 0.125)',
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                width: '100%',
              })}
            >
              <View
                {...css({
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: '#FFF',
                })}
              >
                {showIcon ? (
                  <strong
                    {...css({
                      height: INPUT_FIELD_HEIGHT,
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '15px',
                    })}
                  >
                    {highlightedFilteredItem && highlightedFilteredItem.icon}
                  </strong>
                ) : null}
                <Relative
                  {...css({
                    width: showIcon ? 'calc(100% - 30px)' : '100%',
                    ':after': selectedItem && {
                      background:
                        'linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(192,192,192,0) 52%,rgba(244,244,244,0) 66%,rgba(255,255,255,0.6) 81%,rgba(255,255,255,1) 88%,rgba(255,255,255,1) 100%)',
                      bottom: 0,
                      content: `''`,
                      left: 0,
                      pointerEvents: 'none',
                      position: 'absolute',
                      top: 0,
                    },
                  })}
                >
                  <Absolute top={0} left={0} {...css({ width: '100%' })}>
                    <Input
                      autoComplete="off"
                      name={`hint-${Date.now()}`}
                      tabIndex={-1}
                      value={hintValue}
                      hasRightIcon={!!selectedItem && !clearOnSelect}
                      {...css({
                        background: '#fff',
                        border: 'none',
                        boxShadow: 'none',
                        color: '#999',
                        opacity: 1,
                        height: INPUT_FIELD_HEIGHT,
                      })}
                    />
                  </Absolute>
                  <Input
                    name="typed"
                    onClick={
                      autoOpen && !selectedItem ? () => toggleMenu() : undefined
                    }
                    // @todo why string though?
                    // Type 'string' is not assignable to type 'RefObject<HTMLInputElement> | ((instance: HTMLInputElement | null) => void) | null | undefined'.
                    ref={this.inputRef as any}
                    hasRightIcon={!!selectedItem && !clearOnSelect}
                    placeholder={placeholder}
                    {...getInputProps({
                      onKeyDown: e => {
                        if (
                          ['Tab', 'ArrowRight', 'End'].includes(e.key) &&
                          highlightedIndex !== null &&
                          isOpen
                        ) {
                          selectHighlightedItem()
                          // Clear the selection if clearOnSelect is used as we
                          // want to keep the input empty.
                          if (clearOnSelect) clearSelection()
                          e.preventDefault()
                        }
                      },
                    })}
                    {...css({
                      background: 'transparent',
                      border: 'none',
                      borderBottom:
                        isOpen && `1px solid ${ColorPalette.lightGreyIntense}`,
                      boxShadow: 'none',
                      color: '#000',
                      outline: 'none',
                      width: '100%',
                      height: INPUT_FIELD_HEIGHT,
                    })}
                  />
                  <Absolute
                    alignV="center"
                    direction="row"
                    right={20}
                    top={0}
                    {...css({ height: '100%' })}
                  >
                    {isLoading ? (
                      <Spinner size={16} />
                    ) : (
                      (value || selectedItem) &&
                      !clearOnSelect && (
                        <View
                          onClick={this.clearSelection(clearSelection)}
                          {...css({
                            cursor: 'pointer',
                            margin: -10,
                            padding: 10,
                            transform: 'translateY(-3px)',
                            zIndex: 1,
                          })}
                        >
                          <Icon
                            color="black"
                            name="remove-light-filled"
                            size={10}
                            data-testid="typeahead-clear-icon"
                          />
                        </View>
                      )
                    )}
                  </Absolute>
                </Relative>
              </View>
              <Relative>
                {isOpen && (
                  <List
                    direction={
                      placement === Placement.top ? 'column-reverse' : 'column'
                    }
                    ref={this.listRef}
                    {...getMenuProps({}, { suppressRefError: true })}
                    {...css({
                      boxShadow:
                        isOpen && '1px 1px 3px rgba(29, 29, 29, 0.125)',
                      maxHeight: menuHeight,
                      overflowX: 'hidden',
                      overflowY: 'auto',
                      position: 'absolute',
                      bottom: placement === Placement.top && INPUT_FIELD_HEIGHT,
                      width: '100%',
                      zIndex: 9999,
                    })}
                    onScroll={this.handleListScroll}
                  >
                    {filtered.map(
                      this.createRenderListItem({
                        clearSelection,
                        getItemProps,
                        highlightedIndex,
                      }),
                    )}
                    <Absolute
                      bottom={placement !== Placement.top ? 15 : undefined}
                      top={placement === Placement.top ? 15 : undefined}
                      right={15}
                    >
                      {showScrollArrow &&
                        (placement === Placement.top ? (
                          <Icon
                            color="black"
                            name="arrow-up"
                            size="xs"
                            {...css({
                              animation: `${bounceUpwardsAnim} 2500ms 2`,
                            })}
                          />
                        ) : (
                          <Icon
                            color="black"
                            name="arrow-down"
                            size="xs"
                            {...css({
                              animation: `${bounceDownwardsAnim} 2500ms 2`,
                            })}
                          />
                        ))}
                    </Absolute>
                  </List>
                )}
              </Relative>
            </div>
          )
        }}
      </Downshift>
    )
  }
}
