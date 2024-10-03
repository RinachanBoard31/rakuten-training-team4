// src/components/ChatPandaAI.jsx
import React, { useState } from 'react';
import { chatMessageRequest, chatSearchItems } from '../api/api';
import { Box, TextField, InputAdornment, Typography, BackdropProps, Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PandaWithSpeechBubble from './PandaWithSpeechBubble';
import { Item } from '../pages/Home';
import { testitems } from '../entity/testItem';
import { log } from 'console';

interface ChatPandaAIProps {
  handlePandaClick: () => void;
  setItems: React.Dispatch<React.SetStateAction<Item[]>>,
  enableBackendAI?: boolean;
}

const ChatPandaAI: React.FC<ChatPandaAIProps> = ({ handlePandaClick,  setItems, enableBackendAI}) => {
  const [chatResponse, setChatResponse] = useState('こんにちは！探し物を教えてね！'); // 初期メッセージ
  const [prompt, setPrompt] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  const handleAnswering = (changeState: boolean) => {
    setIsAnswering(changeState);
    if (!changeState) {
      setChatResponse('こんにちは！探し物を教えてね！');
      setPrompt('');
    }
  }

  const handleSubmit = async (e: any) => {
    setChatResponse("ふむふむ，少しだけ待っててね！")
    e.preventDefault();

    // In case you disable the backend AI, the test data will be used to display the cosmetics data automatically.
    if (!enableBackendAI) {
      const data = testitems;
      const fetchedItems = data.map((itemWrapper: any) => itemWrapper.Item);
      console.log(fetchedItems);
      setItems(fetchedItems)
      setChatResponse("I found test cosmetics data for you!");
      return;
    }

    try {
      const data = await chatSearchItems(prompt);
      console.log(data.Items);
      if (data) {
        const fetchedItems = data.Items.map((itemWrapper: any) => itemWrapper.Item);
        setItems(fetchedItems);
      }

      const message = await chatMessageRequest(prompt);
      if(message.message) {
        setChatResponse(message.message); 
      } else {
        setChatResponse("ごめんね、ぼくまだ7歳だからわからないことあるんだ．．．");
      }
    } catch (error) {
      console.error(error);
      setChatResponse('エラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <Box sx={{ padding: '20px 20px', paddingTop: '40px', width: '100%' }}>

        {isAnswering ? (
          <Box sx={{ display: 'flex', justifyContent: 'center',  marginRight: 2 }}>
            <Button onClick={() => handleAnswering(false)}>もう一度聞く</Button>
            <PandaWithSpeechBubble speechText={chatResponse} handlePandaClick={handlePandaClick} isAnswering/>
          </Box>
        ): (
          <Box display="flex" alignItems="center" width="100%">
            <Box sx={{ marginRight: 2 }}>
              <PandaWithSpeechBubble speechText={chatResponse} handlePandaClick={handlePandaClick} isAnswering/>
            </Box>
              {/* 検索フォーム */}
                <form onSubmit={(e) => { handleAnswering(true); handleSubmit(e); }} style={{ flexGrow: 1 }}>
                <TextField
                  name="keyword"
                  placeholder="Young Panda AIに相談してみよう！"
                  fullWidth
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ChevronRightIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: 4 }}
                />
              </form>
          </Box>
        )}
        
      
    </Box>
  );
};

export default ChatPandaAI;
