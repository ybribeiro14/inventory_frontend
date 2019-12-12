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
  const [dados, setDados] = useState({
    locator: '',
    ean: '',
    lot: '',
    amount: '',
    loading: false,
  });

  function handleSubmit({ locator, ean, lot, amount }) {
    setDados({ loading: true });

    setDados({ loading: false });
  }

  return (
    <Container>
      <Form schema={schema} onSubmit={handleSubmit}>
        <h1>LOCALIZADOR</h1>
        <Input
          name="locator"
          value={dados.locator}
          onChange={text => setDados({ locator: text.value })}
        />

        <h1>EAN</h1>
        <Input
          name="ean"
          value={dados.ean}
          onChange={text => setDados({ ean: text.value })}
        />

        <h1>LOTE</h1>
        <Input
          name="lot"
          value={dados.lot}
          onChange={text => setDados({ lot: text.value })}
        />

        <h1>QUANTIDADE</h1>
        <Input
          name="amount"
          value={dados.amount}
          onChange={text => setDados({ amount: text.value })}
        />

        <SubmitButton loginLoading={dados.loading}>
          {dados.loading ? <FaSpinner color="#fff" size={14} /> : 'Acessar'}
        </SubmitButton>
      </Form>
    </Container>
  );
}
