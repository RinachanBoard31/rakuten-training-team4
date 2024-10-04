import React, { useEffect, useState } from 'react';
import { fetchFavoriteItems, deleteFavoriteItem, saveFavoriteItem, fetchFriendList, saveFriendFavoriteItem } from '../api/api';
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
  Tabs,
  Tab,
} from '@mui/material';

interface FavoriteItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  imageUrl: string;
}

const FavoriteList: React.FC = () => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [friendWishlist, setFriendWishlist] = useState<FavoriteItem[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [favoriteRemoved, setFavoriteRemoved] = useState<boolean>(false);

  useEffect(() => {
    const fetchFriends = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        const username = JSON.parse(user).username;
        const friendData = await fetchFriendList(username);
        setFriends(friendData.friends);
        if (friendData.friends.length > 0) {
          setSelectedFriend(friendData.friends[0]);
        }
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
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

  const fetchFriendWishlist = async (friend: string) => {
    const friendData = await fetchFavoriteItems(friend);
    if (friendData) {
      // ランダムに3つ選択
      const shuffled = friendData.sort(() => 0.5 - Math.random());
      setFriendWishlist(shuffled.slice(0, 3));
    }
  };

  useEffect(() => {
    if (selectedFriend) {
      fetchFriendWishlist(selectedFriend);
    }
  }, [selectedFriend]);

  const handleFriendChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedFriend(newValue);
  };

  const toggleFavorite = async (item: FavoriteItem) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [item.itemUrl]: !prevFavorites[item.itemUrl],
    }));
    const user = localStorage.getItem('user');
    if (user) {
      const username = JSON.parse(user).username;
      if (favorites[item.itemUrl]) {
        await deleteFavoriteItem(username, item.itemUrl);
        setFavoriteItems((prevItems) => prevItems.filter((i) => i.itemUrl !== item.itemUrl));
      } else {
        await saveFavoriteItem(username, item);
        setFavoriteItems((prevItems) => [...prevItems, item]);
      }
    }

    setFavoriteRemoved(true);
  };

  const toggleFriendFavorite = async (item: FavoriteItem) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [item.itemUrl]: !prevFavorites[item.itemUrl],
    }));
    const user = localStorage.getItem('user');
    if (user) {
      const username = JSON.parse(user).username;
      if (favorites[item.itemUrl]) {
        await deleteFavoriteItem(username, item.itemUrl);
        setFavoriteItems((prevItems) => prevItems.filter((i) => i.itemUrl !== item.itemUrl));
      } else {
        await saveFriendFavoriteItem(username, item);
        setFavoriteItems((prevItems) => [...prevItems, item]);
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
        Friends Wishlist
      </Typography>
      <Tabs
        value={selectedFriend}
        onChange={handleFriendChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {friends.map((friend) => (
          <Tab key={friend} label={friend} value={friend} />
        ))}
      </Tabs>

      {friendWishlist.length > 0 ? (
        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
          {friendWishlist.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#f0f0f0',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' },
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
                    sx={{ marginBottom: 1, fontSize: '0.9rem' }}
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
                    <IconButton onClick={() => toggleFriendFavorite(item)}>
                    <img src={favorites[item.itemUrl] ? '/images/okaimono_panda_like_icon.png' : '/images/okaimono_panda_unlike_icon.png'} alt="Favorite" style={{ width: 36, height: 30 }} />
                  </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ marginTop: 2, fontStyle: 'italic' }}>
          {selectedFriend} - san doesn't have a wishlist yet.
        </Typography>
      )}
      <Typography variant="h4" gutterBottom>
        Your Wishlist
      </Typography>
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        {favoriteItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)', }, }}>
              <CardMedia component="img" height="150" image={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.itemName} sx={{ objectFit: 'cover' }} />
              <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', }}>
                  {item.itemName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1, fontSize: '0.9rem', }}>
                  ¥{item.itemPrice.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <Button href={item.itemUrl} target="_blank" rel="noopener" variant="contained" color="primary" size="small">
                    View Product
                  </Button>
                  <IconButton onClick={() => toggleFavorite(item)}>
                    <img src={favorites[item.itemUrl] ? '/images/okaimono_panda_like_icon.png' : '/images/okaimono_panda_unlike_icon.png'} alt="Favorite" style={{ width: 36, height: 30 }} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={favoriteRemoved} autoHideDuration={2000} onClose={() => setFavoriteRemoved(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success">Wishlist Updated!</Alert>
      </Snackbar>
    </Box>
  );
};

export default FavoriteList;
