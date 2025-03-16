import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import { theme } from './styles/theme';
import Navbar from './components/Navbar';
import About from './pages/About';
import { SeedInput } from './components/SeedInput';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${theme.colors.primary.charcoalBlack};
    min-height: 100vh;
    font-family: ${theme.typography.fontFamily.primary};
    display: flex;
    justify-content: center;
  }

  * {
    box-sizing: border-box;
  }

  #root {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
  }
`;

const StatusContainer = styled.div`
  background-color: ${theme.colors.primary.deepSpaceGray};
  padding: 0.5rem;
  border-radius: 8px;
  margin: 0;
  width: 100%;
  color: ${theme.colors.primary.white};
  font-family: ${theme.typography.fontFamily.primary};
`;

const StatusTitle = styled.h2`
  color: ${theme.colors.primary.white};
  font-family: ${theme.typography.fontFamily.secondary};
  margin-bottom: 0.5rem;
`;

const StatusText = styled.pre`
  color: ${theme.colors.primary.white};
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  padding: 0.5rem;
  background-color: ${theme.colors.primary.charcoalBlack};
  border-radius: 4px;
  max-height: 600px;
  min-height: 300px;
  overflow-y: auto;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${theme.colors.primary.charcoalBlack};
  border-radius: 4px;
  overflow: visible;
  margin-bottom: 1rem;
  position: relative;
`;

const ProgressBarFill = styled.div<{ $progress: number; $error?: boolean }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background-color: ${props => props.$error ? '#ff4444' : theme.colors.primary.green};
  transition: width 0.3s ease-in-out, background-color 0.3s ease-in-out;
  border-radius: 4px;
  position: relative;
`;

const StatusIcon = styled.div<{ $progress: number; $error?: boolean }>`
  position: absolute;
  top: -8px;
  left: ${props => props.$progress}%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  background-color: ${theme.colors.primary.deepSpaceGray};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$error ? '#ff4444' : theme.colors.primary.green};
  font-size: 14px;
  transition: left 0.3s ease-in-out, color 0.3s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 2px solid ${props => props.$error ? '#ff4444' : theme.colors.primary.green};

  &::before {
    content: "${props => props.$error ? '✕' : props.$progress === 100 ? '🔓' : '🔒'}";
  }
`;

