'use client';

import React, { useState } from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  Casino as RandomIcon,
  Compare as CompareIcon,
  CalendarMonth as CalendarIcon,
  Download as ExportIcon,
  Note as NoteIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

interface FloatingQuickActionsProps {
  onRandomMovie?: () => void;
  onCompare?: () => void;
  onCalendar?: () => void;
  onExport?: () => void;
  onNotes?: () => void;
  onHistory?: () => void;
}

export default function FloatingQuickActions({
  onRandomMovie,
  onCompare,
  onCalendar,
  onExport,
  onNotes,
  onHistory,
}: FloatingQuickActionsProps) {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: <RandomIcon />, name: 'Random Movie', onClick: onRandomMovie },
    { icon: <CompareIcon />, name: 'Compare Movies', onClick: onCompare },
    { icon: <CalendarIcon />, name: 'Release Calendar', onClick: onCalendar },
    { icon: <ExportIcon />, name: 'Export Data', onClick: onExport },
    { icon: <NoteIcon />, name: 'My Notes', onClick: onNotes },
    { icon: <HistoryIcon />, name: 'Viewing History', onClick: onHistory },
  ].filter(action => action.onClick); // Only show actions with handlers

  return (
    <SpeedDial
      ariaLabel="Quick Actions"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        '& .MuiSpeedDial-fab': {
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        },
      }}
      icon={<SpeedDialIcon />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => {
            action.onClick?.();
            setOpen(false);
          }}
        />
      ))}
    </SpeedDial>
  );
}

