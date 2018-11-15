
import React, { Component } from 'react';
import styled from 'react-emotion';

const Container = styled.div`
  border-radius: 4px;
  background: #111110;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;

  > div {
    transition: transform 1s linear;
    background: ${props => props.background};
    transform: rotate(${props => props.tick * 360 / 100}deg);
    border: 4px solid #313130;
    border-radius: 50%;
    width: 30vw;
    height: 30vw;

    > div {
      width: 50%;
      height: 8px;
      background: #eaeaea;
      position: relative;
      left: 50%;
      top: calc(50% - 4px);
      border-radius: 4px;
    }
  }
`;

class Clock extends Component {
  constructor(props) {
    super(props);

    this.prevTimestamp = performance.now();
    this.updating = false;
    this.color = {
      green: '#448842',
      red: '#cc1400',
      yellow: '#f1f441',
      orange: '#ffaa19',
    }
    this.state = {
      tick: 0,
      color: this.color.green,
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.updateTick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateTick = () => {
    if (!this.updating) {
      this.updating = true;
      const newTimestamp = performance.now();
      const diff = newTimestamp - this.prevTimestamp;
      let newColor = this.color.green;
  
      if (diff > 2000) {
        newColor = this.color.red;
      } else if (diff > 1500) {
        newColor = this.color.orange;
      } else if (diff > 1100) {
        newColor = this.color.yellow;
      }
  
      console.log('diff', diff);
  
      this.setState({ 
        tick: this.state.tick + (30 * diff / 1000),
        color: newColor,
      }, () => {
        this.prevTimestamp = newTimestamp;
        this.updating = false;
      });
    }
  }

  render() {
    const { tick, color } = this.state;

    return (
      <Container tick={tick} background={color}>
        <div>
          <div />
        </div>
      </Container>
    )
  }
}

export default Clock;
