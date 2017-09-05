import t from 'tcomb-form';
import baseForm from './BaseForm';

const Login = t.struct({
  email: t.String,
  password: t.String,
});

const defaultOptions = {
  fields: {
    password: {
      type: 'password',
    },
  },
};

export default baseForm({
  fields: Login,
  defaultOptions,
  submitText: 'Login',
  loadingText: 'Loading',
});
