import { SxProps, Theme } from '@mui/material';

// Common table container styles
export const tableContainerStyles: SxProps<Theme> = {
  width: '100%',
  border: '1px solid rgba(224, 224, 224, 1)',
  borderRadius: 1,
  overflowY: 'hidden', // Prevent vertical scrolling
  '& .MuiTable-root': {
    width: '100%',
    tableLayout: 'fixed', // Ensure equal column distribution
  }
};

// Common table styles with borders
export const tableStyles: SxProps<Theme> = {
  borderCollapse: 'separate',
  borderSpacing: 0,
  width: '100%',
  tableLayout: 'fixed', // Force equal column distribution
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    padding: '16px',
    '&:last-child': {
      borderRight: 'none',
    }
  },
  '& .MuiTableHead-root': {
    backgroundColor: '#f5f5f5',
    '& .MuiTableCell-root': {
      fontWeight: 600,
      whiteSpace: 'nowrap',
      borderTop: '1px solid rgba(224, 224, 224, 1)',
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
      '&:first-of-type': {
        borderLeft: 'none',
      }
    }
  },
  '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
    borderBottom: 'none',
  }
};

// Paper wrapper styles
export const paperWrapperStyles: SxProps<Theme> = {
  width: '100%',
  backgroundColor: '#fff',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  borderRadius: 1,
  px: 0, // Remove horizontal padding
  mb: 2,
  overflow: 'hidden', // Ensure no scrolling at paper level
  '& .MuiTablePagination-root': {
    '& .MuiTablePagination-toolbar': {
      paddingLeft: 2,
      paddingRight: 2,
    },
    '& .MuiTablePagination-displayedRows': {
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    }
  }
};
