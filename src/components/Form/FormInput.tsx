import { useField } from 'formik';
import { Form, FormControlProps, InputGroup } from 'react-bootstrap';

interface Props extends FormControlProps {
  name: string;
  label: string;
}

function FormInput({ name, label, ...inputProps }: Props) {
  const [field, meta] = useField(name);

  return (
    <Form.Group controlId={name}>
      <Form.Label>{label}</Form.Label>
      <InputGroup hasValidation>
        <Form.Control isInvalid={!!meta.error && meta.touched} {...field} {...inputProps} />
        <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
}

export default FormInput;
