import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Clock from '../../components/Clock/Official';

import { Container } from './styles';

function HookView() {
  const [counter, setCounter] = useState(0);

  const incrementCounter = () => {
    console.log('incrementCounter called');
    setCounter(counter + 1);
  };

  useEffect(() => {
    console.log('effect called');
    incrementCounter();
  });

  return (
    <Container>
      Current counter: {counter}
      <button onClick={incrementCounter}>increment counter</button>
      <Clock />
    </Container>
  )
}

export default HookView;