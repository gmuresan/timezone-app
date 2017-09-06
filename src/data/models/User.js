import bcrypt from 'bcrypt-nodejs';

import DataType from 'sequelize';
import Model from '../sequelize';

const User = Model.define(
  'User',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },

    email: {
      type: DataType.STRING(255),
      validate: { isEmail: true },
      unique: true,
    },

    name: {
      type: DataType.STRING(255),
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
    },
    userType: {
      type: DataType.STRING(255),
      defaultValue: 'user',
    },
  },
  {
    indexes: [{ fields: ['email'] }],
  },
);

User.generateHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

User.validPassword = (password, hash) => bcrypt.compareSync(password, hash);

export default User;
