import React, { useContext, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [username, setUsername] = React.useState<string>('');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
    handleClose();
  };

  const handleWishList = () => {
    navigate('/favorites');
    handleClose();
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  return (
    <AppBar
      position="static"
      color="primary"
      sx={{
        width: '100%',
      }}
    >
      <Toolbar>
        <Link
          to="/home"
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
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: 'Lobster, cursive',
              fontSize: '1.5rem',
              color: '#ffffff',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Rakutenz
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <AccountCircleIcon />
              </Avatar>
              <Typography
                variant="body1"
                sx={{ marginRight: 2, display: { xs: 'none', sm: 'block' } }}
              >
              {username}
              </Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleWishList}>View Wishlist</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login" startIcon={<HomeIcon />}>
            Login
          </Button>
        )}
        <Button color="inherit" component={Link} to="/about" startIcon={<InfoIcon />}>
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;