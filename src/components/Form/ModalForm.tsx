import { ErrorMessage, Form, Formik } from 'formik';
import { useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import LoadingBtn from './LoadingBtn';

interface Props<T> {
  title: string;
  btnTitle?: string;
  initialValues: T & { error: any };
  onSubmit(values: T): Promise<void> | void;
  validationSchema?: any;
  children: React.ReactNode;
}

function ModalForm<T>({
  title,
  btnTitle,
  initialValues,
  onSubmit,
  validationSchema,
  children
}: Props<T>) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  return (
    <>
      <Button variant="primary" className="text-nowrap" onClick={() => setShow(true)}>
        {btnTitle ?? title}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>{title}</Modal.Header>

        <Formik
          initialValues={initialValues}
          onSubmit={async (v, { setErrors }) => {
            try {
              await onSubmit(v);
              handleClose();
            } catch (error: any) {
              setErrors({ error: error.message });
            }
          }}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <ErrorMessage name="error" render={err => <Alert variant="danger">{err}</Alert>} />
                {children}
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <LoadingBtn isLoading={isSubmitting} />
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default ModalForm;
