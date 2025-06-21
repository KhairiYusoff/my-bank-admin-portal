import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { setupInactivityTimer, INACTIVITY_TIMEOUT, WARNING_TIMEOUT } from "@/features/auth/store/sessionUtils";

interface SessionTimeoutProps {
  onLogout: () => void;
  warningTime?: number; // in seconds
  logoutTime?: number; // in seconds
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({
  onLogout,
  // Convert ms to seconds for the countdown display
  warningTime = WARNING_TIMEOUT / 1000,
  logoutTime = INACTIVITY_TIMEOUT / 1000
}) => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(warningTime);
  const [countdown, setCountdown] = useState<NodeJS.Timeout | null>(null);

  // Handle logout
  const handleLogout = useCallback(() => {
    setOpen(false);
    if (countdown) {
      clearInterval(countdown);
      setCountdown(null);
    }
    onLogout();
  }, [countdown, onLogout]);

  // Handle stay logged in
  const handleStayLoggedIn = useCallback(() => {
    setOpen(false);
    if (countdown) {
      clearInterval(countdown);
      setCountdown(null);
    }
  }, [countdown]);

  useEffect(() => {
    const cleanup = setupInactivityTimer(
      // Logout callback
      handleLogout,
      // Warning callback
      () => {
        setOpen(true);
        setTimeLeft(warningTime);
        
        // Start countdown
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              handleLogout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        setCountdown(timer);
      }
    );

    return () => {
      cleanup();
      if (countdown) clearInterval(countdown);
    };
  }, [onLogout, warningTime]);



  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Dialog open={open}>
      <DialogTitle>Session Timeout</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your session is about to expire due to inactivity. You will be logged out in {timeLeft} seconds.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} color="primary">
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
