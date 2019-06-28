import React from 'react'
import {
  Inset,
  Input,
  Spacer,
  DateInput,
  Dropdown,
  Collapsible,
  ThemeProvider,
  ResourceProvider,
  TimeInput,
  View,
  Button,
  Form,
} from '../src/'

import { ColorPalette } from '@allthings/colors'

export default class FilterStory extends React.Component {
  state = {
    selectedDate: undefined,
    fromTime: undefined,
    toTime: undefined,
    formData: undefined,
  }

  render() {
    return (
      <ThemeProvider>
        <ResourceProvider>
          <Form onSubmit={(e, formData) => this.setState({ formData })}>
            <Inset horizontal vertical>
              <Collapsible
                title="Filter this list"
                hasBottomBorder
                initiallyCollapsed={false}
              >
                <Spacer
                  background={ColorPalette.background.bright}
                  height={2}
                />
                <Input
                  name="asset"
                  label="Asset name"
                  placeholder="Filter by asset name"
                  icon="search-filled"
                />
                <Spacer
                  background={ColorPalette.background.bright}
                  height={2}
                />
                <Dropdown
                  name="category"
                  icon="list-bullets-filled"
                  menuHeight={200}
                  onSelect={item => this.setState({ simpleDropdown: item })}
                  items={[
                    {
                      label: 'Rooms',
                      value: 'Rooms',
                    },
                    {
                      label: 'Furnitures',
                      value: 'Furnitures',
                    },
                    {
                      label: 'Lab equipment',
                      value: 'Lab equipment',
                    },
                  ]}
                  clearable
                  placeholder="Select a category"
                  label="Category"
                />
                <Spacer
                  background={ColorPalette.background.bright}
                  height={2}
                />
                <DateInput
                  placeholder="Please select a day"
                  name="select-date"
                  label="Date"
                  locale="de-DE"
                  minDate={new Date()}
                  minDetail="year"
                  onChange={date => this.setState({ selectedDate: date })}
                />
                {this.state.selectedDate && (
                  <>
                    <Spacer
                      background={ColorPalette.background.bright}
                      height={1}
                    />
                    <View direction="row">
                      <TimeInput
                        name="from"
                        readOnly
                        label="From"
                        icon="sharetime"
                        minuteStep={15}
                        onChange={time => this.setState({ fromTime: time })}
                        maxTime={this.state.toTime}
                      />
                      <Spacer
                        background={ColorPalette.background.bright}
                        width={1}
                        height="100%"
                      />
                      <TimeInput
                        name="to"
                        readOnly
                        label="To"
                        icon="sharetime"
                        minuteStep={15}
                        onChange={time => this.setState({ toTime: time })}
                        minTime={this.state.fromTime}
                      />
                    </View>
                  </>
                )}
              </Collapsible>
              <Spacer height={5} />
              <View direction="row">
                <Button type="submit" style={{ flex: 1 }}>
                  Submit
                </Button>
              </View>
            </Inset>
          </Form>
          {this.state.formData && (
            <pre style={{ fontSize: 12 }}>
              {JSON.stringify(this.state.formData, null, 2)}
            </pre>
          )}
        </ResourceProvider>
      </ThemeProvider>
    )
  }
}