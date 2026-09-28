import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    CircularProgress,
    Alert,
    Paper,
    Stack,
    Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useApiMutation } from '../api/useFetchQuery';
import { API } from '../api/URL';

const Upload = () => {
    const [textContent, setTextContent] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const mutation = useApiMutation();

    const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
    const charCount = textContent.length;

    const handleUpload = async () => {
        if (!textContent.trim()) return;

        try {
            await mutation.mutateAsync({
                method: 'POST',
                url: API.notes,
                payload: { raw_text: textContent },
            });
            setUploadSuccess(true);
            setTextContent('');
        } catch (err) {
            console.log(err);
        }
    };

    if (mutation.isPending) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                }}
            >
                <CircularProgress color="inherit" size={48} sx={{ mb: 2.5 }} />
                <Typography variant="h6" fontWeight={600} color="#ffffff">
                    Processing Submission
                </Typography>
                <Typography variant="body2" color="#737373" sx={{ mt: 0.5 }}>
                    Uploading data to the backend engine...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 820, mx: 'auto', py: 3 }}>
            {/* Header Section */}
            <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <Chip
                            label="MEETING NOTES"
                            size="small"
                            sx={{
                                bgcolor: '#171717',
                                color: '#a3a3a3',
                                fontWeight: 700,
                                fontSize: '0.65rem',
                                letterSpacing: '0.08em',
                                border: '1px solid #262626',
                                borderRadius: '4px',
                            }}
                        />
                    </Stack>
                    <Typography variant="h4" fontWeight={800} color="#ffffff" letterSpacing="-0.03em">
                        Submit Transcript
                    </Typography>
                    <Typography variant="body2" color="#737373" sx={{ mt: 0.5 }}>
                        Provide text content to generate AI meeting notes.
                    </Typography>
                </Box>
            </Box>

            {/* Main Workspace Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    bgcolor: '#121212',
                    borderRadius: 3,
                    border: '1px solid #1e1e1e',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
            >
                {/* Text Input View */}
                <Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={12}
                        placeholder="Paste your raw transcript or text notes here..."
                        value={textContent}
                        onChange={(e) => {
                            setTextContent(e.target.value);
                            if (uploadSuccess) setUploadSuccess(false);
                        }}
                        sx={{
                            bgcolor: '#080808',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                color: '#ffffff',
                                fontSize: '0.925rem',
                                lineHeight: 1.6,
                                p: 2.5,
                                '& fieldset': {
                                    borderColor: '#1e1e1e',
                                    transition: 'all 0.2s ease',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#333333',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#525252',
                                    borderWidth: '1px',
                                },
                            },
                        }}
                    />

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mt: 1.5, px: 0.5 }}
                    >
                        <Stack direction="row" spacing={2.5}>
                            <Typography variant="caption" color="#525252" fontWeight={500}>
                                WORDS: <span style={{ color: '#a3a3a3' }}>{wordCount}</span>
                            </Typography>
                            <Typography variant="caption" color="#525252" fontWeight={500}>
                                CHARACTERS: <span style={{ color: '#a3a3a3' }}>{charCount}</span>
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>

                {/* Submit Action Button */}
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={!textContent.trim()}
                    onClick={handleUpload}
                    endIcon={<SendIcon />}
                    sx={{
                        mt: 3,
                        py: 1.4,
                        bgcolor: '#ffffff',
                        color: '#000000',
                        fontWeight: 700,
                        fontSize: '0.925rem',
                        textTransform: 'none',
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            bgcolor: '#e5e5e5',
                        },
                        '&.Mui-disabled': {
                            bgcolor: '#1c1c1c',
                            color: '#404040',
                        },
                    }}
                >
                    Submit Notes
                </Button>
            </Paper>

            {/* Status Notifications */}
            {uploadSuccess && (
                <Alert
                    severity="success"
                    onClose={() => setUploadSuccess(false)}
                    sx={{
                        mt: 3,
                        bgcolor: '#062010',
                        color: '#4ade80',
                        border: '1px solid #14532d',
                        borderRadius: 2,
                        '& .MuiAlert-icon': { color: '#4ade80' },
                    }}
                >
                    Content submitted successfully!
                </Alert>
            )}

            {mutation.isError && (
                <Alert
                    severity="error"
                    sx={{
                        mt: 3,
                        bgcolor: '#2a1215',
                        color: '#f87171',
                        border: '1px solid #7f1d1d',
                        borderRadius: 2,
                        '& .MuiAlert-icon': { color: '#f87171' },
                    }}
                >
                    {mutation.error?.message || 'Failed to submit data. Please check connection.'}
                </Alert>
            )}
        </Box>
    );
};

export default Upload;