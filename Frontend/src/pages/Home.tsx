// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { searchItems } from '../api/api.ts';
import { Typography, Grid, Card, CardContent, CardMedia, Button, CircularProgress } from '@mui/material';

interface Item {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrls: Array<{ imageUrl: string }>;
  // 他の必要なフィールドを追加
}

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      let keyword = "化粧品";
      const data = await searchItems(keyword);
      if (data) {
        const fetchedItems = data.Items.map(itemWrapper => itemWrapper.Item);
        setItems(fetchedItems);
      } else {
        setError("データの取得に失敗しました");
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={item.mediumImageUrls[0]?.imageUrl}
              alt={item.itemName}
            />
            <CardContent>
              <Typography variant="h6">{item.itemName}</Typography>
              <Typography variant="body2" color="text.secondary">
                ¥{item.itemPrice}
              </Typography>
              <Button href={item.itemUrl} target="_blank" rel="noopener" variant="contained" color="primary">
                詳細を見る
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;
