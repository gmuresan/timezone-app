/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';
import Clock from './';

describe('Clock', () => {
  test('renders clock correctly', () => {
    Date.now = jest.fn(() => 1487076708000);
    const wrapper = renderer
      .create(
        <App context={{ insertCss: () => {} }}>
          <Clock gmtOffset={1} />
        </App>,
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});

