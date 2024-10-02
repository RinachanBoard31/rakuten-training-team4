// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider} from '@mui/material/styles';
import Home from './pages/Home';
import Login from './pages/Login';
import Header from './components/Header';
import theme from './theme'; // 作成したテーマをインポート

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        
          <Header />
          <Box sx={{ flex: 1, padding: 2 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
