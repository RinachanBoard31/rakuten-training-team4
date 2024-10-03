// src/components/Header.tsx
import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import logo from '/assets/rakutenz.jpg'; // 相対パスに修正
import { AuthContext } from '../contexts/AuthContext';

// ロゴコンテナのスタイリング
const LogoContainer = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  overflow: 'hidden',
  marginRight: theme.spacing(2),
}));

// ロゴ画像のスタイリング
const Logo = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <AppBar
      position="static"
      color="primary" // テーマの primary color を使用
      sx={{
        width: '100%', // 幅を100%に設定
      }}
    >
      <Toolbar>
        {/* ロゴとテキストをリンクで囲む */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LogoContainer>
            <Logo src={logo} alt="Rakutenz Logo" />
          </LogoContainer>
          {/* ロゴの横にテキストを表示 */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: 'Lobster, cursive',
              fontSize: '1.5rem',
              color: '#ffffff',
              display: { xs: 'none', sm: 'block' }, // 小さい画面では非表示
            }}
          >
            Rakutenz
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        {/* ナビゲーションボタン */}
        { isAuthenticated ? ( 
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
            <Button color="inherit" component={Link} to="/login" startIcon={<HomeIcon />}>
              Login
            </Button>
          )  
        }
        
        <Button color="inherit" component={Link} to="/about" startIcon={<InfoIcon />}>
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
