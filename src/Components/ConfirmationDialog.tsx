import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  IconButton,
  Box,
  Slide,
  Typography,
} from "@mui/material";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import { forwardRef } from "react";
import type { TransitionProps } from "@mui/material/transitions";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface ConfirmationDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function ConfirmationDialog({
  open,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2.5 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton
            onClick={onCancel}
            disabled={loading}
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <FiX size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          textAlign="center"
          gap={2}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'error.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
                '50%': {
                  opacity: 0.8,
                  transform: 'scale(1.05)',
                },
              },
            }}
          >
            <FiAlertTriangle size={32} color="#fff" />
          </Box>
          
          <DialogContentText 
            sx={{ 
              fontSize: '1rem',
              color: 'text.primary',
              lineHeight: 1.6,
            }}
          >
            {message}
          </DialogContentText>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'center', gap: 1.5 }}>
        <Button 
          onClick={onCancel}
          disabled={loading}
          variant="outlined"
          size="large"
          sx={{ 
            minWidth: 100,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={loading}
          variant="contained"
          color="error"
          size="large"
          sx={{ 
            minWidth: 100,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
            }
          }}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
