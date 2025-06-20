import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon,
  Typography, 
  CssBaseline, 
  Box, 
  Divider 
} from '@mui/material';
import LogoutButton from '@/features/auth/LogoutButton';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AirIcon from '@mui/icons-material/Air';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const navItems: { label: string; path: string; icon: JSX.Element }[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Users', path: '/users', icon: <PeopleIcon /> },
  { label: 'Create Staff', path: '/create-staff', icon: <PersonAddIcon /> },
  { label: 'Pending Applications', path: '/pending-applications', icon: <PendingActionsIcon /> },
  { label: 'Transactions', path: '/transactions', icon: <SwapHorizIcon /> },
  { label: 'Accounts', path: '/accounts', icon: <AccountBalanceIcon /> },
  { label: 'Airdrop', path: '/airdrop', icon: <AirIcon /> },
  { label: 'My Profile', path: '/profile', icon: <PersonIcon /> },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src="/bank-logo.svg"
              alt="My Bank Admin"
              style={{ width: 32, height: 32 }}
            />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 500 }}>
              My Bank Admin
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
          <List sx={{ flex: 1, overflow: 'auto', py: 2 }}>
            {navItems.map(({ label, path, icon }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  selected={location.pathname === path}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    '&.Mui-selected': {
                      backgroundColor: (theme) => theme.palette.action.selected,
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.action.hover
                      }
                    },
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: location.pathname === path ? (theme) => theme.palette.primary.main : (theme) => theme.palette.text.secondary,
                      minWidth: 40
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: location.pathname === path ? 500 : 400
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 'auto', mb: 2 }}>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <LogoutButton
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
                startIcon={<LogoutIcon />}
              />
            </ListItem>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
