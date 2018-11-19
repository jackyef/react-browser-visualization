import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  visualizerContainer,
  callStackClass,
  userAction,
  TaskBlock,
  row,
  column,
  backgroundBlue,
  backgroundOrange,
  backgroundGreen,
  backgroundRed,
  callQueueClass,
  QueueTaskBlock,
  fillRemaining,
  LoopImage,
  flexCenter,
  width400,
  padding8,
  padding16,
  marginLeft16,
  inputContainer,
  Code,
  alignSelfLeft,
} from './styles';

import refreshIcon from './assets/refresh-button.svg';

const createTask = (type = 'basic', title = '') => {
  let color;

  switch (type) {
    case 'basic':
      title = title || 'Basic Task';
      color = '#22a559';
      break;
    case 'timeout':
    case 'timeoutCallback':
      title = title || 'setTimeout(callback)';
      color = '#154ca5';
      break;
    case 'event':
    case 'eventCallback':
    case 'eventRemove':
      title = title || 'button.onClick(cb)';
      color = '#e87700';
      break;
    case 'render':
      title = title || 'Frame #1';
      color = '#700591';
      break;
  }

  return {
    type,
    title,
    color,
  };
};

const RuntimeVizView = () => {
  const [state, setState] = useState({
    callStack: [],
    callbackStack: [],
    environmentStack: [],
    renderQueue: [
      createTask('render', 'Frame #1'),
      createTask('render', 'Frame #2'),
      createTask('render', 'Frame #3'),
      createTask('render', 'Frame #4'),
      createTask('render', 'Frame #5'),
      createTask('render', 'Frame #6'),
      createTask('render', 'Frame #7'),
    ],
    renderQueueInfo: {
      text: '',
      type: '',
    },
    paused: true,
    tickSpeed: 300,
    tickCount: 0,
  });
  const tickTimeoutRef = useRef(null);

  const addTask = (type = 'basic', stack = 'call', title = '', number = 1) => {
    const createdTask = [];
    const newState = { ...state };

    for (let i = 0; i < number; i++) {
      createdTask.push(createTask(type, title));
    }

    if (stack === 'call') {
      newState.callStack = [...state.callStack, ...createdTask];
    } else if (stack === 'callback') {
      newState.callbackStack = [...state.callbackStack, ...createdTask];
    } else {
      newState.environmentStack = [...state.environmentStack, ...createdTask];
    }

    setState(newState);
    clearTimeout(tickTimeoutRef.current);
    tickTimeoutRef.current = null;
  };

  const _processTick = () => {
    const clonedCallStack = [...state.callStack];
    const clonedEnvironmentStack = [...state.environmentStack];
    const clonedCallbackStack = [...state.callbackStack];
    const clonedRenderQueue = [...state.renderQueue];
    let newRenderQueueInfo = { ...state.renderQueueInfo };
    let shiftedCallStackTask;

    console.log('tick count', state.tickCount);

    /*
      assume 1 tick = 4ms
      We'll try to enqueueRenderTask every 4 ticks
    */

    let tryToEnqueueRenderTask = state.tickCount % 4 === 0;
    let frameDropped = false;
    const isCallStackEmpty = clonedCallStack.length < 1;

    if (tryToEnqueueRenderTask) {
      // take out next frame render task
      const shiftedRenderQueue = clonedRenderQueue.shift();

      // generate task for next frame
      const newFrameNumber = Number(clonedRenderQueue[clonedRenderQueue.length - 1].title.split('#')[1]) + 1;

      clonedRenderQueue.push(createTask('render', `Frame #${newFrameNumber}`));

      if (isCallStackEmpty) {
        // enqueue render to main thread
        clonedCallStack.push(createTask('render', shiftedRenderQueue.title));
      } else {
        // drop frame
        frameDropped = true;
        newRenderQueueInfo.text = `${shiftedRenderQueue.title} dropped!`;
        newRenderQueueInfo.type = 'error';
      }
    }

    // move timeouts from environment thread to callback stack
    const removedEnvironmentTaskIndex = clonedEnvironmentStack.findIndex(task => task.type !== 'event');
    const removedEnvironmentTask = clonedEnvironmentStack[removedEnvironmentTaskIndex];
    let movedEnvironmentTask = false;

    if (removedEnvironmentTask) {
      const { type } = removedEnvironmentTask;

      clonedEnvironmentStack.splice(removedEnvironmentTaskIndex, 1);
      clonedCallbackStack.push(createTask(`${type}Callback`, `${type === 'event' ? 'click' : type}Callback()`));
      movedEnvironmentTask = true;
    }

    if (!tryToEnqueueRenderTask || frameDropped) {
      // only do this if we are not trying to enqueue render task
      // do the usual process
      // 1. Take oldest task from the main thread
      shiftedCallStackTask = clonedCallStack.shift();

      if (shiftedCallStackTask) {
        const { type } = shiftedCallStackTask;

        if (type === 'render' || type === 'basic') {
          // do nothing, we only need to pop it

          if (type === 'render') {
            newRenderQueueInfo.text = `${shiftedCallStackTask.title} painted!`;
            newRenderQueueInfo.type = 'success';
          }
        } else {
          // could be setTimeout or creating eventListener, or remove event listener
          if (type === 'eventRemove') {
            // if it's to remove event listener, we remove one eventListener in current environment stack
            const index = clonedEnvironmentStack.findIndex(task => task.type === 'event');

            if (index > -1) {
              clonedEnvironmentStack.splice(index, 1);
            }
          } else if (type.indexOf('Callback') < 0) {
            // if it isn't callback
            // queue it to the environment thread to handle it
            clonedEnvironmentStack.push(createTask(type));
          }
        }
      }

      // 2. enqueue task from callback task to main thread, if it's empty at the start at this tick
      if (isCallStackEmpty && !movedEnvironmentTask) {
        const shiftedCallbackStack = clonedCallbackStack.shift();

        if (shiftedCallbackStack) {
          const { type } = shiftedCallbackStack;

          clonedCallStack.push(createTask(type, `${type}()`));
        }
      }
    }

    setState({
      ...state,
      callStack: clonedCallStack,
      callbackStack: clonedCallbackStack,
      environmentStack: clonedEnvironmentStack,
      renderQueue: clonedRenderQueue,
      renderQueueInfo: newRenderQueueInfo,
      tickCount: state.tickCount + 1,
    });
  };

  const processTick = () => {
    if (!state.paused) {
      _processTick();
    }

    // clear timeout
    clearTimeout(tickTimeoutRef.current);
    tickTimeoutRef.current = null;
  };

  console.log('render');

  useEffect(() => {
    console.log('effect');
    if (!tickTimeoutRef.current) {
      tickTimeoutRef.current = setTimeout(processTick, state.tickSpeed);
    }

    return () => {
      console.log('cleanup');
      if (!tickTimeoutRef.current) {
        clearTimeout(tickTimeoutRef.current);
        tickTimeoutRef.current = null;
      }
    };
  });

  const handleOurButtonClick = () => {
    const numberOfListeners = state.environmentStack.filter(task => task.type === 'event').length;

    addTask('eventCallback', 'callback', 'clickCallback()', numberOfListeners);
  };

  const handleUpdateTickSpeed = e => {
    setState({
      ...state,
      tickSpeed: e.target.value,
    });
  };

  const handleTogglePlayPause = () => {
    setState({
      ...state,
      paused: !state.paused,
    });
    clearTimeout(tickTimeoutRef.current);
    tickTimeoutRef.current = null;
  };

  return (
    <Container>
      <h1>Browser process visualization</h1>
      <div className={visualizerContainer}>
        <div className={row}>
          <div className={userAction}>
            <button className={backgroundGreen} onClick={() => addTask('basic', 'call')}>
              Add Basic Task
            </button>
            <button className={backgroundBlue} onClick={() => addTask('timeout', 'call', 'setTimeout(callback)')}>
              Add <code>setTimeout(callback)</code>
            </button>
            <button className={backgroundOrange} onClick={() => addTask('event', 'call', 'button.onClick(cb)')}>
              Add onClick listener to button
            </button>
            <button
              className={backgroundOrange}
              onClick={() => addTask('eventRemove', 'call', 'button.removeOnClick(cb)')}
            >
              Remove onClick listener to button
            </button>
            <code>----------------</code>
            <br />
            <button className={backgroundRed} onClick={handleOurButtonClick}>
              Our button
            </button>
            <code>----------------</code>
            <br />
            <div className={alignSelfLeft}>Process tick rate:</div>
            <div className={inputContainer}>
              <input
                disabled={!state.paused}
                type="number"
                onChange={handleUpdateTickSpeed}
                value={state.tickSpeed}
                step={100}
                min={100}
              />
              <div>ms</div>
            </div>
            <button className={state.paused ? backgroundGreen : backgroundRed} onClick={handleTogglePlayPause}>
              {state.paused ? 'Play' : 'Pause'}
            </button>
          </div>
          <div className={`${column} ${width400}`}>
            <div>Main Thread</div>
            <div className={callStackClass}>
              {state.callStack.map((task, i) => (
                <TaskBlock key={i} color={task.color}>
                  <code>{task.title}</code>
                </TaskBlock>
              ))}
            </div>
          </div>

          <div className={`${column} ${fillRemaining} ${padding8} ${marginLeft16}`}>
            <div className={padding8}>Environment Thread</div>
            <div className={callQueueClass}>
              {state.environmentStack.map((task, i) => (
                <QueueTaskBlock key={i} color={task.color}>
                  <code>{task.title}</code>
                </QueueTaskBlock>
              ))}
            </div>
            <div className={padding8}>Callback queue</div>
            <div className={callQueueClass}>
              {state.callbackStack.map((task, i) => (
                <QueueTaskBlock key={i} color={task.color}>
                  <code>{task.title}</code>
                </QueueTaskBlock>
              ))}
            </div>
            <div className={`${flexCenter} ${padding8}`}>
              <LoopImage src={refreshIcon} animating={!state.paused} rotateSpeed={state.tickSpeed} />
              <code>Event Loop</code>
            </div>
            <div className={padding8}>Render queue</div>
            <div className={callQueueClass}>
              {state.renderQueue.map((task, i) => (
                <QueueTaskBlock key={i} color={task.color}>
                  <code>{task.title}</code>
                </QueueTaskBlock>
              ))}
            </div>
            <div className={padding16}>
              <Code type={state.renderQueueInfo.type}>{state.renderQueueInfo.text}</Code>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RuntimeVizView;
