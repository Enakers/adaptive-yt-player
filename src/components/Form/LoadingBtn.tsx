import { Button, ButtonProps, Spinner } from 'react-bootstrap';

interface Props extends ButtonProps {
  isLoading: boolean;
}

function LoadingBtn({ isLoading, children, ...btnProps }: Props) {
  return (
    <Button variant="success" disabled={isLoading} {...btnProps} type="submit">
      {isLoading ? <Spinner animation="border" size="sm" /> : children ?? 'submit'}
    </Button>
  );
}

export default LoadingBtn;
