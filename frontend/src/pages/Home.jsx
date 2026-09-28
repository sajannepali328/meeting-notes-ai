import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
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
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha,
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { API } from '../api/URL';
import { useFetchQuery } from '../api/useFetchQuery';

// ----------------------------------------------------------------------
// 1. Separate Detail Modal Component
// ----------------------------------------------------------------------
export const FullView = ({ selectedNote, onClose }) => {
  if (!selectedNote) return null;

  return (
    <Dialog open={Boolean(selectedNote)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip label={`Note ${selectedNote.id}`} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
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
        {selectedNote.summary?.status === 'processing' ? (
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
              {selectedNote.summary.message || 'AI is currently analyzing this meeting transcript...'}
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
                <Paper
                  variant="outlined"
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: 1,
                    borderColor: 'divider',
                  }}
                >
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
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                "{selectedNote.raw_text}"
              </Typography>
            </Paper>
          </AccordionDetails>
        </Accordion>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ----------------------------------------------------------------------
// 2. Main Home Page Component
// ----------------------------------------------------------------------
const Home = () => {
  const { data: notes, isLoading, error } = useFetchQuery(API.notes);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleRowClick = (note) => {
    setSelectedNote(note);
  };

  const handleCloseDialog = () => {
    setSelectedNote(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Alert severity="error">Failed to load meeting notes. Please check your network or server.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Meeting Intelligence Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on any meeting row to view detailed insights, decisions, and action items.
        </Typography>
      </Box>

      {/* Main Table */}
      {!notes || notes.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No meeting notes found. Submit a transcript to see generated insights!
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Id</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Overview</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.map((note) => {
                const isProcessing = note.summary?.status === 'processing';
                const summary = note.summary || {};

                return (
                  <TableRow
                    key={note.id}
                    hover
                    onClick={() => handleRowClick(note)}
                    sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Chip label={`${note.id}`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary', fontSize: '0.85rem' }}>
                      {new Date(note.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 350 }}>
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
                    <TableCell>
                      {isProcessing ? (
                        <Chip label="Processing" color="warning" size="small" icon={<CircularProgress size={12} color="inherit" />} />
                      ) : (
                        <Chip label="Completed" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(note);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Render Sub-component */}
      <FullView selectedNote={selectedNote} onClose={handleCloseDialog} />
    </Container>
  );
};

export default Home;