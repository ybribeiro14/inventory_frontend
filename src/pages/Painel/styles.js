import styled, { keyframes, css } from 'styled-components';
import { darken } from 'polished';
import 'react-toastify/dist/ReactToastify.css';

export const Container = styled.div`
  max-width: 100%;

  margin: 20px 20px;
`;

export const DivTable = styled.div`
  max-width: 100%;
  background: #fff;
  border: 1px solid #2e6ca4;
  border-radius: 5px;
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
  disabled: props.loading,
}))`
  margin: 15px 15px 15px 0;
  height: 44px;
  border: 0;
  background: #2e6ca4;
  border-radius: 8px;
  font-weight: bold;
  height: 44px;
  padding: 0 15px;
  color: white;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: ${darken(0.05, '#2e6ca4')};
  }
  ${props =>
    props.loginLoading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;
export const TextModal = styled.h1`
  text-align: center;
  font-weight: bold;
  font-size: 26px;
  color: #2e6ca4;
`;

export const SpanAlertError = styled.span`
  color: #d44059;
  text-align: right;
  font-size: 14px;
`;

export const Input = styled.input`
  background: rgba(0, 0, 0, 0.1);
  border: 0;
  border-radius: 4px;
  height: 44px;
  padding: 0 15px;
  color: #2e6ca4;
  margin: 0 0 10px;
  text-align: center;
  align-items: center;
  width: 100%;
  font-size: 16px;

  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
`;

export const Select = styled.select`
  background: rgba(0, 0, 0, 0.1);
  border: 0;
  border-radius: 4px;
  height: 44px;
  padding: 0 15px;
  color: #2e6ca4;
  margin: 0 0 10px;
  text-align: center;
  align-items: center;
  width: 100%;
  font-size: 16px;
`;
export const DivModalButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px;
  width: 100%;
`;
export const SubmitButtonYesNo = styled.button`
  border: 0;
  ${props =>
    props.model === 0 ? 'background: #d44059;' : 'background: #2e6ca4;'}

  border-radius: 8px;
  font-weight: bold;
  height: 44px;
  padding: 0 15px;
  color: white;
  font-size: 16px;
  transition: background 0.2s;
  width: 100%;
  margin: 0 15px;
`;

export const DivSelect = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;

  span {
    color: #2e6ca4;
    text-align: center;
    font-size: 14px;
    margin-right: 10px;
  }
`;
