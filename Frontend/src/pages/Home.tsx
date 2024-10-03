import React, { useEffect, useState } from 'react';
import { searchItems, saveFavoriteItem, fetchFavoriteItems, deleteFavoriteItem } from '../api/api';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Item {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrls: Array<{ imageUrl: string }>;
  smallImageUrls: Array<{ imageUrl: string }>;
}

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [favoriteAdded, setFavoriteAdded] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  // ユーザのwishlistを取得してお気に入り商品をデフォルトで反映
  useEffect(() => {
    const fetchWishList = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        const username = JSON.parse(user).username;
        const favoriteItems = await fetchFavoriteItems(username);
        if (favoriteItems) {
          const favoriteMap: { [key: string]: boolean } = {};
          favoriteItems.forEach((item: any) => {
            favoriteMap[item.itemUrl] = true;
          });
          setFavorites(favoriteMap);
        }
      }
    };

    fetchWishList();
  }, []);

  // 商品検索
  useEffect(() => {
    const fetchItems = async () => {
      if (!keyword) return;  // 検索キーワードがない場合は実行しない
      setLoading(true);
      setError(null);

      const data = await searchItems(keyword);
      if (data) {
        const fetchedItems = data.Items.map((itemWrapper: any) => itemWrapper.Item);
        setItems(fetchedItems);
      } else {
        setError('データの取得に失敗しました');
      }
      setLoading(false);
    };

    fetchItems();
  }, [keyword]);

  useEffect(() => {
    setKeyword('concealer');
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const searchValue = formData.get('keyword')?.toString().trim();
    setKeyword(searchValue || '');
  };

  const toggleFavorite = async (item: Item) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [item.itemUrl]: !prevFavorites[item.itemUrl],
    }));

    // お気に入りが追加されたらAPIを呼び出す
    const user = localStorage.getItem('user');
    if (user) {
      const username = JSON.parse(user).username;
      if (favorites[item.itemUrl]) {
        await deleteFavoriteItem(username, item.itemUrl);
      } else {
        await saveFavoriteItem(username, item);
      }
    }
    
    setFavoriteAdded(true);
  }

  return (
    <Box sx={{ padding: 4 }}>
      <form onSubmit={handleSearch}>
        <TextField
          name="keyword"
          placeholder="商品を検索"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 4 }}
        />
      </form>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {items.map((item, index) => (
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
                image={item.mediumImageUrls[0]?.imageUrl || 'https://via.placeholder.com/150'}
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

      <Snackbar
        open={favoriteAdded}
        autoHideDuration={2000}
        onClose={() => setFavoriteAdded(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success">Added Favorites!</Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;