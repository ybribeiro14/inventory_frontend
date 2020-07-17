import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { deleteEanList } from '../../store/modules/ean/actions';

import { TextList, Container, ButtonDelete } from './styles';

export default function SimpleList() {
  const eans = useSelector(state => state.ean.dataEans);

  const dispatch = useDispatch();

  function handleSubmitEan(id) {
    dispatch(deleteEanList(id));
  }
  return (
    <Container>
      <List component="nav" aria-label="main mailbox folders">
        {eans.map(eanList => (
          <>
            <ListItem key={eanList.id}>
              <ButtonDelete onClick={() => handleSubmitEan(eanList.id)}>
                <DeleteForeverIcon color="secondary" />
              </ButtonDelete>

              <TextList>{eanList.ean}</TextList>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </Container>
  );
}