const AppWrapper = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.primary.charcoalBlack};
`;

const App: React.FC = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [statusLines, setStatusLines] = useState<string[]>([]);
  const [targetAddress, setTargetAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetAddress(value);
    
    if (value && !value.startsWith('r')) {
      setAddressError('XRPL address must start with "r"');
    } else {
      setAddressError('');
    }
  };

  const handleSubmit = async (seed: string, selectedPositions: number[], seedType: string) => {
    if (!targetAddress) {
      setAddressError('Please enter the target XRPL address');
      return;
    }
    
    if (!targetAddress.startsWith('r')) {
      setAddressError('Invalid XRPL address format (should start with "r")');
      return;
    }

    setAddressError('');
    setProgress(0);
    setHasError(false);
    
    // Sort the selected positions in numerical order
    const sortedPositions = [...selectedPositions].sort((a, b) => a - b);
    
    setIsRecovering(true);
    setStatusLines(['Starting recovery process...']);

    try {
      const response = await fetch('http://localhost:5001/start-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partial_seed: seed,
          missing_positions: sortedPositions,
          seed_type: seedType,
          target_address: targetAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start recovery process');
      }

      const data = await response.json();
      setStatusLines(prev => [...prev, data.message]);
    } catch (error) {
      setStatusLines(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Failed to start recovery'}`]);
      setIsRecovering(false);
    }
  };

  useEffect(() => {
    let intervalId: number;
    let maxAttempts = 0;

    if (isRecovering) {
      intervalId = window.setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5001/status');
          const data = await response.json();
          
          // Check completion status first
          const isComplete = data.output.some((line: string) => 
            line.startsWith('Success!')
          );
          
          const hasFailed = data.output.some((line: string) => 
            line.startsWith('Recovery Failed!')
          ) || data.status === 'Failed';
          
          // Find the progress line first to extract attempt count
          const progressLine = data.output.find((line: string) => 
            line.startsWith('Progress:')
          );
          
          if (progressLine) {
            const attemptMatch = progressLine.match(/Attempts:\s*([\d,]+)\/(\d+)/);
            if (attemptMatch) {
              const currentAttempts = parseInt(attemptMatch[1].replace(/,/g, ''));
              maxAttempts = Math.max(maxAttempts, currentAttempts);
            }
          }

          // Now process the output and update status
          let currentSection: string[] = [];
          const sections: string[] = [];

          data.output.forEach((line: string) => {
            // Start a new section for status messages
            if (line === 'Starting recovery process...' || line === 'In Recovery Process...' || line === 'Recovery Failed!' || line === 'Recovery Complete!') {
              if (currentSection.length > 0) {
                sections.push(currentSection.join('\n'));
              }
              // Use the correct status message based on completion
              if (line === 'In Recovery Process...' && isComplete) {
                currentSection = ['Recovery Complete!'];
              } else if (line === 'In Recovery Process...' && hasFailed) {
                currentSection = ['Recovery Failed!'];
              } else {
                currentSection = [line];
              }
              return;
            }

            // Format progress line
            if (line.startsWith('Progress:')) {
              const progressMatch = line.match(/Progress:\s*([\d.]+)%/);
              const attemptsMatch = line.match(/Attempts:\s*([\d,]+)\/(\d+)/);
              const elapsedMatch = line.match(/Elapsed:\s*([\d.]+)s/);
              const speedMatch = line.match(/Speed:\s*([\d.]+)\/s/);
              const etaMatch = line.match(/ETA:\s*([\d.]+)s/);
              
              if (progressMatch && attemptsMatch) {
                const progress = parseFloat(progressMatch[1]);
                const attempts = parseInt(attemptsMatch[1].replace(/,/g, ''));
                const total = parseInt(attemptsMatch[2].replace(/,/g, ''));
                const elapsed = elapsedMatch ? parseFloat(elapsedMatch[1]) : 0;
                const speed = speedMatch ? parseFloat(speedMatch[1]) : 0;
                const eta = etaMatch ? parseFloat(etaMatch[1]) : 0;
                const displayAttempts = Math.max(attempts, maxAttempts);
                
                // Format based on completion status
                if (hasFailed) {
                  currentSection.push(
                    `Progress: ${progress.toFixed(2)}%`,
                    `Attempts: ${displayAttempts.toLocaleString()}/${total.toLocaleString()}`,
                    `Elapsed: ${elapsed.toFixed(1)}s`
                  );
                } else if (isComplete) {
                  currentSection.push(
                    `Progress: 100.00%`,
                    `Attempts: ${displayAttempts.toLocaleString()}/${total.toLocaleString()}`,
                    `Elapsed: ${elapsed.toFixed(1)}s`
                  );
                } else {
                  currentSection.push(
                    `Progress: ${progress.toFixed(2)}%`,
                    `Attempts: ${displayAttempts.toLocaleString()}/${total.toLocaleString()}`,
                    `Speed: ${Math.round(speed).toLocaleString()}/s`,
                    `Elapsed: ${elapsed.toFixed(1)}s | ETA: ${eta.toFixed(1)}s`
                  );
                }
                return;
              }
            }
            // Format total combinations to include commas
            else if (line.startsWith('Total possible combinations:')) {
              const match = line.match(/Total possible combinations:\s*(\d+)/);
              if (match) {
                const total = parseInt(match[1]);
                currentSection.push(`Total possible combinations: ${total.toLocaleString()}`);
                return;
              }
            }
            // Format completion/success message
            else if (line.startsWith('Success!')) {
              currentSection.push('', line);
              return;
            }
            // Add all other lines as is
            currentSection.push(line);
          });

          // Add the last section
          if (currentSection.length > 0) {
            sections.push(currentSection.join('\n'));
          }

          // Join all sections with double newlines and split back into array
          setStatusLines(sections.join('\n\n').split('\n'));
          
          // Extract progress percentage
          if (progressLine) {
            const match = progressLine.match(/Progress:\s*([\d.]+)%/);
            if (match) {
              setProgress(parseFloat(match[1]));
            }
          }
          
          if (isComplete || hasFailed) {
            setIsRecovering(false);
            if (isComplete) {
              setProgress(100);
              setHasError(false);
            }
            if (hasFailed) {
              setHasError(true);
            }
            window.clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Failed to fetch status:', error);
          setHasError(true);
          setIsRecovering(false);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isRecovering]);

  return (
    <Router>
      <GlobalStyle />
      <AppWrapper>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <SeedInput
              onSubmit={handleSubmit}
              targetAddress={targetAddress}
              onAddressChange={handleAddressChange}
              addressError={addressError}
            />
          } />
          <Route path="/about" element={<About />} />
        </Routes>
        {(isRecovering || statusLines.length > 0) && (
          <StatusContainer>
            <StatusTitle>Recovery Status</StatusTitle>
            <ProgressBarContainer>
              <ProgressBarFill $progress={progress} $error={hasError} />
              <StatusIcon $progress={progress} $error={hasError} />
            </ProgressBarContainer>
            <StatusText>
              {statusLines.join('\n')}
            </StatusText>
          </StatusContainer>
        )}
      </AppWrapper>
    </Router>
  );
};

export default App;
