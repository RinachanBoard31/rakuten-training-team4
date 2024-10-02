// src/pages/Login.tsx

import React, { useState, useContext } from 'react';
import { Navigate, useNavigate} from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';
import {login} from '../api/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
    navigate('/home')
  };


  return (
    <Box p={4}>
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
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
