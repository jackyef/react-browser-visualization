import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';

import { triggerJank } from '../../helpers';
import { Container } from './styles';
import Wallpaper from '../../components/Wallpaper';

window.prevDoHeavyStuff = undefined;

const HookView = ({ history }) => {
  // counter 1 region
  const [counter, setCounter] = useState(0);
  const incrementCounter = () => {
    setCounter(counter + 1);
  };

  useLayoutEffect(() => {
    if (counter) {
      triggerJank(5000);
    }

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
    if (counter2) {
      triggerJank(5000);
    }

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
  });

  const toggleInfiniteSetState = () => {
    console.log('toggled isInfinite');
    setInfinite(!isInfinite);
  }
  
  const doHeavyStuff = useCallback(() => {
    triggerJank(5000);
    window.prevDoHeavyStuff = doHeavyStuff;
    console.log('heavy stuff done');
  }, [1]);

  console.log('same reference as previous?', window.prevDoHeavyStuff === doHeavyStuff)

  return (
    <Container>
      <h1>Using Hook</h1>
      <button onClick={() => history.push('/not-hook')}>go to class component version</button> <br/>
      <button onClick={incrementCounter}>trigger jank with useLayoutEffect(): {counter}</button> <br/>
      <button onClick={incrementCounter2}>trigger jank with useEffect(): {counter2}</button> <br />
      <button onClick={toggleInfiniteSetState}>infinite setState: {isInfinite ? 'ON' : 'OFF'}</button> <br />
      <button onClick={doAsyncStuff}>{asyncData.loading ? 'loading...' : 'do async stuffs'}</button> <br />
      {asyncData.success && !asyncData.loading ? 'success' : ''}
      <button onClick={doHeavyStuff}>Save current doHeavyStuff() reference to window object</button> <br />
      <Wallpaper />
    </Container>
  )
}

export default HookView;