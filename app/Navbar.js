"use client";

import { Box, IconButton, Tooltip, Stack, Button, AppBar, Container, Menu, MenuItem, Fab, Toolbar, Typography, Divider } from "@mui/material";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
// import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
// import AssistantRoundedIcon from "@mui/icons-material/AssistantRounded";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import NavigationIcon from '@mui/icons-material/Navigation';
import Link from "next/link";
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import { HomeRoundedIcon, AssistantRoundedIcon, FeedbackRoundedIcon } from '@mui/icons-material';
import { useState } from "react";

export default function Navbar() {
  const { user, loading, logOut } = useAuth();
  const { push } = useRouter();
  
  const handleSignOut = async () => {
    try {
      await logOut();
      push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (user) {
    return (
      <Box position="fixed" sx={{ flexGrow: 0 }}>
        {/* <Fab variant="extended">
          <NavigationIcon sx={{ mr: 1 }} />
          Navigate
        </Fab> */}
        <Button variant="contained" color="secondary" onClick={handleOpenUserMenu}>
          Menu
        </Button>

        <Menu
          sx={{ mt: '20px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign={'center'} sx={{ '&:hover': {color: '#79c1f1'} }}>
              {user.displayName}
            </Typography>
          </MenuItem>
          <Divider />

          <MenuItem onClick={() => push('/')}>
              <Typography textAlign="center" sx={{ '&:hover': {color: '#79c1f1'} }}>Home</Typography>
          </MenuItem>
          <Divider />

          <MenuItem onClick={() => push('/t-baymax')}>
              <Typography textAlign="center" sx={{ '&:hover': {color: '#79c1f1'} }}>T-Baymax</Typography>
          </MenuItem>
          <Divider />

          <MenuItem onClick={() => push('/feedback')}>
              <Typography textAlign="center" sx={{ '&:hover': {color: '#79c1f1'} }}>Feedback</Typography>
          </MenuItem>
          <Divider />

          <MenuItem onClick={handleSignOut}>
              <Button variant="outlined" color="error">Sign out</Button>
          </MenuItem>
        </Menu>
      </Box>
    );
  } else {
    return null;
  }
}
      