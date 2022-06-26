import { Spinner } from 'react-bootstrap';

function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" />
    </div>
  );
}

export default Loader;
