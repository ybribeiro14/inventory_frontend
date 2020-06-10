import React, { useState } from 'react';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { FaSpinner } from 'react-icons/fa';
import { Container, SubmitButton } from './styles';
import api from '../../services/api';

const schema = Yup.object().shape({
  locator: Yup.string().required('O localizador é obrigatório'),
  ean: Yup.string().required('O EAN é obrigatório'),
  lot: Yup.string().required('O lote é obrigatório'),
  amount: Yup.string().required('A quantidade é obrigatória'),
});

export default function Dashboard() {
  const [locator, setLocator] = useState('');
  const [ean, setEan] = useState('');
  const [lot, setLot] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit({ locator, ean, lot, amount }) {
    console.log({
      locator,
      ean,
      lot,
      amount,
    });
  }

  return (
    <Container>
      <Form schema={schema} onSubmit={handleSubmit}>
        <h1>LOCALIZADOR</h1>
        <Input
          name="locator"
          value={locator}
          onChange={text => setLocator(text.value)}
        />

        <h1>EAN</h1>
        <Input name="ean" value={ean} onChange={text => setEan(text.value)} />

        <h1>LOTE</h1>
        <Input name="lot" value={lot} onChange={text => setLot(text.value)} />

        <h1>QUANTIDADE</h1>
        <Input
          name="amount"
          value={amount}
          onChange={text => setAmount(text.value)}
        />

        <SubmitButton loginLoading={loading}>
          {loading ? <FaSpinner color="#fff" size={14} /> : 'Acessar'}
        </SubmitButton>
      </Form>
    </Container>
  );
}
