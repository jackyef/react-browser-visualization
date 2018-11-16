import React from 'react';
import { Link } from 'react-router-dom';

import { triggerJank } from '../../helpers';
import { Container } from './styles';
import Wallpaper from '../../components/Wallpaper';

class NotHookView extends React.Component {
  constructor(props) {
    super(props);

    this.isInfinite = false;
  }
  state = {
    counter: 0,
    counter2: 0,
    isInfinite: false,
    asyncData: {
      loading: false,
      success: false,
    },
  };

  componentDidUpdate(_, prevState) {
    const { isInfinite, counter2 } = this.state;

    if (isInfinite && this.isInfinite) {
      // requestAnimationFrame(() => {
      //   requestAnimationFrame(() => {
          triggerJank();
          this.setState({ isInfinite: true });
      //   });
      // });
    } else if (counter2 !== prevState.counter2) {
      // requestAnimationFrame(() => {
      //   requestAnimationFrame(() => {
          triggerJank(5000);
      //   });
      // });
    } else {
      triggerJank(5000);
    }
  }

  incrementCounterAfterNextPaint = () => {
    requestAnimationFrame(() => {
      console.log('browser painted');
      this.incrementCounterAfterNextPaint();
    });
  }

  incrementCounter = () => {
    this.setState({ counter: this.state.counter + 1 });
  }

  incrementCounter2 = () => {
    this.setState({ counter2: this.state.counter2 + 1 });
  }
  
  toggleInfiniteSetState = () => {
    this.setState({ isInfinite: !this.isInfinite });
    this.isInfinite = !this.isInfinite;
  }

  doAsyncStuff = () => {
    this.setState({ asyncData: { ...this.state.asyncData, loading: true } }, () => {
      setTimeout(() => {
        this.setState({ asyncData: { loading: false, success: true } });
      }, 1000);
    })
  }

  render() {
    const { counter, counter2, asyncData, isInfinite } = this.state;
    const { history } = this.props;
    const { incrementCounter, incrementCounter2, doAsyncStuff, toggleInfiniteSetState } = this;

    return (
      <Container>
        <h1>Not Hook</h1>
        <button onClick={() => history.push('/hook')}>go to hook version</button> <br/>
        <button onClick={incrementCounter}>increment counter: {counter}</button> <br/>
        <button onClick={incrementCounter2}>increment counter2: {counter2}</button> <br />
        <button onClick={toggleInfiniteSetState}>infinite setState: {isInfinite && this.isInfinite ? 'ON' : 'OFF'}</button> <br />
        <button onClick={doAsyncStuff}>{asyncData.loading ? 'loading...' : 'do async stuffs'}</button> <br />
        {asyncData.success && !asyncData.loading ? 'success' : ''}

        <Wallpaper />
      </Container>
    )
  }
}

export default NotHookView;