import _ from 'lodash';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import apiRoutes from './api';
import { User } from './data/models';
import config from './config';

const app = express();

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
      res.status(401);
      res.json({});
    } else if (User.validPassword(password, user.password)) {
      const expiresIn = 60 * 60 * 24 * 1; // 1 days
      const userData = _.pick(user, ['id', 'name', 'email', 'userType']);
      const token = jwt.sign(userData, config.auth.jwt.secret, { expiresIn });
      userData.token = token;
      res.json(userData);
    } else {
      res.status(401);
      res.json({ error: 'Invalid Password' });
    }
  });
});

app.post('/users', (req, res) => {
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


export default app;

