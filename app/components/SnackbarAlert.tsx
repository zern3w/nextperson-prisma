//'use client'

import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { AlertColor } from '@mui/material/Alert';

interface SnackbarAlertProps {
  snackbarOpen: boolean;
  handleSnackbarClose: () => void;
  snackbarMessage: string;
  snackbarSeverity: AlertColor;
}

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({ snackbarOpen, handleSnackbarClose, snackbarMessage, snackbarSeverity }) => (
  <Snackbar
    open={snackbarOpen}
    autoHideDuration={3000}
    onClose={handleSnackbarClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <Alert
      elevation={6}
      variant="filled"
      severity={snackbarSeverity}
      icon={<CheckRoundedIcon fontSize="inherit" />}
    >
      {snackbarMessage}
    </Alert>
  </Snackbar>
);

export default SnackbarAlert;
