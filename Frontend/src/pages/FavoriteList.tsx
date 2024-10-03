import React, { useEffect, useState } from 'react';
import { fetchFavoriteItems, deleteFavoriteItem, saveFavoriteItem } from '../api/api';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';

interface FavoriteItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  imageUrl: string;
}

const FavoriteList: React.FC = () => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [favoriteRemoved, setFavoriteRemoved] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      const user = localStorage.getItem('user');
      if (user) {
        const username = JSON.parse(user).username;
        const data = await fetchFavoriteItems(username);
        if (data) {
          const favoriteMap: { [key: string]: boolean } = {};
          data.forEach((item: any) => {
            favoriteMap[item.itemUrl] = true;
          });
          setFavoriteItems(data);
          setFavorites(favoriteMap);
        } else {
          setError('Failed to fetch favorite items.');
        }
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (item: FavoriteItem) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [item.itemUrl]: !prevFavorites[item.itemUrl],
    }));

    const user = localStorage.getItem('user');
    if (user) {
      const username = JSON.parse(user).username;
      if (favorites[item.itemUrl]) {
        // お気に入りから削除
        await deleteFavoriteItem(username, item.itemUrl);
        setFavoriteItems((prevItems) => prevItems.filter((i) => i.itemUrl !== item.itemUrl));
      } else {
        // お気に入りに追加
        await saveFavoriteItem(username, item);
      }
    }

    setFavoriteRemoved(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Wishlist
      </Typography>
      {favoriteItems.length === 0 ? (
        <Typography>No favorites yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {favoriteItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="150"
                  image={item.imageUrl || 'https://via.placeholder.com/150'}
                  alt={item.itemName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.itemName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      marginBottom: 1,
                      fontSize: '0.9rem',
                    }}
                  >
                    ¥{item.itemPrice.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <Button
                      href={item.itemUrl}
                      target="_blank"
                      rel="noopener"
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      View Product
                    </Button>
                    <IconButton onClick={() => toggleFavorite(item)}>
                      <img
                        src={favorites[item.itemUrl] ? '/images/okaimono_panda_like_icon.png' : '/images/okaimono_panda_unlike_icon.png'}
                        alt="Favorite"
                        style={{ width: 36, height: 30 }}
                      />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={favoriteRemoved}
        autoHideDuration={2000}
        onClose={() => setFavoriteRemoved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success">Wishlist Updated!</Alert>
      </Snackbar>
    </Box>
  );
};

export default FavoriteList;
