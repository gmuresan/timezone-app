/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import request from 'supertest';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import app from '../app';
import models, { User, Timezone } from '../data/models';
import config from '../config';


describe('Timezone API', () => {

  beforeEach(async () => {
    await models.drop();
    await models.sync({ force: true, logging: false }).then(async () => {
      await User.findOrCreate({ where: {
        email: 'manager@toptal.com',
        name: 'Manager',
        userType: 'manager',
      },
        defaults: { password: User.generateHash('password') },
      }).then(async () => {
        await User.findOrCreate({ where: {
          email: 'admin@toptal.com',
          name: 'Admin',
          userType: 'admin',
        },
          defaults: { password: User.generateHash('password') },
        });

      }).then(async () => {
        await User.findOrCreate({ where: {
          email: 'user@toptal.com',
          name: 'User',
          userType: 'user',
        },
          defaults: { password: User.generateHash('password') },
        });

      });
    });
  });

  it('post creates timezone', (done) => {
    User.findOne({ where: { email: 'user@toptal.com' } }).then((user) => {
      const userData = _.pick(user, ['id', 'name', 'email', 'userType']);
      const token = jwt.sign(userData, config.auth.jwt.secret);
      request(app)
        .post(`/api/users/${user.id}/timezones`)
        .send({ name: 't1', city: 'city', gmtOffset: 1, userId: 111 })
        .set('Cookie', `token=${token}`)
        .end((err, res) => {
          Timezone.findOne({ where: { name: 't1' } }).then((tz) => {
            expect(tz.city).toEqual('city');
            done();
          });
        });
    });
  });
});
