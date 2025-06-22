import React from 'react';
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
  Grid,
  Skeleton
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  VerifiedUser as VerifiedUserIcon,
  Event as EventIcon,
  History as HistoryIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { 
  useGetProfileQuery, 
  useGetRecentActivityQuery, 
  Activity
} from '@/features/auth/store/authApi';

// The Activity interface is now imported directly from the authApi and includes all necessary fields.
import { format } from 'date-fns';


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
  

  const profile = profileData?.data;
  const activities: Activity[] = activityData?.data || [];



  const getActivityIcon = (activity: Activity) => {
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
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Profile Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
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
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                        primary={activity.action.replace(/_/g, ' ')}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" component="span" display="block" sx={{ mt: 0.5 }}>
                              {activity.details}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" component="span" display="block" sx={{ mt: 0.5 }}>
                              {format(new Date(activity.createdAt), 'PPpp')}
                            </Typography>
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


    </Box>
  );
};

export default Profile;
