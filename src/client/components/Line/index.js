
import React, { Component } from 'react';
import styled from 'react-emotion';

const Stick = styled.div`
  width: ${props => `${props.width}%`};
  height: 32px;
  border-radius: 4px;
  transition: width 1s linear;
  background: ${props => props.background};
`;

class Line extends Component {
  constructor(props) {
    super(props);

    this.prevTimestamp = new Date().getTime();
    this.color = {
      green: '#448842',
      red: '#cc1400',
      yellow: '#f1f441',
      orange: '#ffaa19',
    }
    this.state = {
      width: 0,
      color: this.color.green,
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.updateWidth, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateWidth = () => {
    const newTimestamp = new Date().getTime();
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
      width: 20 * Math.floor(newTimestamp / 1000) % 100,
      color: newColor,
    }, () => {
      this.prevTimestamp = newTimestamp;
    });
  }

  render() {
    const { width, color } = this.state;

    return (
      <Stick width={width} background={color} />
    )
  }
}

export default Line;
