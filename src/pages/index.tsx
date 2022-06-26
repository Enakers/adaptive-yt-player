import {observer} from 'mobx-react-lite';
import {Button, Col, Container, Form, Row, Table} from 'react-bootstrap';
import ConfirmModal from '~/components/ConfirmModal';
import ConfigForm from '~/components/Form/ConfigForm';
import InputSelect from '~/components/Input/InputSelect';
import {useStore} from '~/store/StoreProvider';

const Home = () => {
  const {inputStore, playlistStore} = useStore();

  return (
    <Container>
      <Row style={{rowGap: '3rem'}}>
        <Col xs={12} lg={6}>
          <h4 className="text-center">Configuration</h4>

          <div>
            Current method: {inputStore.inputOptions.method}
            <Button
              className="ms-3"
              variant="primary"
              onClick={() => inputStore.setInputMethod(undefined)}
            >
              Change
            </Button>
          </div>

          <Form.Group className="mt-3 mb-3">
            <Form.Check
              checked={inputStore.inputOptions.fixedPosition}
              label="Fixed input"
              onChange={e => inputStore.setPosition(e.target.checked)}
              id="fixed-position-checkbox"
            />
          </Form.Group>

          <Form.Group className="mt-3 mb-3" controlId="input-size-select">
            <Form.Label>Input size</Form.Label>
            <Form.Select
              value={inputStore.inputOptions.size}
              onChange={e => {
                // @ts-ignore
                inputStore.setSize(e.target.value);
              }}
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="dwell-time-input">
            <Form.Label>Dwell time (eye gaze)</Form.Label>
            <Form.Control
              type="number"
              value={inputStore.inputOptions.dwellTime}
              onChange={e => inputStore.setDwellTimer(parseInt(e.target.value))}
            />
          </Form.Group>

          {!inputStore.inputOptions.method && <InputSelect />}
        </Col>

        <Col xs={12} lg={6}>
          <h4 className="text-center">Configs</h4>

          <Table bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>Load</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {inputStore.configs.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td>
                    <Button variant="success" onClick={() => inputStore.loadConfig(c)}>
                      Load
                    </Button>
                  </td>
                  <td>
                    <ConfigForm
                      title="Update"
                      name={c.name}
                      loadOnInit={c.loadOnInit}
                      loadPlaylistPage={c.loadPlaylistPage ?? ''}
                      update
                    />
                  </td>
                  <td>
                    <ConfirmModal
                      onConfirm={async () => {
                        await inputStore.deleteConfig(c.name);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <ConfigForm name="" loadOnInit={false} loadPlaylistPage="" title="Create" />
        </Col>
      </Row>
    </Container>
  );
};

export default observer(Home);
