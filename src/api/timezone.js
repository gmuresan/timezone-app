import app from 'express';
import { Timezone } from '../data/models';

const tzRouter = app.Router();

tzRouter.param('id', (req, res, next, id) => {
  Timezone.findOne({ where: { id, userId: req.requestedUser.id } }).then((tz) => {
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
    userId: req.requestedUser.id,
  }).then((timezone) => {
    res.status(201);
    res.json(timezone);
  });
});

tzRouter.get('/', (req, res) => {
  Timezone.findAll({ where: {
    userId: req.requestedUser.id,
  } }).then((timezones) => {
    res.status(200);
    res.json(timezones);
  });
});

tzRouter.put('/:id', (req, res) => {
  req.timezone.update(req.body).then((tz) => {
    res.status(200);
    res.json(tz);
  });
});

tzRouter.delete('/:id', (req, res) => {
  req.timezone.destroy().then(() => {
    res.status(204);
    res.json({});
  });
});

export default tzRouter;

