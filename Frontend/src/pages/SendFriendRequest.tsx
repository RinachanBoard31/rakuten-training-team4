import React, { useState } from 'react';
import { sendFriendRequest } from '../api/api';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

const SendFriendRequest: React.FC = () => {
  const [receiver, setReceiver] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    if (user) {
      const sender = JSON.parse(user).username;
      const response = await sendFriendRequest(sender, receiver);
      setMessage(response.message);
      setSuccess(true);

      // フォームをリセット
      setReceiver('');
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Send Friend Request
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Friend Username"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Send Request
        </Button>
      </form>

      {/* リクエスト成功時に大きくメッセージを表示 */}
      {success && (
        <Alert
          severity="success"
          sx={{
            marginTop: 3,
            fontSize: '1.25rem',  // 大きなフォントサイズで目立つように
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default SendFriendRequest;
