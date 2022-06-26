import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface Props {
  onConfirm(): void | Promise<void>;
  title?: string;
  content?: string;
}

function ConfirmModal({ onConfirm, title, content }: Props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleConfirm = async () => {
    await onConfirm();
    handleClose();
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShow(true)}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>{title ?? 'Are you sure?'}</Modal.Header>
        {content && <Modal.Body>{content}</Modal.Body>}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmModal;
