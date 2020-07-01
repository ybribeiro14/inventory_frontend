import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, Input } from '@rocketseat/unform';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Container, Content, SubmitButton } from './styles';
import api from '../../services/api';
import history from '../../services/history';

const logo = require('../../assets/img/inventario.png');

const schema = Yup.object().shape({
  email: Yup.string().required('O login é obrigatório'),
  oldPassword: Yup.string().required('A senha atual é obrigatória'),
  newPassword: Yup.string().required('Nova senha é obrigatória'),
  passwordConfirmation: Yup.string().required(
    'Confimar a nova senha é obrigatório'
  ),
});

export default function ChangePassword() {
  const [dados, setDados] = useState({
    login: '',
    oldPassword: '',
    newPassword: '',
    passwordConfirmation: '',
    loading: false,
  });

  async function handleSubmit({
    login,
    oldPassword,
    newPassword,
    passwordConfirmation,
  }) {
    if (newPassword === oldPassword) {
      setDados({
        oldPassword: '',
        newPassword: '',
        passwordConfirmation: '',
      });
      toast.error('Nova senha está igual a senha atual!');
      return;
    }
    if (newPassword !== passwordConfirmation) {
      setDados({
        passwordConfirmation: '',
      });
      toast.error('Nova senha está diferente da confirmação de nova senha!');
      return;
    }

    await api
      .put('/users', {
        login,
        oldPassword,
        password: newPassword,
      })
      .then(el => {
        if (el.status === 200) {
          toast.success('Senha alterada com sucesso!');
        }
        history.push('/');
      })
      .catch(err => {
        if (err.response.status === 401) {
          setDados({
            login: '',
            oldPassword: '',
            newPassword: '',
            passwordConfirmation: '',
          });

          toast.error(
            'Não foi possível alterar a senha. Verifique os seus dados!'
          );
        }
      });
  }

  return (
    <Container>
      <Content>
        <img src={logo} alt="Logo" />
        <h1>Alterar Senha</h1>
        <Form schema={schema} onSubmit={handleSubmit}>
          <Input
            name="login"
            type="text"
            placeholder="Seu login"
            value={dados.login}
            onChange={text => setDados({ email: text.value })}
          />
          <Input
            name="oldPassword"
            type="password"
            placeholder="Senha atual"
            value={dados.oldPassword}
            onChange={text => setDados({ oldPassword: text.value })}
          />
          <Input
            name="newPassword"
            type="password"
            placeholder="Nova Senha"
            value={dados.newPassword}
            onChange={text => setDados({ newPassword: text.value })}
          />
          <Input
            name="passwordConfirmation"
            type="password"
            placeholder="Confirmar Nova Senha"
            value={dados.passwordConfirmation}
            onChange={text => setDados({ passwordConfirmation: text.value })}
          />
          <SubmitButton loginLoading={dados.loading}>
            {dados.loading ? <FaSpinner color="#fff" size={14} /> : 'Alterar'}
          </SubmitButton>

          {/* <button type="submit">Alterar</button> */}
          <Link to="/">Voltar</Link>
        </Form>
      </Content>
    </Container>
  );
}
