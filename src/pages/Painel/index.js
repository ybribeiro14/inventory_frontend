import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import { CSVLink } from 'react-csv';

import {
  Container,
  DivTable,
  SubmitButton,
  TextModal,
  Input,
  SpanAlertError,
  DivModalButton,
  SubmitButtonYesNo,
  Select,
  DivSelect,
} from './styles';
import Table from '../../components/Table';

import { updateProfileFeatureStat } from '../../store/modules/user/actions';

import api from '../../services/api';

const headers = [
  {
    key: 'id_feature',
    label: 'ID INV.',
  },
  {
    key: 'locator',
    label: 'LOCALIZADOR',
  },
  {
    key: 'first_ean',
    label: 'EAN 1º CONTAGEM',
  },
  {
    key: 'first_amount',
    label: 'QTD 1º CONTAGEM',
  },
  {
    key: 'first_user',
    label: 'USUÁRIO 1º CONTAGEM',
  },
  {
    key: 'second_ean',
    label: 'EAN 2º CONTAGEM',
  },
  {
    key: 'second_amount',
    label: 'QTD 2º CONTAGEM',
  },
  {
    key: 'second_user',
    label: 'USUÁRIO 2º CONTAGEM',
  },
  {
    key: 'third_ean',
    label: 'EAN 3º CONTAGEM',
  },
  {
    key: 'third_amount',
    label: 'QTD 3º CONTAGEM',
  },
  {
    key: 'third_user',
    label: 'USUÁRIO 3º CONTAGEM',
  },
  {
    key: 'fourth_ean',
    label: 'EAN 4º CONTAGEM',
  },
  {
    key: 'fourth_amount',
    label: 'QTD 4º CONTAGEM',
  },
  {
    key: 'fourth_user',
    label: 'USUÁRIO 4º CONTAGEM',
  },
];

