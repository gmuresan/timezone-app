/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import Cookies from 'js-cookie';
import getCurrentUser from './user.js';

const user = {
  id: 1,
  name: 'name',
  userType: 'admin',
  email: 'a@a.com',
};

describe('Home', () => {
  test('renders timezone list', () => {
    Date.now = jest.fn(() => 1487076708000);
    Cookies.set('currentUser', JSON.stringify(user));

    const currentUser = getCurrentUser();

    expect(currentUser).toEqual(user);
  });
});

