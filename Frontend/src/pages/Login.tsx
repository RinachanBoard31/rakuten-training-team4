// src/pages/Login.tsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
    navigate('/home');
  };

  return (
    <Box p={4} maxWidth="400px" mx="auto">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Box mt={2} textAlign="center">
        <Typography variant="body2">Don't have an account?</Typography>
        <Button component={Link} to="/register" variant="outlined" fullWidth>
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
