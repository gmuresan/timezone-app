
import Router from 'universal-router';
import Cookies from 'js-cookie';
import routes from './routes';

export default new Router(routes, {
  resolveRoute(context, params, request) {
    if (context.route.auth === true) {
      const token = Cookies.get('token') ? Cookies.get('token') : context.cookies.token;
      if (!token) return context.redirect('/login');
    }

    if (typeof context.route.load === 'function') {
      return context.route
        .load()
        .then(action => action.default(context, params));
    }
    if (typeof context.route.action === 'function') {
      return context.route.action(context, params);
    }
    return null;
  },
});
