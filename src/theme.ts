import { createTheme } from '@mui/material';

// Professional banking color palette with limited colors
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Primary brand blue
      light: 'rgba(25, 118, 210, 0.08)', // For hover states
      dark: '#115293', // For active/pressed states
      contrastText: '#fff',
    },
    text: {
      primary: '#1f2937', // Dark gray for text
      secondary: '#6b7280', // Medium gray for secondary text
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    action: {
      hover: 'rgba(25, 118, 210, 0.08)',
      selected: 'rgba(25, 118, 210, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#115293',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.18)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },
      },
    },
  },
});
