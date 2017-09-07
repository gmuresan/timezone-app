/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import renderer from 'react-test-renderer';
import App from '../../components/App';
import Home from './Home';

const timezones = [
  { id: 1, name: 'n1', city: 'c1', gmtOffset: 1 },
  { id: 2, name: 'n2', city: 'c2', gmtOffset: 2 },
  { id: 3, name: 'n3', city: 'c3', gmtOffset: 3 },
];

describe('Home', () => {
  test('renders timezone list', () => {
    Date.now = jest.fn(() => 1487076708000);
    const wrapper = renderer
      .create(
        <App context={{ insertCss: () => {} }}>
          <Home
            timezones={timezones}
            createTimezone={() => {}}
            updateTimezone={() => {}}
            deleteTimezone={() => {}}
            filterByName={() => {}}
          />
        </App>,
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});

