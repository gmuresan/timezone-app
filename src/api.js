import app from 'express';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import _ from 'lodash';
import config from './config';
import { Timezone } from './data/models';

const router = app.Router();

router.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: true,
    getToken: (req) => {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    },
  }),
);
// Error handler for express-jwt
router.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
  }
  next(err);
});

const tzRouter = app.Router();

tzRouter.param('id', (req, res, next, id) => {
  Timezone.findOne({ where: { id, userId: req.user.id } }).then((tz) => {
    if (tz) {
      req.timezone = tz;
      next();
    } else {
      res.status(404);
      res.json({});
    }
  });
});

tzRouter.post('/', (req, res) => {
  const { name, city, gmtOffset } = req.body;
  Timezone.create({
    name,
    city,
    gmtOffset,
    userId: req.user.id,
  }).then((timezone) => {
    res.status(201);
    res.json(timezone);
  });
});

tzRouter.get('/', (req, res) => {
  Timezone.findAll({ where: {
    userId: req.user.id,
  } }).then((timezones) => {
    res.status(200);
    res.json(timezones);
  });
});

tzRouter.put('/:id', (req, res) => {
  req.timezone.update(req.body).then((tz) => {
    console.log(tz);
    res.status(201);
    res.json(tz);
  });
});

tzRouter.delete('/:id', (req, res) => {
  req.timezone.destroy().then(() => {
    res.status(200);
    res.json({});
  });
});

router.use('/timezones', tzRouter);
export default router;
