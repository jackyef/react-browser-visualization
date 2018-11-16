import React from 'react';
import styled from 'react-emotion';

const Container = styled.div`
  border-radius: 4px;
  height: 20vw;
  background: ${props => props.color};
  border: 1px solid black;
  box-shadow: 0px 2px 7px 0px #eaeaea;
`;

const Wallpaper = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  const color = `rgb(${r}, ${g}, ${b})`;

  return <Container color={color} />
}

export default Wallpaper;
