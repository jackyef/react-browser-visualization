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
        <br />
        <div>Press <code>shift + \</code> to show the render clock</div>
      </Container>
    )
  }
}

export default Home;