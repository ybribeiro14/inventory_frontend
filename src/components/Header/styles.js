import styled from 'styled-components';

export const Container = styled.div`
  background: #fff;
  padding: 0 15px;
`;
export const Content = styled.div`
  height: 64px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    align-items: center;

    img {
      margin-right: 10px;
      height: 50px;
      padding-right: 5px;
      border-right: 1px solid #eee;
    }

    strong {
      display: block;
      color: #2e6ca4;
      font-size: 16px;
    }

    small {
      display: block;
      color: #2e6ca4;
      font-size: 12px;
    }
  }

  aside {
    display: flex;
    align-items: center;
  }
`;

export const Profile = styled.div`
  display: flex;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #eee;
  align-items: center;

  div {
    text-align: right;
    margin-right: 10px;

    strong {
      display: block;
      color: #2e6ca4;
    }

    small {
      display: block;
      margin-top: 2px;
      font-size: 12px;
      color: #2e6ca4;
    }
  }

  button {
    margin: 5px 0 0;
    height: 40px;
    border: 0;
    background: #d44059;
    border-radius: 8px;
    height: 44px;
    padding: 0 15px;
    color: white;
    font-size: 16px;
  }
`;
