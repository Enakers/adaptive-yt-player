import { observer } from 'mobx-react-lite';
import { Button, Container, Table } from 'react-bootstrap';
import * as yup from 'yup';
import ConfirmModal from '~/components/ConfirmModal';
import FormCheckbox from '~/components/Form/FormCheckbox';
import FormInput from '~/components/Form/FormInput';
import ModalForm from '~/components/Form/ModalForm';
import { useStore } from '~/store/StoreProvider';

const NON_DELETABLE_NAMES = ['30 seconds', 'indefinite'];

function ManageTimers() {
  const { timerStore } = useStore();

  return (
    <Container>
      <h4 className="text-center mb-5 mt-3">Manage timers</h4>
      <Table bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Default</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {timerStore.timers.map((t, i) => (
            <tr key={i}>
              <td>{t.name}</td>
              <td>{t.playtime / 1000} seconds</td>
              <td>
                {t.default ? (
                  <Button variant="success" disabled>
                    Default
                  </Button>
                ) : (
                  <Button variant="warning" onClick={() => timerStore.makeDefault(t.name)}>
                    Make default
                  </Button>
                )}
              </td>
              <td>
                {NON_DELETABLE_NAMES.includes(t.name) ? (
                  <Button variant="danger" disabled>
                    Not allowed
                  </Button>
                ) : (
                  <ConfirmModal
                    onConfirm={async () => {
                      await timerStore.delete(t);
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalForm
        initialValues={{ error: null, name: '', playtime: 0, default: false }}
        onSubmit={async v => {
          const { error, ...timer } = v;
          await timerStore.create(timer);
        }}
        validationSchema={yup.object({
          name: yup.string().required(),
          playtime: yup.number().positive()
        })}
        title="Create timer"
        btnTitle="Create"
      >
        <FormInput name="name" label="Timer name" />
        <FormInput name="playtime" label="Playtime (in seconds)" type="number" />
        <FormCheckbox name="default" label="Is default" />
      </ModalForm>
    </Container>
  );
}

export default observer(ManageTimers);
