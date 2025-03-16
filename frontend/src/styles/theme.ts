export const theme = {
  colors: {
    primary: {
      green: '#069420',
      charcoalBlack: '#121212',
      deepSpaceGray: '#1E1E1E',
      white: '#FFFFFF',
    },
    secondary: {
      electricBlue: '#0A74DA',
      graphite: '#333333',
    },
  },
  typography: {
    fontFamily: {
      primary: '"Roboto", sans-serif',
      secondary: '"Orbitron", sans-serif',
    },
    fontWeight: {
      regular: 400,
      bold: 700,
    },
  },
};

export type Theme = typeof theme; 