import Cookies from 'js-cookie';

export default function getCurrentUser(cookies) {
  let userData = null;
  if (cookies) {
    userData = cookies.currentUser;
  } else {
    userData = Cookies.get('currentUser');
  }
  if (userData) {
    return JSON.parse(userData);
  }

  return {};
}

