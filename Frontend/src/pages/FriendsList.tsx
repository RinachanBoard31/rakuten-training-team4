import React, { useEffect, useState } from 'react';
import { fetchFriendList, removeFriend } from '../api/api';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FriendList: React.FC = () => {
  const [friends, setFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      setError(null);

      const user = localStorage.getItem('user');
      if (user) {
        const username = JSON.parse(user).username;
        const data = await fetchFriendList(username);
        if (data) {
          setFriends(data.friends);
        } else {
          setError('Failed to fetch friend list.');
        }
      }

      setLoading(false);
    };

    fetchFriends();
  }, []);

  const handleRemoveFriend = async (friend: string) => {
    const user = localStorage.getItem('user');
    if (user) {
      const username = JSON.parse(user).username;
      await removeFriend(username, friend);
      setFriends((prevFriends) => prevFriends.filter((f) => f !== friend));
    }
  };

  const handleSendFriendRequest = () => {
    navigate('/friends/send-request');
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
        Your Friends
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendFriendRequest}
        sx={{ marginBottom: 3 }}
      >
        Send Friend Request
      </Button>
      {friends.length === 0 ? (
        <Typography>No friends yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {friends.map((friend, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{friend}</Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveFriend(friend)}
                >
                  Remove
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FriendList;
