import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    CircularProgress,
    Typography,
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutoRenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';

const renderStatusChip = (status, isProcessing) => {
    if (isProcessing) {
        return (
            <Chip
                label="Processing"
                color="warning"
                size="small"
                icon={<CircularProgress size={12} color="inherit" />}
            />
        );
    }

    switch (status) {
        case 'verified':
            return <Chip label="Verified" color="success" size="small" variant="filled" />;
        case 'rejected':
            return <Chip label="Rejected" color="error" size="small" variant="filled" />;
        default:
            return <Chip label="Pending Verification" color="warning" size="small" variant="outlined" />;
    }
};

const NotesTable = ({
    notes,
    activeRegeneratingId,
    actionLoadingId,
    onRowClick,
    onRegenerate,
    onDelete,
}) => {

    if (!notes || notes.length === 0) {
        return (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    No meeting notes found. Submit a transcript to see generated insights!
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Id</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Overview</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Verification Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {notes.map((note) => {
                        const isItemRegenerating = activeRegeneratingId === note.id;
                        const isActionLoading = actionLoadingId === note.id;
                        const isProcessing = note.summary?.status === 'processing' || isItemRegenerating;
                        const summary = note.summary || {};

                        return (
                            <TableRow
                                key={note.id}
                                hover
                                onClick={() => onRowClick(note)}
                                sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>
                                    <Chip
                                        label={`${note.id}`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary', fontSize: '0.85rem' }}>
                                    {new Date(note.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ maxWidth: 300 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            color: isProcessing ? 'text.secondary' : 'text.primary',
                                        }}
                                    >
                                        {isProcessing ? 'Processing AI summary...' : summary.overview || 'No overview generated'}
                                    </Typography>
                                </TableCell>
                                <TableCell>{renderStatusChip(note.status, isProcessing)}</TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Tooltip title="Regenerate Summary">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="secondary"
                                                    disabled={isProcessing || isActionLoading}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRegenerate(note.id);
                                                    }}
                                                >
                                                    {isItemRegenerating ? (
                                                        <CircularProgress size={18} color="inherit" />
                                                    ) : (
                                                        <AutoRenewIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Delete Note">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    disabled={isProcessing || isActionLoading}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to delete this note?')) {
                                                            onDelete(note.id);
                                                        }
                                                    }}
                                                >
                                                    {isActionLoading ? (
                                                        <CircularProgress size={18} color="inherit" />
                                                    ) : (
                                                        <DeleteIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Button
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRowClick(note);
                                            }}
                                        >
                                            View
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default NotesTable;