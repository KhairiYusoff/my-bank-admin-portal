import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { setupInactivityTimer } from './sessionUtils';

interface SessionTimeoutProps {
  onLogout: () => void;
  warningTime?: number; // in seconds
  logoutTime?: number; // in seconds
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({
  onLogout,
  warningTime = 5 * 60, // 5 minutes
  logoutTime = 10 * 60, // 10 minutes
}) => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(warningTime);

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    const cleanup = setupInactivityTimer(
      () => {
        // Logout callback
        onLogout();
      },
      () => {
        // Show warning
        setOpen(true);
        setTimeLeft(warningTime);
        
        // Start countdown
        countdown = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              setOpen(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    );

    return () => {
      cleanup();
      if (countdown) clearInterval(countdown);
    };
  }, [onLogout, warningTime]);

  const handleStayLoggedIn = () => {
    setOpen(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Dialog open={open} onClose={() => {}}>
      <DialogTitle>Session Timeout Warning</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your session is about to expire due to inactivity. You will be logged out in {minutes}:{seconds.toString().padStart(2, '0')}.
          Would you like to stay logged in?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onLogout} color="primary">
          Logout Now
        </Button>
        <Button onClick={handleStayLoggedIn} color="primary" autoFocus>
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeout;
