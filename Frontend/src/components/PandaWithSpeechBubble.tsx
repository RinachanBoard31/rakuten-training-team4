// src/components/PandaWithSpeechBubble.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface PandaWithSpeechBubbleProps {
  speechText: string;
  handlePandaClick: () => void;
  isAnswering?: boolean;
}

const PandaWithSpeechBubble: React.FC<PandaWithSpeechBubbleProps> = ({ speechText, handlePandaClick, isAnswering }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      {/* パンダのアイコン */}
      <Box>
        <img
          src="/assets/panda.jpg" // public/assets 配下の画像パスに置き換えてください
          alt="Panda Icon"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={handlePandaClick}
        />
        {/* 吹き出し */}
        <Box
          sx={{
            position: 'absolute',
            top: '-50px',
            left: '90px', // パンダアイコンの右側に配置
            backgroundColor: '#c450a0',
            color: '#fff',
            padding: '10px',
            borderRadius: '10px',
            display: 'inline-block', // コンテンツに合わせて幅を調整
            width: 'auto', // 幅を自動調整
            minWidth: '400px', // 必要に応じて最小幅を設定
            maxWidth: '1000px', // 必要に応じて最大幅を設定
            zIndex: 1,
            wordWrap: 'break-word',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '60%',
              left: '-10px',
              transform: 'translateY(-50%)',
              // rotate: '-45deg',
              borderWidth: '5px',
              borderStyle: 'solid',
              borderColor: 'transparent #c450a0 transparent transparent',
            },
          }}
        >
          <Typography variant="body1">{speechText}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PandaWithSpeechBubble;
