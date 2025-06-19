import { useState } from 'react';
import { useForm, Controller, UseFormReturn, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CreateStaffRequest } from '../adminApi';

const staffSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup.string().oneOf(['admin', 'banker']).required('Role is required'),
});

interface CreateStaffFormData extends Omit<CreateStaffRequest, 'confirmPassword'> {
  confirmPassword: string;
}

export interface CreateStaffFormProps {
  onSubmit: (data: Omit<CreateStaffRequest, 'confirmPassword'>) => void;
  loading?: boolean;
  error?: string;
  onCancel?: () => void;
}

export const CreateStaffForm: React.FC<CreateStaffFormProps> = ({
  onSubmit,
  loading = false,
  error,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStaffFormData>({
    resolver: yupResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'banker',
    },
  });

  const handleFormSubmit = (data: CreateStaffFormData) => {
    const { confirmPassword, ...staffData } = data;
    onSubmit(staffData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 2 }}>
      <Stack spacing={3}>
        {error && (
          <Typography color="error" variant="body2" align="center">
            {error}
          </Typography>
        )}

        <Controller
          name="name"
          control={control as any}
          render={({ field }) => (
            <TextField
              {...field}
              label="Full Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              margin="normal"
              autoFocus
            />
          )}
        />

        <Controller
          name="email"
          control={control as any}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email Address"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              margin="normal"
            />
          )}
        />


        <Controller
          name="password"
          control={control as any}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control as any}
          render={({ field }) => (
            <TextField
              {...field}
              label="Confirm Password"
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              fullWidth
              margin="normal"
            />
          )}
        />


        <Controller
          name="role"
          control={control as any}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select {...field} label="Role">
                <MenuItem value="banker">Banker</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
              {errors.role && (
                <FormHelperText>{errors.role.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          {onCancel && (
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            disabled={loading}
          >
            Create Staff
          </LoadingButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default CreateStaffForm;
