import React from 'react'
import {
  ThemeProvider,
  Card,
  View,
  TitleBar,
  SquareIconButton,
  Text,
  SimpleLayout,
  List,
  ListItem,
  ResourceProvider,
  Form,
  RadioButtonSet,
  RadioButton,
} from '../src'

export default class RadioButtonSetStory extends React.Component {
  /**
   * Extract Radiobutton into Component
   */
  render() {
    return (
      <ResourceProvider>
        <ThemeProvider theme={{ primary: '#bada55' }}>
          <View direction="column" flex="flex">
            <TitleBar>
              <SquareIconButton icon="login-key" iconColor="white" />
              <Text strong color="white">
                Create new account
              </Text>
            </TitleBar>
            <SimpleLayout>
              <Form>
                <Card>
                  <List>
                    <ListItem>
                      <RadioButtonSet name="sizes" required>
                        <RadioButton value="short">short</RadioButton>
                        <RadioButton value="medium">medium</RadioButton>
                      </RadioButtonSet>
                    </ListItem>
                  </List>
                </Card>
              </Form>
            </SimpleLayout>
          </View>
        </ThemeProvider>
      </ResourceProvider>
    )
  }
}
