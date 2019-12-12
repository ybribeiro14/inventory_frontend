import styled, { keyframes, css } from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 315px;
  text-align: center;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    input {
      background: rgba(255, 255, 255, 0.3);
      border: 0;
      border-radius: 8px;
      height: 44px;
      padding: 0 15px;
      color: white;
      margin: 0 0 10px;
      text-align: center;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    span {
      color: white;
      margin: 0 0 10px;
      font-size: 14px;
    }

    button {
      margin: 5px 0 0;
      height: 44px;
      border: 0;
      background: #2e6ca4;
      border-radius: 8px;
      height: 44px;
      padding: 0 15px;
      color: white;
      font-size: 16px;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.05, '#2e6ca4')};
      }
    }
  }

  a {
    color: white;
    margin-top: 15px;
    font-size: 16px;
    opacity: 0.8;

    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
    &:link {
      text-decoration: none;
    }
  }

  img {
    height: 170px;
    width: 250px;
  }

  h1 {
    color: #2e6ca4;
    font-size: 20px;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
}))`
  margin: 5px 0 0;
  height: 44px;
  border: 0;
  background: #608096;
  border-radius: 8px;
  height: 44px;
  padding: 0 15px;
  color: white;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: ${darken(0.05, '#608096')};
  }
  ${props =>
    props.loginLoading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;
