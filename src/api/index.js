import app from 'express';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import config from '../config';
import userRouter from './user';

const router = app.Router();

router.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: true,
    getToken: (req) => {
      if (req.cookies.token) return req.cookies.token;

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
    console.error('[express-jwt-error]', req.cookies.token);
    res.clearCookie('token');
  }
  next(err);
});


// router.use('/timezones', tzRouter);
router.use('/users', userRouter);
export default router;
