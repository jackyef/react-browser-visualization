
import React from 'react';
import styled from 'react-emotion';

import Clock from './Official';
import { triggerJank } from '../../helpers';

const Container = styled.div`
  width: 30vw;
  padding: 120px 16px 16px 16px;
  button:active {
    filter: brightness(120%);
  }

  button {
    margin-top: 32px;
    width: 100%;
    display: block;
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

const ClockContainer = () => {
  return (
    <Container>
      <Clock />
      <div>
        <button onClick={() => triggerJank(5000)}>Trigger Jank</button>
      </div>
    </Container>
  )
}

export default ClockContainer;
