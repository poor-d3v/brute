import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const Container = styled.div`
  background-color: ${theme.colors.primary.charcoalBlack};
  padding: 2rem 2rem 2rem;
  border-radius: 12px;
  width: 800px;
  margin: 1rem auto 2rem;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.secondary};
  color: ${theme.colors.primary.white};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: 5rem;
  text-align: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  background-color: ${theme.colors.primary.deepSpaceGray};
  border: 2px solid ${theme.colors.secondary.electricBlue};
  border-radius: 8px;
  padding: 1rem;
  color: ${theme.colors.primary.white};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.green};
  }

  option {
    background-color: ${theme.colors.primary.deepSpaceGray};
    color: ${theme.colors.primary.white};
  }
`;

const Label = styled.label`
  color: ${theme.colors.primary.white};
  font-family: ${theme.typography.fontFamily.primary};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  background-color: ${theme.colors.primary.green};
  color: ${theme.colors.primary.white};
  font-family: ${theme.typography.fontFamily.primary};
  font-weight: ${theme.typography.fontWeight.bold};
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const VisualizationContainer = styled.div<{ $seedType?: string; $format?: 'words' | 'chars' }>`
  display: grid;
  gap: 0.5rem;
  margin: 0.75rem 0;
  justify-content: center;
  width: 100%;

  ${props => props.$format === 'words' && `
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
    & > * {
      justify-self: center;
    }
  `}

  ${props => props.$seedType === 'ed25519_seed' && `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    & > div:first-child {
      display: grid;
      grid-template-columns: repeat(15, 40px);
      gap: 0.5rem;
    }
    & > div:last-child {
      display: grid;
      grid-template-columns: repeat(16, 40px);
      gap: 0.5rem;
    }
  `}

  ${props => props.$seedType === 'secp256k1_seed' && `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    & > div:first-child {
      display: grid;
      grid-template-columns: repeat(14, 40px);
      gap: 0.5rem;
    }
    & > div:last-child {
      display: grid;
      grid-template-columns: repeat(15, 40px);
      gap: 0.5rem;
    }
  `}
`;

const BoxContainer = styled.div<{ $format: 'words' | 'chars' }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: ${props => props.$format === 'words' ? '120px' : '40px'};
`;

const SelectionTag = styled.div<{ $selected: boolean; $hasValue: boolean; $isTrash?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => 
    props.$isTrash ? theme.colors.primary.deepSpaceGray :
    props.$selected ? '#ff4444' : 
    props.$hasValue ? theme.colors.primary.green :
    theme.colors.secondary.electricBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.$isTrash ? '14px' : '12px'};
  color: ${theme.colors.primary.white};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: -12px;
  border: 2px solid ${props => 
    props.$isTrash ? theme.colors.secondary.graphite :
    props.$selected ? '#ff4444' : 
    props.$hasValue ? theme.colors.primary.green :
    theme.colors.secondary.electricBlue};

  &:hover {
    transform: scale(1.1);
    background-color: ${props => 
      props.$isTrash ? `${theme.colors.secondary.graphite}dd` :
      props.$selected ? '#ff6666' : 
      props.$hasValue ? `${theme.colors.primary.green}dd` :
      `${theme.colors.secondary.electricBlue}dd`};
  }

  &::before {
    content: ${props => 
      props.$isTrash ? '"🗑"' :
      props.$selected ? '"×"' : 
      props.$hasValue ? '"✓"' : 
      '"?"'};
  }
`;

const CharacterBox = styled.div<{ 
  $selected: boolean; 
  $isPrefix: boolean; 
  $hasValue: boolean;
  $isLastEdited: boolean;
}>`
  width: 100%;
  height: 40px;
  border: 3px solid ${props => 
    props.$isPrefix ? theme.colors.secondary.graphite :
    props.$selected ? '#ff4444' : 
    props.$isLastEdited ? theme.colors.primary.white :
    props.$hasValue ? theme.colors.primary.green :
    theme.colors.secondary.electricBlue};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary.white};
  font-family: ${theme.typography.fontFamily.primary};
  cursor: text;
  background-color: ${props => 
    props.$isPrefix ? theme.colors.primary.deepSpaceGray :
    props.$selected ? '#ff444433' : 
    props.$isLastEdited ? `${theme.colors.primary.white}22` :
    props.$hasValue ? `${theme.colors.primary.green}33` :
    theme.colors.primary.deepSpaceGray};
  position: relative;
  transition: all 0.2s ease;
  padding: 0 4px;
