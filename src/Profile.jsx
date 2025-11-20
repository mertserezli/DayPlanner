import React, { useState } from 'react';
import { auth } from './Firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { useUserStore } from './AuthProvider';

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import HeaderBar from './HeaderBar';

export default function Profile() {
  const { user, loading } = useUserStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (!user) {
    return <Navigate replace to="/signin" />;
  }

  const isEmailPassword = user.providerData.some((profile) => profile.providerId === 'password');

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        setStatus('No user is signed in.');
        return;
      }

      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);
      setStatus('Password updated successfully!');
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <>
      <HeaderBar showSignOut={true} />
      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Profile Settings
          </Typography>
          {isEmailPassword && (
            <Box component="form" onSubmit={handlePasswordChange} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                required
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                required
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={!currentPassword || !newPassword}
              >
                Update Password
              </Button>
            </Box>
          )}
          {status && (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              {status}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
