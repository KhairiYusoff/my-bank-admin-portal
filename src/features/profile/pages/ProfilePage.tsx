import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  Divider, 
  Button, 
  CircularProgress,
  Stack,
  Chip
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  VerifiedUser as VerifiedUserIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useGetProfileQuery } from '@/features/auth/store/authApi';
import { format } from 'date-fns';
import { ProfileEditForm, ChangePasswordForm } from '@/features/profile/components';
import { UserProfile } from '@/types/user';

const ProfilePage: React.FC = () => {
  const { data: profileResponse, isLoading } = useGetProfileQuery();
  const profile = profileResponse?.data as UserProfile | undefined;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
  };

  const handleChangePasswordClick = () => {
    setChangePasswordDialogOpen(true);
  };

  const handleChangePasswordClose = () => {
    setChangePasswordDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Typography color="error">Failed to load profile data</Typography>
      </Box>
    );
  }

  const fullName = profile.name || 'User';
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ').slice(1).join(' ');

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box display="flex" alignItems="center">
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                fontSize: '2rem',
                bgcolor: 'primary.main',
                mr: 3
              }}
            >
              {firstName?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {fullName}
                {profile.isVerified && (
                  <Chip 
                    label="Verified" 
                    color="success" 
                    size="small" 
                    icon={<VerifiedUserIcon fontSize="small" />}
                    sx={{ ml: 1, verticalAlign: 'middle' }}
                  />
                )}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {profile.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {profile.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : 'N/A'}
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              onClick={handleChangePasswordClick}
            >
              Change Password
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            <Box sx={{ '& > div': { mb: 1.5 } }}>
              <Box display="flex" alignItems="center">
                <EmailIcon color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography>{profile.email || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <PhoneIcon color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography>{profile.phone || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="flex-start">
                <LocationIcon color="action" sx={{ mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Address</Typography>
                  <Typography>{profile.address || 'N/A'}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Account Details</Typography>
            <Box sx={{ '& > div': { mb: 1.5 } }}>
              <Box display="flex" alignItems="center">
                <PersonIcon color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">User ID</Typography>
                  <Typography>{profile.id || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <EventIcon color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Member Since</Typography>
                  <Typography>{profile.createdAt ? format(new Date(profile.createdAt), 'MMMM d, yyyy') : 'N/A'}</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <VerifiedUserIcon color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Box display="flex" alignItems="center">
                    <Chip 
                      label={profile.isVerified ? 'Verified' : 'Not Verified'} 
                      color={profile.isVerified ? 'success' : 'default'} 
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {!profile.isVerified && (
                      <Button size="small" color="primary">
                        Verify Email
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Profile Dialog */}
      {profile && (
        <ProfileEditForm
          open={editDialogOpen}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
          initialData={{
            name: fullName,
            email: profile.email || '',
            phoneNumber: profile.phone || '',
            address: profile.address || '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          }}
        />
      )}

      {/* Change Password Dialog */}
      <ChangePasswordForm
        open={changePasswordDialogOpen}
        onClose={handleChangePasswordClose}
      />
    </Box>
  );
};

export default ProfilePage;
