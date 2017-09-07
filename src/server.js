import _ from 'lodash';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import router from './router';
import models, { User } from './data/models';
// import schema from './data/schema';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import config from './config';
import apiRoutes from './api';

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


if (__DEV__) {
  app.enable('trust proxy');
}

app.use('/api', apiRoutes);

app.post('/session', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ where: { email } }).then((user) => {
    if (!user) {
      res.json({});
    } else if (User.validPassword(password, user.password)) {
      const expiresIn = 60 * 60 * 24 * 1; // 1 days
      const userData = _.pick(user, ['id', 'name', 'email', 'userType']);
      const token = jwt.sign(userData, config.auth.jwt.secret, { expiresIn });
      userData.token = token;
      res.json(userData);
    }
  });
});

app.post('/user', (req, res) => {
  const { email, password, name } = req.body;
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      res.status(409);
      res.json();
    } else {
      User.create({
        email,
        password: User.generateHash(password),
        name,
      }).then((createdUser) => {
        if (createdUser) {
          res.status(201);
          const expiresIn = 60 * 60 * 24 * 1; // 1 days
          const userData = _.pick(createdUser, ['id', 'name', 'email', 'userType']);
          const token = jwt.sign(userData, config.auth.jwt.secret, { expiresIn });
          userData.token = token;
          res.json(userData);
        }
      });
    }
  });
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      // You can access redux through react-redux connect
      fetch: createFetch(fetch, {
        baseUrl: config.api.serverUrl,
        cookie: req.headers.cookie,
      }),
    };

    const route = await router.resolve({
      ...context,
      path: req.path,
      query: req.query,
      cookies: req.cookies,
      redirect(to) {
        const err = new Error('Redirecting');
        err.status = 301;
        err.path = to;
        throw err;
      },
    }, {});

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <App context={context}>
        {route.component}
      </App>,
    );
    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      apiUrl: config.api.clientUrl,
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    if (err.status === 301) {
      console.log(err);
      res.redirect(err.path || '/login');
      return;
    }
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = models.sync().then(() => {
  User.findOrCreate({ where: {
    email: 'manager@toptal.com',
    name: 'Manager',
    userType: 'manager',
  },
    defaults: { password: User.generateHash('password') },
  });

  User.findOrCreate({ where: {
    email: 'admin@toptal.com',
    name: 'Admin',
    userType: 'admin',
  },
    defaults: { password: User.generateHash('password') },
  });
}).catch(err => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
