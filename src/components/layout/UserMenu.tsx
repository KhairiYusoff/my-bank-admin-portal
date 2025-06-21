import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { useGetProfileQuery } from '@/features/auth/store/authApi';
import { UserProfile } from '@/types/user';
import Profile from '@/features/auth/components/Profile';
import ProfileEditForm from '@/features/auth/components/ProfileEditForm';
import ChangePasswordForm from '@/features/auth/components/ChangePasswordForm';
import PreferencesForm from '@/features/auth/components/PreferencesForm';

const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: profileResponse, isLoading, refetch } = useGetProfileQuery();
  const user = profileResponse?.data as UserProfile | undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    setter(true);
    handleClose();
  };

  const handleCloseDialog = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    setter(false);
  };

  const handleProfileUpdated = () => {
    refetch();
    handleCloseDialog(setEditDialogOpen)();
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Avatar
              src={user?.avatarUrl}
              sx={{ width: 32, height: 32 }}
              alt={user?.name || 'User'}
            >
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          )}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 2,
          sx: {
            minWidth: 220,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.email || ''}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleOpen(setProfileOpen)}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={handleOpen(setEditDialogOpen)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Profile
        </MenuItem>
        <MenuItem onClick={handleOpen(setPasswordDialogOpen)}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={handleOpen(setPreferencesOpen)}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Dialog open={isProfileOpen} onClose={handleCloseDialog(setProfileOpen)} fullWidth maxWidth="lg">
        <DialogTitle>
          My Profile
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog(setProfileOpen)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Profile />
        </DialogContent>
      </Dialog>

      {user && (
        <>
          <ProfileEditForm
            open={isEditDialogOpen}
            onClose={handleCloseDialog(setEditDialogOpen)}
            initialData={{
              name: user.name || '',
              email: user.email || '',
              phoneNumber: user.phone || '',
              address: user.address || '',
              city: '', // Assuming city is not on user object, add if it is
              state: '', // Assuming state is not on user object, add if it is
              postalCode: '', // Assuming postalCode is not on user object, add if it is
              country: '', // Assuming country is not on user object, add if it is
            }}
            onSuccess={handleProfileUpdated}
          />
          <ChangePasswordForm
            open={isPasswordDialogOpen}
            onClose={handleCloseDialog(setPasswordDialogOpen)}
          />
          <PreferencesForm
            open={isPreferencesOpen}
            onClose={handleCloseDialog(setPreferencesOpen)}
            initialData={{
              theme: user.preferences?.theme || 'light',
              language: user.preferences?.language || 'en',
              notifications: user.preferences?.notifications || { email: true, push: true, sms: false },
              timezone: 'Asia/Kuala_Lumpur',
              dateFormat: 'MM/dd/yyyy',
            }}
          />
        </>
      )}
    </>
  );
};

export default UserMenu;
