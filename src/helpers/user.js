import Cookies from 'js-cookie';

export default function getCurrentUser() {
  const userData = Cookies.get('currentUser');
  if (userData) {
    return JSON.parse(userData);
  }

  return {};
}

