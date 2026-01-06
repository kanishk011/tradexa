'use client';

import React from 'react';
import { Snackbar, Alert, Slide, SlideProps } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useNotifications } from '@/lib/store/hooks';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export function GlobalNotifications() {
  const { notifications, latestNotification, hide } = useNotifications();

  if (!latestNotification) return null;

  return (
    <Snackbar
      open={!!latestNotification}
      autoHideDuration={latestNotification.autoHideDuration ?? 3000}
      onClose={() => hide(latestNotification.id)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={() => hide(latestNotification.id)}
        severity={latestNotification.severity}
        variant="filled"
        elevation={6}
        sx={{
          width: '100%',
          minWidth: 300,
          '& .MuiAlert-message': {
            fontWeight: 500,
          },
        }}
      >
        {latestNotification.message}
      </Alert>
    </Snackbar>
  );
}

export default GlobalNotifications;