`;

const CharacterInput = styled.input`
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  color: ${theme.colors.primary.white};
  text-align: center;
  font-size: 1rem;
  outline: none;
  caretColor: ${theme.colors.primary.green};
  cursor: text;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  &:disabled {
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${theme.colors.secondary.graphite};
  }
`;

const InfoText = styled.p`
  color: ${theme.colors.secondary.graphite};
  font-family: ${theme.typography.fontFamily.primary};
  text-align: center;
  margin: 0.5rem 0;
`;

const ErrorText = styled.p`
  color: #ff4444;
  font-family: ${theme.typography.fontFamily.primary};
  text-align: center;
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

const InfoContainer = styled.div`
  margin-top: 0.5rem;
`;

const Description = styled.span`
  color: ${theme.colors.secondary.graphite};
  font-size: 0.9rem;
  font-style: italic;
`;

const WordCountSelect = styled(Select)`
  margin-top: 1rem;
`;

const AddressInput = styled(Select)`
  &::placeholder {
    color: ${theme.colors.secondary.graphite};
  }
`;

const AnimatedCharacter = styled.span<{ $delay: number }>`
  display: inline-block;
  position: relative;
  color: ${theme.colors.primary.white};
  opacity: 0;
  animation: appear 0.1s ${props => props.$delay}s forwards;

  &::before {
    content: attr(data-char);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    animation: spin 0.6s ${props => props.$delay}s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    color: ${theme.colors.primary.white};
  }

  @keyframes appear {
    to {
      opacity: 1;
    }
  }

  @keyframes spin {
    0%, 50% {
      content: "A";
    }
    4% {
      content: "X";
    }
    8% {
      content: "9";
    }
    12% {
      content: "K";
    }
    16% {
      content: "3";
    }
    20% {
      content: "W";
    }
    24% {
      content: "7";
    }
    28% {
      content: "M";
    }
    32% {
      content: "4";
    }
    36% {
      content: "Y";
    }
    40% {
      content: "8";
    }
    44% {
      content: "J";
    }
    48% {
      content: "2";
    }
    52% {
      content: "H";
    }
    56% {
      content: "5";
    }
    60% {
      content: attr(data-final);
      transform: translateY(-5px);
    }
    80% {
      transform: translateY(2px);
    }
    100% {
      content: attr(data-final);
      transform: translateY(0);
    }
  }
`;

const AnimatedTitle = styled(Title)`
  display: flex;
  justify-content: center;
  margin: 0 auto 6rem;
  width: 100%;
  text-align: center;
`;

const DecryptingTitle: React.FC = () => {
  const text = "Seed   Recovery   Tool";
  
  return (
    <AnimatedTitle>
      {text.split('').map((char, index) => (
        <AnimatedCharacter 
          key={index} 
          $delay={index * 0.1}
          data-char={char}
          data-final={char}
          style={{ marginRight: char === ' ' ? '0.5rem' : '0' }}
        >
          {char}
        </AnimatedCharacter>
      ))}
    </AnimatedTitle>
  );
};

interface SeedInputProps {
  onSubmit: (seed: string, selectedPositions: number[], seedType: string) => void;
  targetAddress: string;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addressError: string;
}

type SeedType = {
  label: string;
  prefix: string;
  format: string;
  description: string;
  validation: RegExp;
  algorithm?: 'ed25519' | 'secp256k1';
};

