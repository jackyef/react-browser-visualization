import styled from 'react-emotion';

export const Container = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  min-height: 100vh;
  background: #e0e0e0;
  font-size: 24px;

  > button:active {
    filter: brightness(120%);
  }

  > button {
    height: 48px;
    font-size: 18px;
    border-radius: 4px;
    color: white;
    background: #22a559;
    border: none;
    outline: none;

    > a {
      color: white;
      text-decoration: none;
    }
  }
`;
