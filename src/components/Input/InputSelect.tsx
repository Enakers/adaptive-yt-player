import { observer } from 'mobx-react-lite';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useStore } from '~/store/StoreProvider';

function InputSelect() {
  const { inputStore } = useStore();

  return (
    <Container>
      <h4 className="text-center">Please select an input method</h4>
      <Row>
        <Col>
          <Card role="button" onClick={() => inputStore.setInputMethod('switch')}>
            <Card.Img variant="top" src="/switch.png" alt="Switch symbol" />
            <Card.Body>
              <Card.Title className="text-center">Switch</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card role="button" onClick={() => inputStore.setInputMethod('eye gaze')}>
            <Card.Img variant="top" src="/eye.png" alt="Eye symbol" />
            <Card.Body>
              <Card.Title className="text-center">Eye gaze</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card role="button" onClick={() => inputStore.setInputMethod('mouse')}>
            <Card.Img variant="top" src="/mouse.png" alt="Computer mouse symbol" />
            <Card.Body>
              <Card.Title className="text-center">Mouse</Card.Title>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card role="button" onClick={() => inputStore.setInputMethod('touch')}>
            <Card.Img variant="top" src="/touch.png" alt="Touch symbol" />
            <Card.Body>
              <Card.Title className="text-center">Touch</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default observer(InputSelect);
