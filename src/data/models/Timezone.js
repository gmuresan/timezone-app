import DataType from 'sequelize';
import Model from '../sequelize';

const Timezone = Model.define(
  'Timezone',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },

    name: {
      type: DataType.STRING(255),
      allowNull: false,
    },

    city: {
      type: DataType.STRING(255),
      allowNull: false,
    },

    gmtOffset: {
      type: DataType.DOUBLE,
      allowNull: false,
    },
  },
  {
  },
);

export default Timezone;

