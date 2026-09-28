import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const drawerWidth = 240;

const navItems = [
  { text: 'Home', path: '/', icon: <HomeIcon /> },
  { text: 'Upload', path: '/upload', icon: <UploadFileIcon /> },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0a0a0a', color: '#ffffff' }}>
      <CssBaseline />

      {/* Top App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: '#000000',
          borderBottom: '1px solid #262626',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#ffffff', fontWeight: 600 }}>
            Demo for Meeting Notes
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Persistent Left Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#000000',
            color: '#ffffff',
            borderRight: '1px solid #262626',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            Web App
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: '#262626' }} />
        <List sx={{ px: 1, py: 2 }}>
          {navItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 1,
                    color: isSelected ? '#ffffff' : '#a3a3a3',
                    bgcolor: isSelected ? '#262626 !important' : 'transparent',
                    '&:hover': {
                      bgcolor: '#171717',
                      color: '#ffffff',
                      '& .MuiListItemIcon-root': {
                        color: '#ffffff',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? '#ffffff' : '#a3a3a3',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#0a0a0a',
          color: '#ffffff',
          p: 3,
          mt: 8,
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}