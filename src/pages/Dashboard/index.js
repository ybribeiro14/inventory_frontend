import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import {
  Container,
  SubmitButton,
  Form,
  Input,
  InventoryData,
  DivModalButton,
  SubmitButtonYesNo,
  TextModal,
  SpanAlertError,
} from './styles';
import List from '../../components/List/index';
import api from '../../services/api';
import validator from '../../plugins/validator';

import { updateProfileFeatureStat } from '../../store/modules/user/actions';
import { insertEanList, clearData } from '../../store/modules/ean/actions';

export default function Dashboard() {
  const [locator, setLocator] = useState('');
  const [description, setDescription] = useState('');
  const [ean, setEan] = useState('');
  const [lot, setLot] = useState('');
  const [serial, setSerial] = useState('');
  const [address, setAddress] = useState('');
  const [validateDate, setValidateDate] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showAlertEan, setShowAlertEan] = useState(false);
  const [inputAddress, setInputAddres] = useState(false);
  const [validAddress, setValidAddres] = useState(false);
  const [dataLocator, setDataLocator] = useState({});
  const [changeLocator, setChangeLocator] = useState(false);

  const locatorRef = useRef(null);
  const eanRef = useRef(null);
  const lotRef = useRef(null);
  const serialRef = useRef(null);
  const dateRef = useRef(null);
  const amountRef = useRef(null);
  const addressRef = useRef(null);

  const dispatch = useDispatch();

  const profile = useSelector(state => state.user.profile);
  const listEans = useSelector(state => state.ean.dataEans);
  const atualLocator = useSelector(state => state.ean.locator);
  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const checkStatInventory = await api.get(
      `/stat_feature/${profile.id_feature}`
    );

    if (checkStatInventory.data.stat !== profile.feature.stat) {
      toast.error(
        'Detectamos uma mudança de status nesse inventário, será necessário realizar a contagem novamente!'
      );

      dispatch(updateProfileFeatureStat(checkStatInventory.data.stat));
      dispatch(clearData());

      setLocator('');
      setEan('');
      locatorRef.current.focus();
    } else if (profile.feature.model === 3) {
      if (listEans.length === 0 || locator === '') {
        toast.error('Preencha todos os campos corretamente.');
      } else {
        setLoading(true);
        const payloadMod = {
          id_inventory: profile.id_feature,
          array_ean: listEans,
          locator,
          user: profile.login,
        };
        const response = await api.post('register', payloadMod);

        if (response.data) {
          toast.success('Registro feito com sucesso!');
          setLocator('');
          setEan('');
          dispatch(clearData());
          setLoading(false);
          locatorRef.current.focus();
        } else {
          setLoading(false);
          toast.error(
            'Houve um erro ao tentar registrar, favor tentar novamente!'
          );
        }
      }
    } else if (locator === '' || ean === '' || amount === '') {
      toast.error('Favor preencher todos os campos!');
      locatorRef.current.focus();
    } else {
      setLoading(true);
      const payload = {
        id_inventory: profile.id_feature,
        ean,
        locator,
        amount,
        user: profile.login,
      };
      if (profile.feature.collect_lot) {
        if (lot === '') {
          toast.error('Favor preencher todos os campos!');
          locatorRef.current.focus();
          return;
        }
        payload.lot = lot;
      }
      if (profile.feature.collect_serial) {
        if (serial === '') {
          toast.error('Favor preencher todos os campos!');
          locatorRef.current.focus();
          return;
        }
        payload.serial = serial;
      }
      if (inputAddress) {
        if (address === '') {
          toast.error('Favor preencher todos os campos!');
          locatorRef.current.focus();
          return;
        }
        payload.address = address;
      }
      if (profile.feature.collect_date) {
        if (validateDate === '') {
          toast.error('Favor preencher todos os campos!');
          locatorRef.current.focus();
          return;
        }

        const dateFormated = moment(validateDate).format('MM-DD-YYYY');
        payload.date_validate = dateFormated;
      }

      const response = await api.post('register', payload);

      if (response.data) {
        toast.success('Registro feito com sucesso!');
        locatorRef.current.focus();
        setLocator('');
        setDescription('');
        setEan('');
        setSerial('');
        setAddress('');
        setInputAddres(false);
        setLot('');
        setAmount('');
        setValidateDate('');
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(
          'Houve um erro ao tentar registrar, favor tentar novamente!'
        );
      }
    }
  }

  function validarData() {
    if (validateDate === '') {
      return;
    }
    if (validator.validate(validateDate)) {
      amountRef.current.focus();
    } else {
      toast.error(
        `Data "${moment(validateDate).format('DD/MM/YYYY')}" é inválida!`
      );
      setValidateDate('');
      dateRef.current.focus();
    }
  }

  const handleClose = () => {
    if (profile.feature.model !== 3) {
      setLocator('');
    } else {
      setLocator(atualLocator);
    }
    setShow(false);
    locatorRef.current.focus();
  };

  const handleCloseModalEan = () => {
    setShowAlertEan(false);
  };
  const clearDataEan = async () => {
    setEan('');
    await dispatch(clearData());
    handleClose();
  };

  const handleShow = () => setShow(true);

  async function checkLocator() {
    setInputAddres(false);
    setAddress('');
    if (locator !== '') {
      const response = await api.post('check_locator', {
        idInventory: profile.id_feature,
        locator,
        user: profile.login,
      });

      if (response.data.statusCode !== 200) {
        if (response.data.statusCode === 500 && profile.feature.empty_locator) {
          handleShow();
        } else {
          locatorRef.current.focus();
          setLocator('');
          toast.error(response.data.error);
        }
      } else {
        if (profile.feature.model === 2) {
          setDataLocator(response.data);
        }
        if (
          atualLocator &&
          profile.feature.model === 3 &&
          locator !== atualLocator
        ) {
          setChangeLocator(true);
          handleShow();
          return;
        }
        eanRef.current.focus();
      }
    }
  }

  const keyEnterLocator = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      checkLocator();
    }
  };

  async function checkEan() {
    if (ean.length > 14) {
      toast.error('EAN inválido, possui mais que 14 dígitos!');
      setEan('');
      setDescription('');
      return;
    }
    if (profile.feature.model !== 3) {
      if (!profile.feature.validate_ean) {
        if (profile.feature.model === 2 && dataLocator) {
          // Verificar se o EAN já foi contando neste local, nesta contagem. Correr array de EAN's se encontrar o EAN não permitir continuar;

          const eanFilter = dataLocator.eans.filter(eanBip => {
            return eanBip === ean;
          });

          if (eanFilter) {
            toast.error(
              `O EAN ${ean} já possui um registro neste local na atual contagem. Não é permitido registrá-lo novamente.`
            );

            setEan('');
            eanRef.current.focus();
            return;
          }
        }

        profile.feature.collect_lot
          ? lotRef.current.focus()
          : profile.feature.collect_serial
          ? serialRef.current.focus()
          : profile.feature.collect_date
          ? dateRef.current.focus()
          : amountRef.current.focus();

        return;
      }
      if (ean !== '') {
        const response = await api.post('check_ean', {
          ean,
          id_feature: profile.id_feature,
        });
        if (response.data.statusCode !== 200) {
          eanRef.current.focus();
          setEan('');
          setDescription('');
          toast.error(response.data.error);
        } else {
          const desc = `${response.data.cod_product} - ${response.data.description}`;
          setDescription(desc);

          if (profile.feature.model === 2) {
            // Verificar se o EAN já foi contando neste local, nesta contagem. Correr array de EAN's se encontrar o EAN não permitir continuar;

            const eanFilter = dataLocator.eans.filter(eanBip => {
              return eanBip === ean;
            });

            if (eanFilter.length > 0) {
              toast.error(
                `O EAN ${ean} já possui um registro neste local na atual contagem. Não é permitido registrá-lo novamente.`
              );

              setEan('');
              setDescription('');
              eanRef.current.focus();
              return;
            }
          }

          profile.feature.collect_lot
            ? lotRef.current.focus()
            : profile.feature.collect_serial
            ? serialRef.current.focus()
            : profile.feature.collect_date
            ? dateRef.current.focus()
            : amountRef.current.focus();
        }
      } else {
        setDescription('');
      }
    } else if (locator === '') {
      locatorRef.current.focus();
      setEan('');
      toast.error('Informe o localizador.');
    } else if (ean !== '') {
      if (profile.feature.same_ean) {
        const eanDifferent =
          listEans.length > 0
            ? listEans.filter(eanList => eanList.ean !== ean)
            : false;
        if (eanDifferent && eanDifferent.length !== 0) {
          setShowAlertEan(true);
          setEan('');
          return;
        }
      } else {
        const payload = {
          ean,
          id_feature: profile.id_feature,
          locator,
        };

        const response = await api.post('check_ean_locator', payload);

        if (response.data.statusCode !== 200) {
          setEan('');
          toast.error(response.data.error);
          return;
        }
      }

      await dispatch(insertEanList(ean, locator));
      setEan('');
    }
  }

  const keyEnterEan = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      checkEan();
    }
  };

  async function handleEmptyLocator() {
    if (address === '') {
      setValidAddres('O campo endereço não pode ser vazio!');
      return;
    }
    setShow(false);
    const payload = {
      id_feature: profile.id_feature,
      locator,
      amount: 0,
      address,
    };
    const response = await api.post('empty_locator', payload);

    if (response.data.statusCode) {
      locatorRef.current.focus();
      toast.error(response.data.error);
    } else {
      setInputAddres(true);
      toast.success('Localizador criado com sucesso!');
      eanRef.current.focus();
    }
  }

  return (
    <>
      <Container>
        <Form>
          <h1>LOCALIZADOR</h1>
          <Input
            ref={locatorRef}
            name="locator"
            value={locator}
            onChange={event => setLocator(event.target.value)}
            onBlur={() => checkLocator()}
            disabled={loading}
            onKeyDown={keyEnterLocator}
          />

          <h1>EAN</h1>
          <Input
            ref={eanRef}
            name="ean"
            value={ean}
            onChange={text => setEan(text.target.value)}
            onBlur={() => checkEan()}
            disabled={loading}
            type="number"
            onKeyDown={keyEnterEan}
          />

          <span>{description}</span>
          {profile.feature ? (
            profile.feature.collect_lot ? (
              <>
                <h1>LOTE</h1>
                <Input
                  ref={lotRef}
                  name="lot"
                  value={lot}
                  onChange={text => setLot(text.target.value)}
                  disabled={loading}
                  onBlur={() =>
                    profile.feature.collect_serial
                      ? serialRef.current.focus()
                      : profile.feature.collect_date
                      ? dateRef.current.focus()
                      : amountRef.current.focus()
                  }
                />
              </>
            ) : (
              ''
            )
          ) : (
            ''
          )}

          {profile.feature ? (
            profile.feature.collect_serial ? (
              <>
                <h1>SERIAL</h1>
                <Input
                  ref={serialRef}
                  name="serial"
                  value={serial}
                  onChange={text => setSerial(text.target.value)}
                  disabled={loading}
                  onBlur={() =>
                    profile.feature.collect_date
                      ? dateRef.current.focus()
                      : amountRef.current.focus()
                  }
                />
              </>
            ) : (
              ''
            )
          ) : (
            ''
          )}

          {profile.feature ? (
            profile.feature.collect_date ? (
              <>
                <h1>DATA DE VALIDADE</h1>
                <Input
                  ref={dateRef}
                  name="validateDate"
                  value={validateDate}
                  onChange={text => setValidateDate(text.target.value)}
                  disabled={loading}
                  onBlur={() => validarData()}
                  type="date"
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                />
              </>
            ) : (
              ''
            )
          ) : (
            ''
          )}
          {profile.feature.model === 3 ? (
            <>
              <h1>LISTA EANS</h1>
              <List />
              <br />
              <span>Total de Itens: {listEans.length}</span>
            </>
          ) : (
            <>
              <h1>QUANTIDADE</h1>
              <Input
                ref={amountRef}
                name="amount"
                value={amount}
                onChange={text => setAmount(text.target.value)}
                disabled={loading}
                type="number"
              />
            </>
          )}

          <SubmitButton loginLoading={loading} onClick={handleSubmit}>
            {loading ? <FaSpinner color="#fff" size={14} /> : 'Registrar'}
          </SubmitButton>
        </Form>
      </Container>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
          {changeLocator ? (
            <>
              <TextModal>
                Existem EANs bipados e não registrados, tem certeza que deseja
                mudar o local SEM salvar?
              </TextModal>
            </>
          ) : (
            <>
              <TextModal>
                {!inputAddress
                  ? 'Este localizador não foi encontrado na base do inventário, deseja incluir como um Localizador Vazio?'
                  : 'Informe o endereço do localizador vazio:'}
              </TextModal>
              {inputAddress ? (
                <>
                  <Input
                    ref={addressRef}
                    name="address"
                    value={address}
                    onChange={text => setAddress(text.target.value)}
                    disabled={loading}
                    onBlur={() => eanRef.current.focus()}
                  />
                  <SpanAlertError>{validAddress}</SpanAlertError>
                </>
              ) : (
                ''
              )}
            </>
          )}
        </Modal.Body>
        <DivModalButton>
          {!inputAddress && !changeLocator ? (
            <>
              <SubmitButtonYesNo onClick={handleClose} model={0}>
                Não
              </SubmitButtonYesNo>
              <SubmitButtonYesNo model={1} onClick={() => setInputAddres(true)}>
                Sim
              </SubmitButtonYesNo>
            </>
          ) : changeLocator ? (
            <>
              <SubmitButtonYesNo onClick={handleClose} model={0}>
                Não
              </SubmitButtonYesNo>
              <SubmitButtonYesNo model={1} onClick={clearDataEan}>
                Sim
              </SubmitButtonYesNo>
            </>
          ) : (
            <>
              <SubmitButtonYesNo model={1} onClick={handleEmptyLocator}>
                Salvar
              </SubmitButtonYesNo>
            </>
          )}
        </DivModalButton>
      </Modal>

      <Modal
        show={showAlertEan}
        onHide={handleCloseModalEan}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
          <TextModal>
            EAN Bipado é diferente dos EAN's da lista atual!! Não é permitido!
          </TextModal>
        </Modal.Body>
        <DivModalButton>
          <SubmitButtonYesNo onClick={handleCloseModalEan} model={0}>
            Voltar
          </SubmitButtonYesNo>
        </DivModalButton>
      </Modal>
      <InventoryData>
        <small>Cliente: {profile ? profile.feature.client : ''}</small>
        <small>Modelo: 0{profile ? profile.feature.model : ''}</small>
        {profile.feature.model === 2 || profile.feature.model === 3 ? (
          <>
            <small>Contagem atual: {profile.feature.stat}</small>
          </>
        ) : (
          ''
        )}
        <small>Desenvolvido por SBS Solutions</small>
      </InventoryData>
    </>
  );
}
