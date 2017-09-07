import app from 'express';
import _ from 'lodash';
import { User } from '../data/models';
import tzRouter from './timezone';

const userRouter = app.Router();

userRouter.param('userId', (req, res, next, userId) => {
  if (userId !== req.user.id &&
    (req.user.userType !== 'admin' && req.user.userType !== 'manager')) {
    res.status(403);
    res.json();
  } else {
    User.findOne({ where: { id: userId } }).then((user) => {
      if (user) {
        req.requestedUser = user;
        next();
      } else {
        res.status(404);
        res.json({});
      }
    });
  }
});

userRouter.use((err, req, res, next) => {
  const userType = req.user.userType;
  if (userType !== 'manager' && userType !== 'admin') {
    res.status(403);
    res.json();
  }
  next();
});

userRouter.get('/', (req, res) => {
  const userTypes = ['user'];
  if (req.user.userType === 'admin') {
    userTypes.push('manager');
  }

  User.findAll({ where: { userType: { $in: userTypes } } }).then((users) => {
    res.status(200);
    res.json(_.map(users, (user) => _.pick(user, ['name', 'email', 'id', 'userType'])));
  });
});

userRouter.put('/:userId', (req, res) => {
  const fields = ['name', 'email'];
  const body = req.body;
  if (req.user.userType === 'admin') {
    fields.push('userType');
    if (body.password) {
      fields.push('password');
      body.password = User.generateHash(body.password);
    }
  }

  console.log(fields);
  console.log(body);
  req.requestedUser.update(req.body, { fields }).then((user) => {
    res.status(200);
    res.json(_.pick(user, ['name', 'email', 'id', 'userType']));
  });
});

userRouter.delete('/:userId', (req, res) => {
  req.requestedUser.destroy().then(() => {
    res.status(204);
    res.json();
  });
});

userRouter.use('/:userId/timezones', tzRouter);

export default userRouter;

