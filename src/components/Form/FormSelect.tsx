import { useField } from 'formik';
import { Form } from 'react-bootstrap';

interface Props {
  name: string;
  label: string;
  children: React.ReactNode;
}

function FormSelect({ name, label, children }: Props) {
  const [field, meta] = useField(name);

  return (
    <Form.Group controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Select {...field} isInvalid={!!meta.error && meta.touched}>
        {children}
      </Form.Select>
      {meta.error && meta.touched ? (
        <Form.Label className="text-danger">{meta.error}</Form.Label>
      ) : null}
    </Form.Group>
  );
}

export default FormSelect;