const SEED_TYPES: Record<string, SeedType> = {
  secp256k1_seed: {
    label: 'secp256k1 Seed (s...)',
    prefix: 's',
    format: 'base58',
    description: 'Base58-encoded seed for secp256k1 key pair (starts with "s")',
    validation: /^s[1-9A-HJ-NP-Za-km-z]{28,29}$/,
    algorithm: 'secp256k1'
  },
  ed25519_seed: {
    label: 'Ed25519 Seed (sEd...)',
    prefix: 'sEd',
    format: 'base58',
    description: 'Base58-encoded seed for Ed25519 key pair (starts with "sEd")',
    validation: /^sEd[1-9A-HJ-NP-Za-km-z]{28,29}$/,
    algorithm: 'ed25519'
  },
  mnemonic: {
    label: 'BIP39 Mnemonic',
    prefix: '',
    format: 'words',
    description: '12 or 24 words that can be used to derive keys',
    validation: /^([a-zA-Z]+\s){11,23}[a-zA-Z]+$/
  }
};

const SEED_LENGTHS = {
  secp256k1_seed: 29, // s + 28 chars
  ed25519_seed: 31,   // sEd + 28 chars
  mnemonic_12: 12,    // 12 words
  mnemonic_24: 24     // 24 words
} as const;

type SeedLengthKey = keyof typeof SEED_LENGTHS;

interface PartialSeed {
  [position: number]: string;
}

