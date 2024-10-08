// src/App.tsx
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
import FavoriteList from './pages/FavoriteList';
import FriendsList from './pages/FriendsList';
import ReceivedRequestsList from './pages/RecievedRequestsList';
import SendFriendRequest from './pages/SendFriendRequest';

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
                <Route path="/favorites" element={<PrivateRoute element={<FavoriteList />} />} />
                <Route path="/friends" element={<PrivateRoute element={<FriendsList />} />} />
                <Route path="/friends/requests-list" element={<PrivateRoute element={<ReceivedRequestsList />} />} />
                <Route path="/friends/send-request" element={<PrivateRoute element={<SendFriendRequest />} />} />
              </Routes>
            </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
