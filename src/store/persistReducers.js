import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: 'webgrade',
      storage,
      whitelist: ['auth', 'user', 'ean'],
    },
    reducers
  );

  return persistedReducer;
};