export const SeedInput: React.FC<SeedInputProps> = ({ onSubmit, targetAddress, onAddressChange, addressError }) => {
  const [partialSeed, setPartialSeed] = useState<PartialSeed>({});
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  const [seedType, setSeedType] = useState('');
  const [wordCount, setWordCount] = useState<12 | 24>(12);
  const [error, setError] = useState('');
  const [focusedPosition, setFocusedPosition] = useState<number | null>(null);
  const [lastEditedPosition, setLastEditedPosition] = useState<number | null>(null);

  const handleSeedTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setSeedType(newType);
    setSelectedPositions([]);
    setError('');
    setFocusedPosition(null);

    // Reset and pre-fill seed with prefix
    const newPartialSeed: PartialSeed = {};
    if (newType === 'secp256k1_seed') {
      newPartialSeed[0] = 's';
    } else if (newType === 'ed25519_seed') {
      newPartialSeed[0] = 's';
      newPartialSeed[1] = 'E';
      newPartialSeed[2] = 'd';
    }
    setPartialSeed(newPartialSeed);
  };

  const handleWordCountChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setWordCount(parseInt(e.target.value) as 12 | 24);
    setPartialSeed({});
    setSelectedPositions([]);
  };

  const getSeedLengthKey = (type: string): SeedLengthKey => {
    if (type === 'mnemonic') {
      return `mnemonic_${wordCount}` as SeedLengthKey;
    }
    return type as SeedLengthKey;
  };

  const handleCharacterInput = (position: number, value: string) => {
    // Don't allow modifying prefix positions
    if ((seedType === 'secp256k1_seed' && position === 0) ||
        (seedType === 'ed25519_seed' && position <= 2)) {
      return;
    }

    const type = SEED_TYPES[seedType];
    
    if (type.format === 'words') {
      // For mnemonic words, allow full word input
      setPartialSeed(prev => ({
        ...prev,
        [position]: value.toLowerCase()
      }));

      // Auto-advance to next empty position after space or tab
      if ((value.endsWith(' ') || value.endsWith('\t')) && focusedPosition !== null) {
        const nextPosition = findNextEmptyPosition(focusedPosition + 1);
        if (nextPosition !== null) {
          setFocusedPosition(nextPosition);
        }
      }
      return;
    }

    // For character-based formats
    if (value.length > 0) {
      const lastChar = value[value.length - 1];
      setPartialSeed(prev => ({
        ...prev,
        [position]: lastChar
      }));
      setLastEditedPosition(position);

      // Auto-advance to next empty position
      const nextPosition = findNextEmptyPosition(position + 1);
      if (nextPosition !== null) {
        // Use setTimeout to ensure the focus change happens after the current input
        setTimeout(() => {
          const nextInput = document.getElementById(`char-input-${nextPosition}`);
          if (nextInput) {
            nextInput.focus();
          }
        }, 0);
      }
    }
  };

  const handleKeyDown = (position: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const type = SEED_TYPES[seedType];
    if (type.format === 'words') return; // Don't handle special keys for mnemonic format

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault(); // Prevent default backspace behavior
      
      // Clear current position
      if (partialSeed[position]) {
        setPartialSeed(prev => {
          const next = { ...prev };
          delete next[position];
          return next;
        });
      }
      
      // Move to previous position if backspace was pressed
      if (e.key === 'Backspace') {
        let prevPosition = position - 1;
        // Skip prefix positions
        while (prevPosition >= 0 && (
          (seedType === 'secp256k1_seed' && prevPosition === 0) ||
          (seedType === 'ed25519_seed' && prevPosition <= 2)
        )) {
          prevPosition--;
        }
        
        if (prevPosition >= 0 && !selectedPositions.includes(prevPosition)) {
          const prevInput = document.getElementById(`char-input-${prevPosition}`);
          if (prevInput) {
            prevInput.focus();
          }
        }
      }
    }
  };

  const findNextEmptyPosition = (startFrom: number): number | null => {
    const maxLength = SEED_LENGTHS[getSeedLengthKey(seedType)];
    for (let i = startFrom; i < maxLength; i++) {
      // Skip prefix positions
      if ((seedType === 'secp256k1_seed' && i === 0) ||
          (seedType === 'ed25519_seed' && i <= 2)) {
        continue;
      }
      if (!partialSeed[i] && !selectedPositions.includes(i)) {
        return i;
      }
    }
    return null;
  };

  const handleCharacterClick = (index: number) => {
    // Don't allow selecting prefix positions
    if ((seedType === 'secp256k1_seed' && index === 0) ||
        (seedType === 'ed25519_seed' && index <= 2)) {
      return;
    }

    // If there's a value in the position, clear it instead of marking as missing
    if (partialSeed[index]) {
      setPartialSeed(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      return;
    }

    // Toggle missing position
    setSelectedPositions(prev => 
      prev.includes(index)
        ? prev.filter(pos => pos !== index)
        : [...prev, index]
    );
  };

  const validateInput = () => {
    if (!seedType) {
      setError('Please select a seed type');
      return false;
    }

    const maxLength = SEED_LENGTHS[getSeedLengthKey(seedType)];
    
    // Check if we have either a character or a selection for each position
    for (let i = 0; i < maxLength; i++) {
      if (!partialSeed[i] && !selectedPositions.includes(i)) {
        setError('Please fill in or select all positions');
        return false;
      }
    }

    if (selectedPositions.length === 0) {
      setError('Please select at least one missing position');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateInput()) {
      const maxLength = SEED_LENGTHS[getSeedLengthKey(seedType)];
      const seedString = Array(maxLength)
        .fill('_')
        .map((_, i) => partialSeed[i] || '_')
        .join('');
      
      onSubmit(seedString, selectedPositions, seedType);
    }
  };

  const renderCharacterBoxes = () => {
    if (!seedType) return null;

    const type = SEED_TYPES[seedType];
    const maxLength = SEED_LENGTHS[getSeedLengthKey(seedType)];

    if (type.format === 'words') {
      return (
        <VisualizationContainer $format="words">
          {Array(maxLength).fill('_____').map((placeholder, index) => (
            <BoxContainer key={index} $format="words">
              <CharacterBox
                $selected={selectedPositions.includes(index)}
                $isPrefix={false}
                $hasValue={!!partialSeed[index]}
                $isLastEdited={lastEditedPosition === index}
              >
                <CharacterInput
                  type="text"
                  value={partialSeed[index] || ''}
                  onChange={(e) => handleCharacterInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => {
                    setFocusedPosition(index);
                    setLastEditedPosition(index);
                  }}
                  onBlur={() => {
                    setFocusedPosition(null);
                    setLastEditedPosition(null);
                  }}
                  placeholder="_____"
                  style={{ fontSize: '0.8rem' }}
                  disabled={selectedPositions.includes(index)}
                  spellCheck={false}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </CharacterBox>
              {!selectedPositions.includes(index) && (
                partialSeed[index] ? (
                  <SelectionTag
                    $selected={false}
                    $hasValue={true}
                    $isTrash={true}
                    onClick={() => handleCharacterClick(index)}
                  />
                ) : (
                  <SelectionTag
                    $selected={selectedPositions.includes(index)}
                    $hasValue={false}
                    onClick={() => handleCharacterClick(index)}
                  />
                )
              )}
              {selectedPositions.includes(index) && (
                <SelectionTag
                  $selected={true}
                  $hasValue={false}
                  onClick={() => handleCharacterClick(index)}
                />
              )}
            </BoxContainer>
          ))}
        </VisualizationContainer>
      );
    }

    // Handle character-based formats
    const boxes = Array(maxLength).fill('_').map((placeholder, index) => {
      const isPrefix = (seedType === 'secp256k1_seed' && index === 0) ||
                      (seedType === 'ed25519_seed' && index <= 2);

      return (
        <BoxContainer key={index} $format="chars">
          <CharacterBox
            $selected={selectedPositions.includes(index)}
            $isPrefix={isPrefix}
            $hasValue={!!partialSeed[index]}
            $isLastEdited={lastEditedPosition === index}
          >
            <CharacterInput
              type="text"
              value={partialSeed[index] || ''}
              onChange={(e) => handleCharacterInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => {
                setFocusedPosition(index);
                setLastEditedPosition(index);
              }}
              onBlur={() => {
                setFocusedPosition(null);
                setLastEditedPosition(null);
              }}
              maxLength={1}
              placeholder="_"
              disabled={selectedPositions.includes(index) || isPrefix}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              id={`char-input-${index}`}
            />
          </CharacterBox>
          {!isPrefix && !selectedPositions.includes(index) && (
            partialSeed[index] ? (
              <SelectionTag
                $selected={false}
                $hasValue={true}
                $isTrash={true}
                onClick={() => handleCharacterClick(index)}
              />
            ) : (
              <SelectionTag
                $selected={selectedPositions.includes(index)}
                $hasValue={false}
                onClick={() => handleCharacterClick(index)}
              />
            )
          )}
          {!isPrefix && selectedPositions.includes(index) && (
            <SelectionTag
              $selected={true}
              $hasValue={false}
              onClick={() => handleCharacterClick(index)}
            />
          )}
        </BoxContainer>
      );
    });

    if (seedType === 'ed25519_seed') {
      return (
        <VisualizationContainer $seedType={seedType}>
          <div>{boxes.slice(0, 15)}</div>
          <div>{boxes.slice(15)}</div>
        </VisualizationContainer>
      );
    }

    if (seedType === 'secp256k1_seed') {
      return (
        <VisualizationContainer $seedType={seedType}>
          <div>{boxes.slice(0, 14)}</div>
          <div>{boxes.slice(14)}</div>
        </VisualizationContainer>
      );
    }

    return (
      <VisualizationContainer $seedType={seedType}>
        {boxes}
      </VisualizationContainer>
    );
  };

  return (
    <Container>
      <DecryptingTitle />
      <InputContainer>
        <div>
          <Label htmlFor="seedType">Select Seed Type</Label>
          <Select
            id="seedType"
            value={seedType}
            onChange={handleSeedTypeChange}
          >
            <option value="">Select a type...</option>
            {Object.entries(SEED_TYPES).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          {seedType && (
            <InfoContainer>
              <Description>{SEED_TYPES[seedType].description}</Description>
              {seedType === 'mnemonic' && (
                <WordCountSelect
                  value={wordCount}
                  onChange={handleWordCountChange}
                >
                  <option value="12">12 words</option>
                  <option value="24">24 words</option>
                </WordCountSelect>
              )}
            </InfoContainer>
          )}
        </div>

        <div>
          <Label htmlFor="targetAddress">Target XRPL Address</Label>
          <AddressInput
            as="input"
            id="targetAddress"
            type="text"
            value={targetAddress}
            onChange={onAddressChange}
            placeholder="Enter the XRPL address you want to recover (starts with 'r')"
          />
          {addressError && <ErrorText>{addressError}</ErrorText>}
        </div>

        <div>
          <Label>Enter Known Characters and Select Missing Positions</Label>
          <VisualizationContainer>
            {renderCharacterBoxes()}
          </VisualizationContainer>
          <InfoText>
            Type in known characters and click positions to mark them as missing
          </InfoText>
        </div>

        {error && <ErrorText>{error}</ErrorText>}

        <Button onClick={handleSubmit}>
          Start Recovery
        </Button>
      </InputContainer>
    </Container>
  );
}; 