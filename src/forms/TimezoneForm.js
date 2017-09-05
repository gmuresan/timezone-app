import t from 'tcomb-form';
import baseForm from './BaseForm';

const Timezone = t.struct({
  name: t.String,
  city: t.String,
  gmtOffset: t.String,
});

const defaultOptions = {
  fields: {
  },
};

export default baseForm({
  fields: Timezone,
  defaultOptions,
  submitText: 'Submit',
  loadingText: 'Loading',
});

