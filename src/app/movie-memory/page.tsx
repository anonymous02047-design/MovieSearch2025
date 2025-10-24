'use client';

import React, { useState } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Memory as MemoryIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function MovieMemoryPage() {
  const { user } = useUser();
  const [memories, setMemories] = useState<any[]>([]);
  const [newMemory, setNewMemory] = useState('');

  const addMemory = () => {
    if (newMemory.trim()) {
      const updated = [...memories, { text: newMemory, date: new Date().toISOString() }];
      setMemories(updated);
      localStorage.setItem('movieMemories', JSON.stringify(updated));
      setNewMemory('');
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('movieMemories');
    if (saved) setMemories(JSON.parse(saved));
  }, []);

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <MemoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Memories</Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField fullWidth label="Share a movie memory..." value={newMemory} onChange={(e) => setNewMemory(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" onClick={addMemory}>Add Memory</Button>
          </Box>
          <List>
            {memories.map((m, i) => (
              <ListItem key={i} secondaryAction={<IconButton onClick={() => {
                const updated = memories.filter((_, idx) => idx !== i);
                setMemories(updated);
                localStorage.setItem('movieMemories', JSON.stringify(updated));
              }}><DeleteIcon /></IconButton>}>
                <ListItemText primary={m.text} secondary={new Date(m.date).toLocaleDateString()} />
              </ListItem>
            ))}
          </List>
        </Container>
      </Box>
    </AuthGuard>
  );
}

