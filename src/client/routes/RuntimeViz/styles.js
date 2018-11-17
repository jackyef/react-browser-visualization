import styled, { css, keyframes } from 'react-emotion';

export const Container = styled.div`
  display: flex;
  padding: 0 16px;
  flex: 1 1 auto;
  overflow: hidden;
  flex-direction: column;
  min-height: 100vh;
  background: #e0e0e0;
  font-size: 24px;
  max-width: calc(100vw - 32px);

  button:active {
    filter: brightness(120%);
  }

  button {
    display: block;
    margin: 8px;
    padding: 16px;
    width: 100%;
    font-size: 18px;
    border-radius: 4px;
    color: white;
    border: none;
    outline: none;

    > a {
      color: white;
      text-decoration: none;
    }
  }
`;

export const backgroundRed = css`
  background: #bc031c;
  color: white;
`;

export const backgroundPurple = css`
  background: #700591;
  color: white;
`;

export const backgroundBlue = css`
  background: #154ca5;
  color: white;
`;

export const backgroundGreen = css`
  background: #22a559;
  color: white;
`;

export const backgroundOrange = css`
  background: #e87700;
  color: white;
`;

export const vizualizerContainer = css`
  display: flex;
  justify-content: center;
`;

export const row = css`
  display: flex;
  flex-direction: row;
  padding: 16px;
`;

export const column = css`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

export const fillRemaining = css`
  flex: 1 1 auto;
  overflow: scroll;
`;

export const userAction = css`
  width: 240px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 40px 16px 0 16px
`;

export const callStackClass = css`
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 4px solid gray;
  padding: 8px;
  border-radius: 8px;
  height: 60vh;
  overflow-y: scroll;
  flex-direction: column-reverse;
`;

export const TaskBlock = styled.div`
  border-radius: 4px;
  margin: 4px 0;
  width: -webkit-fill-available;
  background: ${props => props.color};
  border: 1px solid #e0e0e0;
  min-height: 48px;
  padding: 16px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const callQueueClass = css`
  margin: 8px;
  height: 60px;
  align-items: center;
  justify-content: flex-start;
  border: 4px solid gray;
  padding: 8px;
  border-radius: 8px;
  overflow-x: scroll;
  flex-direction: row;
  display: flex;
`;

export const QueueTaskBlock = styled.div`
  background: ${props => props.color};
  border-radius: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  height: 52px;
  color: white;
  margin-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

export const LoopImage = styled.img`
  width: 60px;
  height: 60px;
  margin: 24px;
  animation: ${rotate} ${props => props.rotateSpeed * 4 || '1000'}ms infinite linear;
  animation-play-state: ${props => props.animating ? 'running' : 'paused'};
`;

export const flexCenter = css`
  display: flex;
  align-items: center;
`;

export const width400 = css`
  width: 400px;
`;