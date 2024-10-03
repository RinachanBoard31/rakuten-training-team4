import React, { useEffect, useState } from 'react';
import { searchItems } from '../api/api';
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
import { FavoriteBorder, Favorite } from '@mui/icons-material';

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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const searchValue = formData.get('keyword')?.toString().trim();
    setKeyword(searchValue || '');
  };

  const toggleFavorite = (itemCode: string) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [itemCode]: !prevFavorites[itemCode],
    }));
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
                    Go Page
                  </Button>
                  <IconButton onClick={() => toggleFavorite(item.itemUrl)}>
                    {favorites[item.itemUrl] ? (
                      <Favorite sx={{ color: 'red' }} />
                    ) : (
                      <FavoriteBorder />
                    )}
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


// // src/pages/Home.tsx
// import React, { useEffect, useState } from 'react';
// import { searchItems } from '../api/api';
// import {
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Button,
//   CircularProgress,
//   Box,
// } from '@mui/material';

// interface Item {
//   itemName: string;
//   itemPrice: number;
//   itemUrl: string;
//   mediumImageUrls: Array<{ imageUrl: string }>;
//   smallImageUrls: Array<{ imageUrl: string }>;
//   // 他の必要なフィールドを追加する（後で）
// }

// const Home: React.FC = () => {
//   const [items, setItems] = useState<Item[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   console.log("items", items);  

//   useEffect(() => {
//     const fetchItems = async () => {
//       setLoading(true);
//       setError(null);
//       let keyword = "化粧品";
//       const data = await searchItems(keyword);
//       if (data) {
//         const fetchedItems = data.Items.map(itemWrapper => itemWrapper.Item);
//         setItems(fetchedItems);
//       } else {
//         setError("データの取得に失敗しました");
//       }
//       setLoading(false);
//     };

//     fetchItems();
//   }, []);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Grid container spacing={2}>
//       {items.map((item, index) => (
//         <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
//           <Card
//             sx={{
//               height: '100%', // カードの高さをグリッドセルに合わせる
//               display: 'flex',
//               flexDirection: 'column',
//               transition: 'transform 0.2s',
//               '&:hover': {  
//                 transform: 'scale(1.02)',
//               },
//             }}
//           >
//             <CardMedia
//               component="img"
//               height="64"
//               image={item.smallImageUrls[0]?.imageUrl || 'https://via.placeholder.com/150'}
//               alt={item.itemName}
//               sx={{
//                 objectFit: 'cover', // 画像の切り取り方を調整
//               }}
//             />
//             <CardContent
//               sx={{
//                 flexGrow: 1,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 padding: 1, // パディングを小さく設定
//               }}
//             >
//               <Typography
//                 variant="subtitle1" 
//                 component="div"
//                 gutterBottom
//                 sx={{
//                   fontWeight: 'bold',
//                   overflow: 'hidden',
//                   textOverflow: 'ellipsis',
//                   display: '-webkit-box',
//                   WebkitLineClamp: 2, // 最大2行まで表示
//                   WebkitBoxOrient: 'vertical',
//                 }}
//               >
//                 {item.itemName}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 sx={{
//                   overflow: 'hidden',
//                   textOverflow: 'ellipsis',
//                   display: '-webkit-box',
//                   WebkitLineClamp: 1,
//                   WebkitBoxOrient: 'vertical',
//                   marginBottom: 'auto', 
//                   fontSize: '0.875rem', 
//                 }}
//               >
//                 ¥{item.itemPrice}
//               </Typography>
//               <Button
//                 href={item.itemUrl}
//                 target="_blank"
//                 rel="noopener"
//                 variant="contained"
//                 color="primary"
//                 size="small"
//                 sx={{
//                   marginTop: 'auto', 
//                 }}
//               >
//                 詳細を見る
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default Home;
