'use client';

import React from 'react';
import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { useIsDarkMode } from '@/lib/theme';
import { glassModalStyles } from '@/lib/theme/glass';

interface GlassModalProps extends Omit<DialogProps, 'title'> {
  title?: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
  onClose: () => void;
}

export function GlassModal({
  open,
  onClose,
  title,
  subtitle,
  actions,
  showCloseButton = true,
  children,
  maxWidth = 'sm',
  ...props
}: GlassModalProps) {
  const isDark = useIsDarkMode();
  const glassStyles = glassModalStyles(isDark);

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth={maxWidth}
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.9, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 20 },
            transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            sx: glassStyles,
          } as any}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: isDark
                  ? 'rgba(0, 0, 0, 0.7)'
                  : 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
              },
            },
          }}
          {...props}
        >
          {(title || showCloseButton) && (
            <DialogTitle
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                pb: subtitle ? 0 : 2,
              }}
            >
              <Box>
                {typeof title === 'string' ? (
                  <Typography variant="h5" component="span" fontWeight={600}>
                    {title}
                  </Typography>
                ) : (
                  title
                )}
                {subtitle && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
              {showCloseButton && (
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    ml: 2,
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </DialogTitle>
          )}
          <DialogContent sx={{ pt: title ? 2 : 0 }}>{children}</DialogContent>
          {actions && <DialogActions sx={{ px: 3, pb: 3 }}>{actions}</DialogActions>}
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default GlassModal;
