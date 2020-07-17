import { all } from 'redux-saga/effects';

// import history from '~/services/history';
// import api from '~/services/api';

// import { signInSuccess } from './actions';

// export function* signIn({ payload }) {
//   const { email, password } = payload;

//   const response = yield call(api.post, 'sessions', {
//     email,
//     password,
//   });

//   // console.log(response.data);

//   const { token, username } = response.data;

//   console.log(token, username);

//   yield put(signInSuccess(token, username));

//   history.push('/grade');
// }

export default all([]);
