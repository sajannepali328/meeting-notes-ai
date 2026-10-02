import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    alpha,
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoRenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const FullView = ({
    selectedNote,
    onClose,
    onRegenerate,
    onVerify,
    onReject,
    isRegenerating,
    isActionLoading,
}) => {
    const isProcessing = selectedNote.summary?.status === 'processing' || isRegenerating;

    const getStatusChip = (status) => {
        switch (status) {
            case 'verified':
                return <Chip label="Verified" color="success" size="small" sx={{ fontWeight: 'bold' }} />;
            case 'rejected':
                return <Chip label="Rejected" color="error" size="small" sx={{ fontWeight: 'bold' }} />;
            default:
                return <Chip label="Pending Verification" color="warning" size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
        }
    };

    return (
        <Dialog open={Boolean(selectedNote)} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip label={`Note ${selectedNote.id}`} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                    {getStatusChip(selectedNote.status)}
                    <Typography variant="h6" fontWeight="bold">
                        Meeting Details
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    {new Date(selectedNote.created_at).toLocaleString()}
                </Typography>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 3 }}>
                {isProcessing ? (
                    <Box
                        sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 3,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                        })}
                    >
                        <CircularProgress size={24} color="warning" />
                        <Typography variant="body1" color="warning.light" fontWeight="medium">
                            {selectedNote.summary?.message || 'AI is currently analyzing this meeting transcript...'}
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Overview */}
                        {selectedNote.summary?.overview && (
                            <Box>
                                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Overview
                                </Typography>
                                <Paper variant="outlined" sx={{ mt: 1, p: 2, borderRadius: 1, borderColor: 'divider' }}>
                                    <Typography variant="body2">{selectedNote.summary.overview}</Typography>
                                </Paper>
                            </Box>
                        )}

                        {/* Decisions */}
                        {selectedNote.summary?.decisions?.length > 0 && (
                            <Box>
                                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Decisions Made
                                </Typography>
                                <List dense disablePadding sx={{ mt: 1 }}>
                                    {selectedNote.summary.decisions.map((decision, index) => (
                                        <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <TaskAltIcon color="success" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary={decision} primaryTypographyProps={{ variant: 'body2' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        {/* Action Items Table */}
                        {selectedNote.summary?.action_items?.length > 0 && (
                            <Box>
                                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>
                                    Action Items & Ownership
                                </Typography>
                                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Owner</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Deadline</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedNote.summary.action_items.map((item, index) => (
                                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell>{item.task}</TableCell>
                                                    <TableCell>
                                                        <Chip label={item.owner} size="small" color="info" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }} />
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{item.deadline}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </>
                )}

                {/* Raw Transcript */}
                <Accordion elevation={0} disableGutters sx={{ border: 1, borderColor: 'divider', borderRadius: 1, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="caption" color="text.secondary" fontWeight="medium">
                            View raw transcript
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, borderColor: 'divider' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                                "{selectedNote.raw_text}"
                            </Typography>
                        </Paper>
                    </AccordionDetails>
                </Accordion>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Show Verify and Reject ONLY when pending (not verified or rejected) */}
                    {selectedNote.status !== 'verified' && selectedNote.status !== 'rejected' && (
                        <>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                disabled={isProcessing || isActionLoading}
                                onClick={() => onVerify(selectedNote.id)}
                            >
                                Verify
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CancelIcon />}
                                disabled={isProcessing || isActionLoading}
                                onClick={() => onReject(selectedNote.id)}
                            >
                                Reject
                            </Button>
                        </>
                    )}

                    {/* Show Regenerate ONLY when pending or rejected (hide when verified) */}
                    {selectedNote.status !== 'verified' && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={isProcessing ? <CircularProgress size={16} color="inherit" /> : <AutoRenewIcon />}
                            onClick={() => onRegenerate(selectedNote.id)}
                            disabled={isProcessing || isActionLoading}
                        >
                            Regenerate
                        </Button>
                    )}
                </Box>

                <Button onClick={onClose} variant="contained" color="inherit">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FullView;