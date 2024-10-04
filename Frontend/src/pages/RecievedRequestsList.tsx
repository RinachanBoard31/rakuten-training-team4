// src/pages/ReceivedRequests.tsx
import React, { useEffect, useState } from 'react';
import { fetchReceivedRequests, acceptFriendRequest, rejectFriendRequest } from '../api/api';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress, useRadioGroup } from '@mui/material';

interface Request {
  id: number;
  sender: string;
}

const ReceivedRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUsername(JSON.parse(user).username);
    }
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!username) return; // ユーザ名が取得できるまで待つ
      
      setLoading(true);
      setError(null);

      try {
        const data = await fetchReceivedRequests(username);
        if (data && data.received_requests.length > 0) {
          setRequests(data.received_requests);
        } else {
          setRequests([]);  // リクエストが存在しない場合
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          // 404エラーをキャッチして、適切に処理する
          setRequests([]);  // 友達リクエストがない場合として処理
        } else {
          setError('Failed to fetch friend requests.');
        }
      }

      setLoading(false);
    };

    if (username) {
      fetchRequests();
    }
  }, [username]);

  const handleAccept = async (requestId: number) => {
    await acceptFriendRequest(requestId, username);
    setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
  };

  const handleReject = async (requestId: number) => {
    await rejectFriendRequest(requestId);
    setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
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
        Friend Requests
      </Typography>
      {requests.length === 0 ? (
        <Typography>No friend requests.</Typography>
      ) : (
        <Grid container spacing={2}>
          {requests.map((request, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{request.sender}</Typography>
                </CardContent>
                <Button variant="contained" color="primary" onClick={() => handleAccept(request.id)}>
                  Accept
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleReject(request.id)}>
                  Reject
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ReceivedRequests;
