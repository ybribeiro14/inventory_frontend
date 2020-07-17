/* eslint-disable no-param-reassign */
import produce from 'immer';

const INITIAL_STATE = {
  dataEans: [],
  locator: null,
};

export default function user(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@ean/INSERT_EAN_LIST': {
        const tamanho = draft.dataEans.length;
        draft.dataEans.push({
          id: tamanho + 1,
          ean: action.payload.ean,
        });
        draft.locator = action.payload.locator;
        break;
      }
      case '@ean/DELETE_EAN_LIST': {
        let indexEan = '';
        draft.dataEans.map((dataEan, index) => {
          if (dataEan.id === action.payload) {
            indexEan = index;
          }
        });
        draft.dataEans.splice(indexEan, 1);
        if (draft.dataEans.length === 0) {
          draft.locator = null;
        }
        break;
      }
      case '@ean/CLEAR_DATA': {
        draft.dataEans = [];
        draft.locator = null;
        break;
      }
      default:
    }
  });
}
