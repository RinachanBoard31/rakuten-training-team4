// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#a61e27', // ヘッダーの背景色
    },
    secondary: {
      main: '#dc004e', // 任意の色
    },
  },
  typography: {
    fontFamily: 'Lobster, cursive, Roboto, Arial, sans-serif', // フォントファミリー
  },
});

export default theme;
