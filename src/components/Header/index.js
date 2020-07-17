import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import logo from '../../assets/img/inventario.png';

import { Container, Profile, Content } from './styles';

import { signOut } from '../../store/modules/auth/actions';

export default function Header() {
  const profile = useSelector(state => state.user.profile);

  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(signOut());
  }
  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="Inventory" />
          <div>
            <strong>INVENTÁRIO</strong>
            <small>CONTADOR</small>
          </div>
        </nav>
        <aside>
          <Profile>
            <div>
              <strong>{profile.name ? profile.name : ''}</strong>
              <small>{profile.job ? profile.job : ''}</small>
            </div>
            <button type="submit" onClick={handleLogout}>
              Sair
            </button>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
