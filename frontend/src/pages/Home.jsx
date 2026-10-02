import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { API } from '../api/URL';
import { useFetchQuery, useApiMutation } from '../api/useFetchQuery';
import FullView from './FullView';
import NotesTable from './NotesTable';

const Home = () => {
  const { data: notes, isLoading, refetch, isFetching } = useFetchQuery(API.notes);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeRegeneratingId, setActiveRegeneratingId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const mutation = useApiMutation();

  const handleRegenerate = async (id) => {
    try {
      setActiveRegeneratingId(id);
      await mutation.mutateAsync({
        method: 'POST',
        url: `${API.notes}${id}/regenerate/`,
      });

      if (refetch) await refetch();

      if (selectedNote && selectedNote.id === id) {
        setSelectedNote((prev) => ({
          ...prev,
          summary: { status: 'processing', message: 'Regenerating summary...' },
        }));
      }
    } catch (err) {
      console.error('Failed to regenerate summary:', err);
    } finally {
      setActiveRegeneratingId(null);
    }
  };

  const handleVerify = async (id) => {
    try {
      setActionLoadingId(id);
      await mutation.mutateAsync({
        method: 'POST',
        url: `${API.notes}${id}/verify/`,
      });

      if (refetch) await refetch();

      if (selectedNote && selectedNote.id === id) {
        setSelectedNote((prev) => ({ ...prev, status: 'verified' }));
      }
    } catch (err) {
      console.error('Failed to verify note:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoadingId(id);
      await mutation.mutateAsync({
        method: 'POST',
        url: `${API.notes}${id}/reject/`,
      });

      if (refetch) await refetch();

      if (selectedNote && selectedNote.id === id) {
        setSelectedNote((prev) => ({ ...prev, status: 'rejected' }));
      }
    } catch (err) {
      console.error('Failed to reject note:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionLoadingId(id);
      await mutation.mutateAsync({
        method: 'DELETE',
        url: `${API.notes}${id}/`,
      });

      if (refetch) await refetch();

      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
    } catch (err) {
      console.error('Failed to delete note:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Meeting Intelligence Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click on any meeting row to view detailed insights, decisions, and verify AI responses.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={isFetching ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          onClick={() => refetch && refetch()}
          disabled={isFetching}
          sx={{ ml: 'auto', whiteSpace: 'nowrap' }}
        >
          Refresh
        </Button>
      </Box>

      {/* Main Table Sub-component */}
      <NotesTable
        notes={notes}
        activeRegeneratingId={activeRegeneratingId}
        actionLoadingId={actionLoadingId}
        onRowClick={(note) => setSelectedNote(note)}
        onRegenerate={handleRegenerate}
        onVerify={handleVerify}
        onReject={handleReject}
        onDelete={handleDelete}
      />

      {/* Detail Modal Sub-component */}
      {selectedNote && (
        <FullView
          selectedNote={selectedNote}
          onClose={() => setSelectedNote(null)}
          onRegenerate={handleRegenerate}
          onVerify={handleVerify}
          onReject={handleReject}
          onDelete={handleDelete}
          isRegenerating={activeRegeneratingId === selectedNote?.id}
          isActionLoading={actionLoadingId === selectedNote?.id}
        />
      )}
    </Box>
  );
};

export default Home;