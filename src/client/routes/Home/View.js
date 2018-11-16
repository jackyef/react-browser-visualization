import React, { Component } from 'react';

import { Container } from './styles';

class Home extends Component {
  render() { 
    const { history } = this.props;

    return (
      <Container>
        <button onClick={() => history.push('/hook')}>Go to /hook</button>
        <br />
        <button onClick={() => history.push('/not-hook')}>Go to /not-hook</button>
      </Container>
    )
  }
}

export default Home;