import t from 'tcomb-form';
import baseForm from './BaseForm';
import { emailField } from '../helpers/forms';

const Password = t.refinement(t.String, (password) => password.length >= 8);

const samePasswords = (x) => x.password === x.confirmPassword;

const Register = t.subtype(t.struct({
  name: t.String,
  email: emailField,
  password: Password,
  confirmPassword: Password,
}), samePasswords);

const defaultOptions = {
  fields: {
    email: {
      type: 'email',
      error: 'Invalid email',
    },
    password: {
      type: 'password',
      error: 'Invalid password, must be at least 8 chars',
    },
    confirmPassword: {
      type: 'password',
      error: 'Invalid password, must be at least 8 chars',
    },
  },
};

function setPasswordMatchError(instance, hasError) {
  instance.setState({ options: t.update(instance.state.options, {
    fields: {
      confirmPassword: {
        hasError: { $set: hasError },
        error: { $set: 'Passwords must match' },
      },
    },
  }) });
}


function onValidSubmit(instance) {
  setPasswordMatchError(instance, false);
}

function onInvalidSubmit(instance) {
  if (instance.state.value.confirmPassword && !samePasswords(instance.state.value)) {
    setPasswordMatchError(instance, true);
  }
}

// export default baseForm(RegisterForm);
export default baseForm({
  fields: Register,
  defaultOptions,
  onValidSubmit,
  onInvalidSubmit,
  submitText: 'Register',
});

