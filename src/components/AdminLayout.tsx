import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Drawer, AppBar, Toolbar, List, ListItem, ListItemButton, ListItemText, Typography, CssBaseline, Box, Divider } from '@mui/material';
import LogoutButton from '@/features/auth/LogoutButton';

const drawerWidth = 240;

const navItems: { label: string; path: string }[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Users', path: '/users' },
  { label: 'Create Staff', path: '/create-staff' },
  { label: 'Pending Applications', path: '/pending-applications' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Accounts', path: '/accounts' },
  { label: 'Airdrop', path: '/airdrop' },
  { label: 'My Profile', path: '/profile' },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            My Bank Admin
          </Typography>
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
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map(({ label, path }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  selected={location.pathname === path}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            <LogoutButton />
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
