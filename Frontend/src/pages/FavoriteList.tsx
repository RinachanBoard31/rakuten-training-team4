// src/pages/FavoriteList.tsx
import React, { useEffect, useState } from 'react';
import { fetchFavoriteItems } from '../api/api';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Box,
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

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      const user = localStorage.getItem('user');
      if (user) {
        const username = JSON.parse(user).username;
        const data = await fetchFavoriteItems(username);
        if (data) {
          setFavoriteItems(data);
        } else {
          setError('Failed to fetch favorite items.');
        }
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

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
        Your Favorite Items
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
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FavoriteList;
