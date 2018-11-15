import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Clock from '../../components/Clock/Official';

import { HomeContainer } from './styles';

import myWorker from './workers/myWorker';

class Home extends Component {
  constructor(props) {
    super(props);

    this.homeWorker = new WebWorker(myWorker);
    this.homeWorker.addEventListener('message', this.handleWorkerMessage);
    this.state = {
      workerData: 'idle',
      mainThread: 'not doing anything',
      inputText: '',
    };
  }

  handleInputChange = e => {
    for (let i = 0; i < 10000000; i++) {
      this.count += 1;
    }
    console.log('count', this.count);
    this.setState({ inputText: e.target.value });
  }

  handleWorkerMessage = e => {
    console.log('data dari worker', e.data);
    this.setState({ workerData: 'done!' });
  }

  handlePostMessage = () => {
    this.setState({ workerData: 'working on something hard...' });
    this.homeWorker.postMessage({ data: 'react worker', type: 'info' });
  }

  handleHardWork = () => {
    this.setState({ mainThread: 'working hard...' }, () => {
      for (let i = 0; i < 1000000000; i++) {
        this.count += 1;
      }
  
      this.setState({ mainThread: 'done!' })
    })
  }

  render() { 
    const { workerData, mainThread, inputText } = this.state;

    return (
      <HomeContainer>
        <div>
          Status:
          <pre>
            main thread: {mainThread} <br/>
            web worker: {workerData}
          </pre>
          <button onClick={this.handleHardWork}>Click me to do something taxing on main thread!</button>
          <button onClick={this.handlePostMessage}>Click me tell worker to do the same stuff!</button>
        </div>
        <input type="text" value={inputText} onChange={this.handleInputChange} />
        <Clock />
      </HomeContainer>
    )
  }
}

export default Home;