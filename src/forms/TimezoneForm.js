import t from 'tcomb-form';
import baseForm from './BaseForm';

const gmtOffset = t.refinement(t.Number,
  (offset) => offset >= -16 && offset <= 16,
);

gmtOffset.getValidationErrorMessage = (value, path, context) => 'GMT offset must be between -16 and 16';

const Timezone = t.struct({
  name: t.String,
  city: t.String,
  gmtOffset,
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

