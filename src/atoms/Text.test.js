import React from 'react'
import renderer from 'react-test-renderer'
import Text from './Text'

test('Text renders correctly', () => {
  const tree = renderer.create(
    <Text />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
