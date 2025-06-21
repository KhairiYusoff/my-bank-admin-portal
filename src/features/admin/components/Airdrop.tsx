import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  Tooltip,
  IconButton,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaidIcon from '@mui/icons-material/Paid';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import { LoadingButton } from '@mui/lab';
import { useAirdropMutation } from "@/features/admin/store/adminApi";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

interface AirdropFormData {
  accountNumber: string;
  amount: number;
  reference: string;
}

const airdropSchema = yup.object().shape({
  accountNumber: yup
    .string()
    .required('Account number is required')
    .matches(/^\d+$/, 'Account number must contain only numbers'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required')
    .test(
      'is-decimal',
      'Amount must have up to 2 decimal places',
      (value) => {
        if (!value) return true;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }
    ),
  reference: yup.string().required('Please provide a reference for tracking'),
});

const Airdrop = (): JSX.Element => {
  const [snackbarState, setSnackbarState] = React.useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [airdrop, { isLoading }] = useAirdropMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<AirdropFormData>({
    resolver: yupResolver(airdropSchema),
    mode: 'onChange',
    defaultValues: {
      accountNumber: '',
      amount: 0.01,
      reference: '',
    }
  });

  const onSubmit = async (formData: AirdropFormData): Promise<void> => {
    try {
      await airdrop({
        accountNumber: formData.accountNumber,
        amount: formData.amount,
        reference: formData.reference,
      }).unwrap();

      setSnackbarState({
        open: true,
        message: 'Airdrop successful!',
        severity: 'success',
      });
      reset();
    } catch (err: any) {
      setSnackbarState({
        open: true,
        message: err.data?.message || 'Failed to process airdrop',
        severity: 'error',
      });
    }
  };
  const handleCloseSnackbar = (): void => {
    setSnackbarState((prev: SnackbarState) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1a237e', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaidIcon sx={{ fontSize: 32 }} /> Airdrop Tokens
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ ml: 0.5 }}>
          Send tokens directly to a user's account. Please verify all details before submitting.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 300px' }, gap: 3, mb: 4 }}>
        <Card sx={{ bgcolor: '#e8f5e9', mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="success" /> Important Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Ensure the account number is active and valid
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Amount must be positive with up to 2 decimal places
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Reference is required for transaction tracking
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <Controller
              name="accountNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Account Number"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalanceWalletIcon color={errors.accountNumber ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter recipient's account number"
                />
              )}
            />


            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Amount"
                  type="number"
                  inputMode="decimal"
                  fullWidth
                  required
                  margin="normal"
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">MYR</InputAdornment>
                    ),
                    inputProps: { min: 0.01, step: 0.01 },
                  }}
                />
              )}
            />

            <Controller
              name="reference"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Reference"
                  fullWidth
                  margin="normal"
                  error={!!errors.reference}
                  helperText={errors.reference?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon color={errors.reference ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Add a reference to help identify this transaction later">
                          <IconButton size="small" edge="end">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="e.g., June 2025 Bonus Payment"
                />
              )}
            />

            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isLoading}
                loadingPosition="start"
                startIcon={<PaidIcon />}
                disabled={!isDirty || !isValid || isLoading}
              >
                {isLoading ? 'Processing...' : 'Send Tokens'}
              </LoadingButton>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarState.severity}
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Airdrop;
