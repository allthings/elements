<!-- 
This is an auto-generated markdown. 
You can change it in "src/molecules/Button.js" and run build:docs to update this file.
-->
# Button
Buttons make common actions immediately visible and easy to perform with one
click or tap. They can be used for any type of action, including navigation.

You can use two different looks for the button: primary and
secondary. Primary is the default type, so there's no need to explicitly
define it.

```example
<ThemeProvider>
  <Button>Hello you</Button>
</ThemeProvider>
```

To have an icon as button-label, just add the icon-component as children.

```example
<Button type="submit">
   <View direction="row">
     Hello with icon
     <View style={{ marginLeft: 10 }}>
       <Icon name="send-filled" size="xs" color="white" />
     </View>
   </View>
 </Button>
```
## Usage
| Name        | Type           | Description  |
| ----------- |:--------------:| ------------:|
|children **(required)**|node|Just text most of the time
|onClick|func|Called when the button is clicked
|secondary|bool|If the button is used for a secondary option<br>Default: false
|type|enum|Type of the button (deprecated)<br>Default: 'button'
|disabled|bool|Disable button state to indicate it's not touchable<br>Default: false
|backgroundColor|string|Color of the button, theme primary color by default<br>Default: 'purple'
|color|custom|Textcolor of the button (deprecated)<br>Default: 'white'
|disabledColor|string|Textcolor when button is disabled (deprecated)<br>Default: 'darkgray'
|disabledBackgroundColor|string|Color when button is disabled (deprecated)<br>Default: 'lightGray'
|css|object|Pass your own css (deprecated)