function Painel() {
  const [show, setShow] = useState(false);
  const [type, setType] = useState(null);
  const [name, setName] = useState('');
  const [job, setJob] = useState('Administrativo');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [userId, setUserId] = useState('');
  const [featureId, setFeatureId] = useState('');
  const [users, setUsers] = useState([]);
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensageError, setMensageError] = useState(false);

  const profile = useSelector(state => state.user.profile);

  const jobRef = useRef(null);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const loginRef = useRef(null);

  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = async typeModal => {
    setType(typeModal);
    if (typeModal === 'vincularUser') {
      const response = await api.get('users');

      if (response.data) {
        setUsers(response.data);
      }

      const responseFeatures = await api.get('get_features');

      if (responseFeatures.data) {
        setFeatures(responseFeatures.data);
      }
    }

    if (typeModal === 'changeCount') {
      if (Number(profile.feature.stat) === 4) {
        toast.error(
          'Este inventário já está na 4º contagem, não é possível mais alterar.'
        );
        return;
      }
    }
    setShow(true);
  };

  const handleSubmitCreateUser = async () => {
    if (name === '' || job === '' || password === '' || login === '') {
      setMensageError('Favor informar todos os campos.');
      nameRef.current.focus();
    } else {
      const response = await api.post('users', {
        name,
        job,
        password,
        login,
      });

      if (response.data.statusCode !== 200) {
        setLogin('');
        toast.error(response.data.error);
      } else {
        setLogin('');
        setName('');
        setPassword('');
        setJob('Administrativo');
        setMensageError('');
        toast.success('Usuário criado com sucesso');
        handleClose();
      }
    }
  };

  const handleSubmitUpdateUser = async () => {
    if (userId === '' || featureId === '') {
      setMensageError('Favor informar todos os campos.');
    } else {
      const response = await api.post('vinc_user_feature', {
        id_feature: featureId,
        id: userId,
      });

      if (response.data.statusCode !== 200) {
        setLogin('');
        toast.error(response.data.error);
      } else {
        setLogin('');
        setName('');
        setPassword('');
        setJob('Administrativo');
        setMensageError('');
        toast.success('Usuário vinculado com sucesso');
        handleClose();
      }
    }
  };
  const handleSubmitChangeCount = async () => {
    const response = await api.post('change_stat', {
      id_feature: profile.feature.id,
    });

    if (response.data.statusCode !== 200) {
      toast.error(response.data.error);
    } else {
      setMensageError('');
      await dispatch(updateProfileFeatureStat(response.data.result.stat));
      toast.success('Contagem alterada com sucesso!!');
      handleClose();
    }
  };

  useEffect(() => {
    async function loadCounts() {
      const response = await api.get(`stat_counts/${profile.feature.id}`);

      setData(response.data.listCounts);
    }

    loadCounts();
  }, []);

  function handleChange(event) {
    setJob(event.target.value);
  }

  return (
    <>
      <Container>
        <DivTable>
          <Table />
        </DivTable>

        <SubmitButton onClick={() => handleShow('createUser')}>
          Criar Usuário
        </SubmitButton>
        <SubmitButton onClick={() => handleShow('vincularUser')}>
          Vincular Usuário
        </SubmitButton>
        <SubmitButton onClick={() => handleShow('changeCount')}>
          Alterar Contagem
        </SubmitButton>
        <CSVLink data={data} headers={headers}>
          Gerar CSV
        </CSVLink>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Body>
            {type === 'createUser' ? (
              <>
                <TextModal>Criar Usuário</TextModal>
                <Input
                  ref={nameRef}
                  name="name"
                  value={name}
                  onChange={text => setName(text.target.value)}
                  disabled={loading}
                  type="text"
                  placeholder="Informe o nome..."
                />
                <Input
                  ref={loginRef}
                  name="login"
                  value={login}
                  onChange={text => setLogin(text.target.value)}
                  disabled={loading}
                  type="text"
                  placeholder="Informe o login..."
                />
                <Select
                  ref={jobRef}
                  name="job"
                  value={job}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Administrativo">Administrativo</option>
                  <option value="Conferente">Conferente</option>
                </Select>
                <Input
                  ref={passwordRef}
                  name="password"
                  value={password}
                  onChange={text => setPassword(text.target.value)}
                  disabled={loading}
                  type="password"
                  placeholder="Informe a senha..."
                />
              </>
            ) : type === 'vincularUser' ? (
              <>
                <TextModal>Vincular Usuário</TextModal>
                <DivSelect>
                  <span>Usuário: </span>
                  <Select
                    name="user"
                    value={userId}
                    onChange={text => setUserId(text.target.value)}
                    disabled={loading}
                  >
                    {users.map(user => (
                      <>
                        <option value={user.id}>
                          {user.id_feature
                            ? `${user.name} (Vinculado ao invetário: ${user.id_feature})`
                            : user.name}
                        </option>
                      </>
                    ))}
                  </Select>
                </DivSelect>
                <DivSelect>
                  <span>Inventário: </span>
                  <Select
                    name="feature"
                    value={featureId}
                    onChange={text => setFeatureId(text.target.value)}
                  >
                    {features.map(feature => (
                      <>
                        <option
                          value={feature.id}
                        >{`${feature.id} - ${feature.client}`}</option>
                      </>
                    ))}
                  </Select>
                </DivSelect>
              </>
            ) : type === 'changeCount' ? (
              <>
                <TextModal>{`Tem certeza que deseja alterar para a ${Number(
                  profile.feature.stat
                ) + 1}º Contagem?`}</TextModal>
              </>
            ) : (
              ''
            )}

            <SpanAlertError>{mensageError}</SpanAlertError>
          </Modal.Body>
          <DivModalButton>
            <>
              <SubmitButtonYesNo onClick={handleClose} model={0}>
                Cancelar
              </SubmitButtonYesNo>
              {type === 'createUser' ? (
                <>
                  <SubmitButtonYesNo model={1} onClick={handleSubmitCreateUser}>
                    Gravar
                  </SubmitButtonYesNo>
                </>
              ) : type === 'vincularUser' ? (
                <>
                  <SubmitButtonYesNo model={1} onClick={handleSubmitUpdateUser}>
                    Vincular
                  </SubmitButtonYesNo>
                </>
              ) : type === 'changeCount' ? (
                <>
                  <SubmitButtonYesNo
                    model={1}
                    onClick={handleSubmitChangeCount}
                  >
                    Alterar
                  </SubmitButtonYesNo>
                </>
              ) : (
                ''
              )}
            </>
          </DivModalButton>
        </Modal>
      </Container>
    </>
  );
}

export default Painel;
