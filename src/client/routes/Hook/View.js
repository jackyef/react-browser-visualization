import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

import { triggerJank } from '../../helpers';
import { Container } from './styles';

const HookView = () => {
  // counter 1 region
  const [counter, setCounter] = useState(0);
  const incrementCounter = () => {
    setCounter(counter + 1);
    // incrementCounter2();
    // setTimeout(incrementCounter2, 100);
  };

  useLayoutEffect(() => {
    triggerJank(5000);

    // incrementCounter();

    console.log('counter effect called');

    return () => {
      console.log('counter effect cleanup called');
    }
  }, [counter]);

  // counter 2 region
  const [counter2, setCounter2] = useState(0);
  const incrementCounter2 = () => {
    console.log('counter 2 value', counter2);
    setCounter2(counter2 + 1);
  }

  useEffect(() => {
    triggerJank(5000);

    console.log('counter2 effect called');

    return () => {
      console.log('counter2 effect cleanup called');
    }
  }, [counter2]);

  // async stuff region
  const [asyncData, setAsyncData] = useState({ loading: false, success: false });
  const doAsyncStuff = () => {
    if (!asyncData.loading) {
      setAsyncData({ ...asyncData, loading: true });
      
      setTimeout(() => {
        setAsyncData({ ...asyncData, loading: false, success: true });
      }, 1000);
    }
  }

  useEffect(() => {
    console.log('async effect called');

    return () => {
      console.log('async effect cleanup called');
    }
  }, [asyncData.loading]);

  // infinite setState region
  const [isInfinite, setInfinite] = useState(false);

  useEffect(() => {
    if (isInfinite) {
      console.log('infinite effect called...');
      triggerJank();
      setInfinite(true);
    }
  })

  const toggleInfiniteSetState = () => {
    console.log('toggled isInfinite');
    setInfinite(!isInfinite);
  }

  return (
    <Container>
      <h1>Hook</h1>
      <button><Link to="/not-hook">go to non-hook version</Link></button> <br/>
      <button onClick={incrementCounter}>increment counter: {counter}</button> <br/>
      <button onClick={incrementCounter2}>increment counter2: {counter2}</button> <br />
      <button onClick={toggleInfiniteSetState}>infinite setState: {isInfinite ? 'ON' : 'OFF'}</button> <br />
      <button onClick={doAsyncStuff}>{asyncData.loading ? 'loading...' : 'do async stuffs'}</button> <br />
      {asyncData.success && !asyncData.loading ? 'success' : ''}
    </Container>
  )
}

export default HookView;