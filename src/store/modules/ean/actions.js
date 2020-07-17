export function insertEanList(ean, locator) {
  return {
    type: '@ean/INSERT_EAN_LIST',
    payload: { ean, locator },
  };
}

export function deleteEanList(position) {
  return {
    type: '@ean/DELETE_EAN_LIST',
    payload: position,
  };
}

export function clearData() {
  return {
    type: '@ean/CLEAR_DATA',
  };
}
