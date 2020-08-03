import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '../../../services/history';
import api from '../../../services/api';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { login, password } = payload;

    const response = yield call(api.post, 'sessions', {
      login,
      password,
    });

    const { token, user } = response.data;

    if (user.feature) {
      api.defaults.headers.Authorization = `Bearer ${token}`;

      yield put(signInSuccess(token, user));

      if (user.job === 'Administrativo') {
        history.push('/painel');
      } else {
        history.push('/dashboard');
      }
    } else {
      toast.error('Usuário informado não está vinculado a nenhum inventário.');
      yield put(signFailure());
    }
  } catch (err) {
    toast.error('Falha na autenticação, verifique seus dados');
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
  history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
