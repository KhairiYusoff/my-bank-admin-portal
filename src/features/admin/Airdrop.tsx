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
  FormHelperText,
  Snackbar,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAirdropMutation } from './adminApi';

// Validation schema
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
  reference: yup.string().optional(),
});

type AirdropFormData = yup.InferType<typeof airdropSchema>;

const Airdrop: React.FC = () => {
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
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
    },
  });

  const onSubmit = async (data: AirdropFormData) => {
    try {
      await airdrop({
        accountNumber: data.accountNumber,
        amount: data.amount,
        reference: data.reference || undefined,
      }).unwrap();

      setSnackbar({
        open: true,
        message: 'Airdrop successful!',
        severity: 'success',
      });
      reset();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.data?.message || 'Failed to process airdrop',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Airdrop Tokens
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Send tokens to a user's account
        </Typography>
      </Box>

      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
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
                  label="Reference (Optional)"
                  fullWidth
                  margin="normal"
                  error={!!errors.reference}
                  helperText={errors.reference?.message}
                />
              )}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isLoading}
                disabled={!isDirty || !isValid || isLoading}
              >
                Send Airdrop
              </LoadingButton>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Airdrop;
