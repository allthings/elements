import { css } from 'glamor'
import React, { useState } from 'react'
import { Collapsible, Inset, Pill, Spacer, View } from '../src'

export default function PillStory() {
  const [items, setItems] = useState([
    'Pens and Paper',
    'Cars and Planes',
    'Humans and Animals',
    '🦉',
  ])
  const [fixedItems] = useState([
    'Girls and Boys',
    'Black and White',
    'Free and Chained',
  ])

  return (
    <Inset horizontal vertical>
      <Collapsible
        title="Just labels"
        hasBottomBorder
        initiallyCollapsed={false}
        tabIndex={1}
      >
        <View
          direction="row"
          alignH="center"
          {...css({ backgroundColor: 'white' })}
          wrap="wrap"
        >
          {fixedItems.map(item => (
            <Pill
              key={item}
              label={item}
              style={{ marginBottom: 5, marginRight: 5 }}
            />
          ))}
          {items.map((item, itemIndex) => (
            <Pill
              key={item}
              label={item}
              style={{ marginBottom: 5, marginRight: 5 }}
              onRemoveClick={() => {
                setItems(items.filter((_, index) => index !== itemIndex))
              }}
            />
          ))}
          <Spacer />
        </View>
      </Collapsible>
    </Inset>
  )
}
