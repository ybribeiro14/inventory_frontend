import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { FaSpinner } from 'react-icons/fa';
import { Container, Content, SubmitButton } from './styles';

import { signInRequest } from '../../store/modules/auth/actions';

const logo = require('../../assets/img/inventario.png');

const schema = Yup.object().shape({
  login: Yup.string().required('O usuário é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export default function Login() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  function handleSubmit({ login, password }) {
    dispatch(signInRequest(login, password));
  }

  return (
    <>
      <Container>
        <Content>
          <img src={logo} alt="Logo" />
          <h1>Gestão de Inventário</h1>

          <Form schema={schema} onSubmit={handleSubmit}>
            <Input name="login" type="text" placeholder="Seu usuário" />
            <Input name="password" type="password" placeholder="Sua senha" />
            <SubmitButton loginLoading={loading}>
              {loading ? <FaSpinner color="#fff" size={14} /> : 'Acessar'}
            </SubmitButton>
            {/* <Link to="/changepassword">Alterar Senha</Link> */}
          </Form>
        </Content>
      </Container>
    </>
  );
}
