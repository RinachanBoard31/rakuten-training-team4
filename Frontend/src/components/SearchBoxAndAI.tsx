import React, { useState } from 'react';
import { Box, TextField, InputAdornment, Tooltip, IconButton, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatPandaAI from './ChatPandaAI';
import { Item } from '../pages/Home';

interface SearchBoxAndAIProps {
  handleSearch: (event: React.FormEvent<HTMLFormElement>) => void;
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
}

const SearchBoxAndAI: React.FC<SearchBoxAndAIProps> = ({ handleSearch , setItems}) => {
    const [enableAichat, setEnableAichat] = useState<boolean>(false);
    const [enableBackendAI, setEnableBackendAI] = useState<boolean>(false);
    const handlePandaClick = () => {
        console.log('Panda clicked');
        if (enableAichat) {
            setEnableAichat(false);
        } else {
            setEnableAichat(true);
        }
       
    }

    const handleEnableBackendAI = () => {
        if (enableBackendAI) {
            setEnableBackendAI(false);
        } else {
            setEnableBackendAI(true);
        }
    }

    return (enableAichat ? (
        <Box>
            {/* delete this function in demo */}
            {/* tokenの上限があるので、デモ用に一時的にAIにリクエストを送らないようにするための機能です． */}
            {enableBackendAI ? (
                <Button variant="contained" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleEnableBackendAI}>Backend AI Enabled</Button>
            ) : (
                <Button variant="contained" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleEnableBackendAI}>Backend AI Disabled</Button>
            )}
            <ChatPandaAI handlePandaClick={handlePandaClick} setItems={setItems} enableBackendAI={enableBackendAI}/>
        </Box>
    ) : (
        <Box>
            {/* delete this function in demo */}
            {/* tokenの上限があるので、デモ用に一時的にAIにリクエストを送らないようにするための機能です． */}
            {enableBackendAI ? (
                <Button variant="contained" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleEnableBackendAI}>Backend AI Enabled</Button>
            ) : (
                <Button variant="contained" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleEnableBackendAI}>Backend AI Disabled</Button>
            )}
            <Box display="flex" alignItems="center" width="100%" sx={{ position: 'relative' }}>
                <Box display="flex" alignItems="center" width="100%" sx={{ position: 'relative' }}>
                    <Tooltip
                        title="Z panda AIを利用してね！"
                        arrow
                        placement="top"
                        open={true} // 常に表示
                        disableHoverListener
                        disableFocusListener
                        disableTouchListener
                        sx={{
                        marginRight: 2, 
                        }}
                    >
                        <IconButton onClick={handlePandaClick}>
                        <img
                            src="/assets/panda.jpg" 
                            alt="Panda Icon"
                            style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            }}
                        />
                        </IconButton>
                    </Tooltip>

                    {/* 検索フォーム */}
                    <form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
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
                        sx={{ marginBottom: 4, marginTop: 4 }}
                        />
                    </form>
                </Box>
            </Box>

    </Box>
    )
    );
};

export default SearchBoxAndAI;
