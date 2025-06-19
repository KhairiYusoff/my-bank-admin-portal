import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  Paper,
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  CircularProgress,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Skeleton
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  VerifiedUser as VerifiedUserIcon,
  Event as EventIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { 
  useGetProfileQuery, 
  useGetRecentActivityQuery, 
  Activity
} from '@/features/auth/authApi';

// Extend the Activity interface to include missing properties
interface ExtendedActivity extends Activity {
  description?: string;
  timestamp?: string;
}
import { format } from 'date-fns';
import ProfileEditForm from './ProfileEditForm';
import ChangePasswordForm from './ChangePasswordForm';
import PreferencesForm from './PreferencesForm';

interface ProfileState {
  anchorEl: HTMLElement | null;
  isEditDialogOpen: boolean;
  isPasswordDialogOpen: boolean;
  isPreferencesDialogOpen: boolean;
}

const Profile: React.FC = () => {
  const { 
    data: profileData, 
    isLoading: isLoadingProfile, 
    error: profileError, 
    refetch: refetchProfile 
  } = useGetProfileQuery();
  
  const { 
    data: activityData, 
    isLoading: isLoadingActivity, 
    error: activityError 
  } = useGetRecentActivityQuery({ limit: 5 });
  
  const [state, setState] = useState<ProfileState>({
    anchorEl: null,
    isEditDialogOpen: false,
    isPasswordDialogOpen: false,
    isPreferencesDialogOpen: false
  });

  const { anchorEl, isEditDialogOpen, isPasswordDialogOpen, isPreferencesDialogOpen } = state;
  const profile = profileData?.data;
  const activities: ExtendedActivity[] = activityData?.data || [];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setState(prev => ({ ...prev, anchorEl: event.currentTarget as HTMLElement }));
  };

  const handleMenuClose = () => {
    setState(prev => ({ ...prev, anchorEl: null }));
  };

  const handleEditProfile = () => {
    handleMenuClose();
    setState(prev => ({ ...prev, isEditDialogOpen: true }));
  };

  const handleChangePassword = () => {
    handleMenuClose();
    setState(prev => ({ ...prev, isPasswordDialogOpen: true }));
  };

  const handlePreferences = () => {
    handleMenuClose();
    setState(prev => ({ ...prev, isPreferencesDialogOpen: true }));
  };

  const handleCloseDialogs = () => {
    setState(prev => ({
      ...prev,
      isEditDialogOpen: false,
      isPasswordDialogOpen: false,
      isPreferencesDialogOpen: false
    }));
  };

  const handleProfileUpdated = () => {
    refetchProfile();
    handleCloseDialogs();
  };

  const getActivityIcon = (activity: ExtendedActivity) => {
    switch (activity.severity) {
      case 'HIGH':
        return <HistoryIcon color="error" />;
      case 'MEDIUM':
        return <HistoryIcon color="warning" />;
      case 'LOW':
      default:
        return <HistoryIcon color="action" />;
    }
  };

  if (isLoadingProfile) {
    return (
      <Box p={3}>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 2fr' }} gap={3}>
          <Skeleton variant="rectangular" height={400} />
          <Skeleton variant="rectangular" height={400} />
        </Box>
      </Box>
    );
  }

  if (profileError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading profile: {JSON.stringify(profileError)}
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        No profile data available.
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
        gap: 3,
        width: '100%'
      }}>
        {/* Profile Section */}
        <Box>
          <Paper elevation={2} sx={{ p: 3, height: '100%', position: 'relative' }}>
            <IconButton 
              aria-label="more"
              aria-controls="profile-actions"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <MoreVertIcon />
            </IconButton>
            
            <Menu
              id="profile-actions"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditProfile}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handlePreferences}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Preferences</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleChangePassword}>
                <ListItemIcon>
                  <LockIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Change Password</ListItemText>
              </MenuItem>
            </Menu>
            
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  fontSize: '3rem',
                  mb: 2,
                  bgcolor: 'primary.main'
                }}
              >
                {profile.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" component="h1" gutterBottom>
                {profile.name}
              </Typography>
              <Chip 
                label={profile.role?.toUpperCase()} 
                color="primary" 
                variant="outlined" 
                size="small" 
                sx={{ mb: 2 }}
              />
            </Box>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={
                    <Box component="span" sx={{ wordBreak: 'break-word' }}>
                      {profile.email}
                    </Box>
                  } 
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <VerifiedUserIcon color={profile.isVerified ? 'success' : 'disabled'} />
                </ListItemIcon>
                <ListItemText 
                  primary="Verification" 
                  secondary={
                    <Chip 
                      label={profile.isVerified ? 'Verified' : 'Not Verified'} 
                      size="small"
                      color={profile.isVerified ? 'success' : 'default'}
                      variant="outlined"
                    />
                  } 
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Member since" 
                  secondary={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'} 
                />
              </ListItem>
            </List>
          </Paper>
        </Box>

        {/* Recent Activity Section */}
        <Box>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {isLoadingActivity ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : activityError ? (
              <Alert severity="error">
                Error loading activity: {JSON.stringify(activityError)}
              </Alert>
            ) : activities.length === 0 ? (
              <Alert severity="info">No recent activity found.</Alert>
            ) : (
              <List>
                {activities.map((activity, index) => (
                  <React.Fragment key={activity.id || index}>
                    <ListItem>
                      <ListItemIcon>
                        {getActivityIcon(activity)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.action}
                        secondary={
                          <>
                            {activity.description && (
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                display="block"
                              >
                                {activity.description}
                              </Typography>
                            )}
                            <br />
                            {activity.timestamp && (
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {format(new Date(activity.timestamp), 'PPpp')}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <ProfileEditForm
        open={isEditDialogOpen}
        onClose={handleCloseDialogs}
        initialData={{
          name: profile.name || '',
          email: profile.email || '',
          phoneNumber: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        }}
        onSuccess={handleProfileUpdated}
      />

      {/* Change Password Dialog */}
      <ChangePasswordForm
        open={isPasswordDialogOpen}
        onClose={handleCloseDialogs}
      />

      {/* Preferences Dialog */}
      <PreferencesForm
        open={isPreferencesDialogOpen}
        onClose={handleCloseDialogs}
        initialData={{
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          dateFormat: 'MM/dd/yyyy',
        }}
      />
    </Box>
  );
};

export default Profile;
