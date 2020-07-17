import { combineReducers } from 'redux';
import auth from './auth/reducer';
import user from './user/reducer';
import ean from './ean/reducer';

export default combineReducers({
  auth,
  user,
  ean,
});
