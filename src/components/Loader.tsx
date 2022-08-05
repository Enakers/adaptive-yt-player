import {Spinner} from "react-bootstrap";

interface Props {
  colour?: string;
}

function Loader({colour}: Props) {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner animation="border" variant={colour} />
    </div>
  );
}

export default Loader;
