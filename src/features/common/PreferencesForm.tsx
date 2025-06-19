import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box,
  Alert,
  CircularProgress,
  Snackbar,
  Divider,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  FormHelperText
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useUpdatePreferencesMutation, UpdatePreferencesRequest } from '@/features/auth/authApi';

// Define validation schema
const preferencesSchema = yup.object().shape({
  theme: yup.string().required('Theme is required'),
  language: yup.string().required('Language is required'),
  timezone: yup.string().required('Timezone is required'),
  dateFormat: yup.string().required('Date format is required'),
  notifications: yup.object().shape({
    email: yup.boolean(),
    push: yup.boolean(),
    sms: yup.boolean(),
  })
});

type FormData = yup.InferType<typeof preferencesSchema>;

interface PreferencesFormProps {
  open: boolean;
  onClose: () => void;
  initialData: UpdatePreferencesRequest;
}

// Available options
const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System Default' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ms', label: 'Bahasa Melayu' },
  { value: 'zh', label: '中文' },
];

const dateFormatOptions = [
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
];

const timezoneOptions = [
  'Asia/Kuala_Lumpur',
  'Asia/Singapore',
  'UTC',
  'America/New_York',
  'Europe/London',
].map(tz => ({ value: tz, label: tz }));

const PreferencesForm: React.FC<PreferencesFormProps> = ({ 
  open, 
  onClose, 
  initialData 
}) => {
  const [snackbar, setSnackbar] = React.useState<{ 
    open: boolean; 
    message: string; 
    severity: 'success' | 'error' 
  }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const [updatePreferences, { isLoading }] = useUpdatePreferencesMutation();

  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    resolver: yupResolver(preferencesSchema),
    defaultValues: {
      theme: initialData.theme || 'light',
      language: initialData.language || 'en',
      timezone: initialData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateFormat: initialData.dateFormat || 'MM/dd/yyyy',
      notifications: {
        email: initialData.notifications?.email ?? true,
        push: initialData.notifications?.push ?? true,
        sms: initialData.notifications?.sms ?? false,
      }
    },
    mode: 'onChange'
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (open) {
      reset({
        theme: initialData.theme || 'light',
        language: initialData.language || 'en',
        timezone: initialData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateFormat: initialData.dateFormat || 'MM/dd/yyyy',
        notifications: {
          email: initialData.notifications?.email ?? true,
          push: initialData.notifications?.push ?? true,
          sms: initialData.notifications?.sms ?? false,
        }
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updatePreferences(data).unwrap();
      setSnackbar({ 
        open: true, 
        message: 'Preferences updated successfully!', 
        severity: 'success' 
      });
      onClose();
    } catch (err) {
      const errorMessage = (err as any)?.data?.message || 'Failed to update preferences';
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Preferences</Typography>
              <IconButton 
                edge="end" 
                onClick={handleClose} 
                aria-label="close"
                disabled={isLoading}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Display
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="theme"
                    control={control}
                    render={({ field }) => (
                      <FormControl 
                        fullWidth 
                        margin="normal"
                        error={!!errors.theme}
                      >
                        <InputLabel id="theme-label">Theme</InputLabel>
                        <Select
                          {...field}
                          labelId="theme-label"
                          label="Theme"
                          disabled={isLoading}
                        >
                          {themeOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.theme && (
                          <FormHelperText>{errors.theme.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <FormControl 
                        fullWidth 
                        margin="normal"
                        error={!!errors.language}
                      >
                        <InputLabel id="language-label">Language</InputLabel>
                        <Select
                          {...field}
                          labelId="language-label"
                          label="Language"
                          disabled={isLoading}
                        >
                          {languageOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.language && (
                          <FormHelperText>{errors.language.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="timezone"
                    control={control}
                    render={({ field }) => (
                      <FormControl 
                        fullWidth 
                        margin="normal"
                        error={!!errors.timezone}
                      >
                        <InputLabel id="timezone-label">Timezone</InputLabel>
                        <Select
                          {...field}
                          labelId="timezone-label"
                          label="Timezone"
                          disabled={isLoading}
                        >
                          {timezoneOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.timezone && (
                          <FormHelperText>{errors.timezone.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="dateFormat"
                    control={control}
                    render={({ field }) => (
                      <FormControl 
                        fullWidth 
                        margin="normal"
                        error={!!errors.dateFormat}
                      >
                        <InputLabel id="date-format-label">Date Format</InputLabel>
                        <Select
                          {...field}
                          labelId="date-format-label"
                          label="Date Format"
                          disabled={isLoading}
                        >
                          {dateFormatOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.dateFormat && (
                          <FormHelperText>{errors.dateFormat.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Notifications
              </Typography>
              
              <Controller
                name="notifications.email"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={e => field.onChange(e.target.checked)}
                        disabled={isLoading}
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                )}
              />
              
              <Controller
                name="notifications.push"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={e => field.onChange(e.target.checked)}
                        disabled={isLoading}
                        color="primary"
                      />
                    }
                    label="Push Notifications"
                  />
                )}
              />
              
              <Controller
                name="notifications.sms"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={e => field.onChange(e.target.checked)}
                        disabled={isLoading}
                        color="primary"
                      />
                    }
                    label="SMS Notifications"
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={handleClose} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={isLoading || !isDirty}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PreferencesForm;
