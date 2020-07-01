import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Container, SubmitButton, Form, Input } from './styles';
import api from '../../services/api';

export default function Dashboard() {
  const [locator, setLocator] = useState('');
  const [description, setDescription] = useState('');
  const [ean, setEan] = useState('');
  const [lot, setLot] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const locatorRef = useRef(null);
  const eanRef = useRef(null);
  const lotRef = useRef(null);

  const profile = useSelector(state => state.user.profile);

  async function handleSubmit() {
    if (locator === '' || ean === '' || lot === '' || amount === '') {
      toast.error('Favor preencher todos os campos!');
      locatorRef.current.focus();
    } else {
      setLoading(true);

      const response = await api.post('register', {
        id_inventory: profile.id_feature,
        ean,
        locator,
        amount,
        user: profile.login,
      });

      if (response.data) {
        toast.success('Registro feito com sucesso!');
        locatorRef.current.focus();
        setLocator('');
        setDescription('');
        setEan('');
        setLot('');
        setAmount('');
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(
          'Houve um erro ao tentar registrar, favor tentar novamente!'
        );
      }
    }
  }

  async function checkLocator() {
    if (locator !== '') {
      const response = await api.post('check_locator', {
        idInventory: profile.id_feature,
        locator,
        user: profile.login,
      });

      if (response.data.statusCode !== 200) {
        locatorRef.current.focus();
        setLocator('');
        toast.error(response.data.error);
      }
    }
  }
  async function checkEan() {
    if (ean !== '') {
      const response = await api.post('check_ean', {
        ean,
      });
      if (response.data.statusCode !== 200) {
        eanRef.current.focus();
        setEan('');
        setDescription('');
        toast.error(response.data.error);
      } else {
        const desc = `${response.data.cod_product} - ${response.data.description}`;
        setDescription(desc);
      }
    } else {
      setDescription('');
    }
  }

  return (
    <Container>
      <Form>
        <h1>LOCALIZADOR</h1>
        <Input
          ref={locatorRef}
          name="locator"
          value={locator}
          onChange={event => setLocator(event.target.value)}
          onBlur={e => checkLocator()}
          disabled={loading}
        />

        <h1>EAN</h1>
        <Input
          ref={eanRef}
          name="ean"
          value={ean}
          onChange={text => setEan(text.target.value)}
          onBlur={e => checkEan()}
          disabled={loading}
        />

        <span>{description}</span>

        <h1>LOTE</h1>
        <Input
          ref={lotRef}
          name="lot"
          value={lot}
          onChange={text => setLot(text.target.value)}
          disabled={loading}
        />

        <h1>QUANTIDADE</h1>
        <Input
          name="amount"
          value={amount}
          onChange={text => setAmount(text.target.value)}
          disabled={loading}
        />

        <SubmitButton loginLoading={loading} onClick={handleSubmit}>
          {loading ? <FaSpinner color="#fff" size={14} /> : 'Registrar'}
        </SubmitButton>
      </Form>
    </Container>
  );
}
