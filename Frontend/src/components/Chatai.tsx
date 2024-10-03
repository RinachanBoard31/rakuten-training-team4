import React, { useState } from 'react'
import { chatSearchItems } from '../api/api'
import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Chatai = () => {
    const [chatResponse, setChatResponse] = useState([]);
    const [prompt, setPrompt] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const response = await chatSearchItems(prompt)
            setChatResponse(response)
        } catch(error) {
            console.error(error)
        }
        
      };
  return (
    <Box>
        <form onSubmit={handleSubmit}>
            <Typography>Hello! how can I help you?</Typography>
            <TextField
            label="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                     <ChevronRightIcon/>
                </InputAdornment>
                ),
            }}
            />
           
        </form>
    </Box>
  )
}

export default Chatai