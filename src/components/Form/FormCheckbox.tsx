import { useField } from 'formik';
import { useState } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
  name: string;
  label: string;
  isChecked?: boolean;
}

function FormCheckbox({ name, label, isChecked }: Props) {
  const [checked, setChecked] = useState(isChecked ?? false);
  const [field, meta, helpers] = useField(name);

  return (
    <Form.Group>
      <Form.Check
        {...field}
        onChange={e => {
          helpers.setValue(e.target.checked);
          setChecked(e.target.checked);
        }}
        checked={checked}
        label={label}
        id={name}
      />
    </Form.Group>
  );
}

export default FormCheckbox;
