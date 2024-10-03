// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider} from '@mui/material/styles';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import theme from './theme'; // 作成したテーマをインポート
import { AuthProvider, PrivateRoute } from './contexts/AuthContext';
import Rakutenz from './pages/Rakutenz';
import TestChat from './pages/TestChat';
import FavoriteList from './pages/FavoriteList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          
            <Header />
            <Box sx={{ flex: 1, padding: 2 }}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/rakutenz" element={<PrivateRoute element={<Rakutenz />} />} />
                <Route path="/testchat" element={<PrivateRoute element={<TestChat />} />} />
                <Route path="/favorites" element={<PrivateRoute element={<FavoriteList />} />} />
              </Routes>
            </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
