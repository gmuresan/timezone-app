import t from 'tcomb-form';
// import Select from 'react-select';
import React from 'react';
// import Cleave from 'cleave.js/react';

export const emailField = t.refinement(t.String, (email) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email));

/*
export function reactSelectFormTemplate(multi = false) {
  return class ReactSelect extends t.form.Select {
    getTemplate() {
      return (locals) => {
   // <- locals contains the "recipe" to build the UI

        // handle error status
        let className = 'form-group';
        if (locals.hasError) {
          className += ' has-error';
        }

        // translate the option model from tcomb to react-select
        const options = locals.options.map(({ value, text }) => ({ value, label: text }));

        let onChange = (v) => {
          const values = v.map((value) => value.value);
          locals.onChange(values);
        };
        if (!multi) {
          onChange = (v) => {
            locals.onChange(v.value);
          };
        }

        return (
          <div className={`${className} form-select`}>
            <label htmlFor={locals.attrs.name} className="control-label">{locals.label}</label>
            <Select
              name={locals.attrs.name}
              value={locals.value}
              options={options}
              onChange={onChange}
              multi={multi}
              clearable={multi}
            />
          </div>
        );
      };
    }

  };
}

export class NumberFormatter extends t.form.Component {
  getTemplate() {
    return (locals) => (
      <div className="form-group form-group-depth-1">
        <label htmlFor="numberFormatterInput">{locals.label}</label>
        <Cleave
          value={locals.value ? locals.value : 0}
          className="form-control"
          onChange={(event) => locals.onChange(parseFloat(event.target.rawValue))}
          options={{ numberalPositiveOnly: true,
            numeral: true,
            prefix: '$',
            rawValueTrimPrefix: true,
            numeralIntegerScale: 20,
          }}
        />
      </div>
        );
  }
}
*/

