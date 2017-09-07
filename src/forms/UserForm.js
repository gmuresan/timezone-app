import t from 'tcomb-form';
import baseForm from './BaseForm';

const User = t.struct({
  email: t.String,
  name: t.String,
  password: t.String,
});

const defaultOptions = {
  fields: {
    password: {
      type: 'password',
    },
  },
};

const UserType = t.enums({
  user: 'User',
  manager: 'Manager',
  admin: 'Admin',
});

export default baseForm({
  fields: User,
  defaultOptions,
  submitText: 'Submit',
  loadingText: 'Loading',
});

export function buildForm(passwordRequired = true, withUserType = false) {
  const props = {
    email: t.String,
    name: t.String,
    password: (passwordRequired ? t.String : t.maybe(t.String)),
  };

  if (withUserType) {
    props.userType = UserType;
  }

  return baseForm({
    fields: t.struct(props),
    defaultOptions,
    submitText: 'Submit',
    loadingText: 'Loading',
  });
}

