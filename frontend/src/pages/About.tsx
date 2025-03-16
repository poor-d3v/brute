import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const Container = styled.div`
  background-color: ${theme.colors.primary.charcoalBlack};
  padding: 2rem;
  border-radius: 12px;
  width: 800px;
  margin: 2rem auto;
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  color: ${theme.colors.primary.white};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: 2rem;
  text-align: center;
`;

const Content = styled.div`
  color: ${theme.colors.primary.white};
  font-family: ${theme.typography.fontFamily.primary};
  line-height: 1.6;
`;

const About: React.FC = () => {
  return (
    <Container>
      <Title>About Brute</Title>
      <Content>
        <p>Coming soon...</p>
      </Content>
    </Container>
  );
};

export default About; 