import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import MapIcon from '@mui/icons-material/Map';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';

import OverviewTab from './tabs/OverviewTab';
import PatientsTab from './tabs/PatientsTab';
import ImpactTab from './tabs/ImpactTab';
import EvidenceTab from './tabs/EvidenceTab';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0F4C81', light: '#1565C0', dark: '#0A3560' },
    secondary: { main: '#DC2626' },
    background: { default: '#F0F4F8', paper: '#FFFFFF' },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#DC2626' },
    info: { main: '#3B82F6' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700, letterSpacing: '-0.3px' },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body2: { fontSize: '0.825rem' },
    caption: { fontSize: '0.72rem' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 2px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
    '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)',
    '0 6px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
    '0 8px 24px rgba(0,0,0,0.12)',
    '0 10px 28px rgba(0,0,0,0.12)',
    '0 12px 32px rgba(0,0,0,0.14)',
    '0 14px 38px rgba(0,0,0,0.14)',
    '0 16px 40px rgba(0,0,0,0.15)',
    '0 18px 44px rgba(0,0,0,0.15)',
    '0 20px 48px rgba(0,0,0,0.16)',
    '0 22px 52px rgba(0,0,0,0.16)',
    '0 24px 56px rgba(0,0,0,0.18)',
    '0 26px 60px rgba(0,0,0,0.18)',
    '0 28px 64px rgba(0,0,0,0.18)',
    '0 30px 68px rgba(0,0,0,0.20)',
    '0 32px 72px rgba(0,0,0,0.20)',
    '0 34px 76px rgba(0,0,0,0.20)',
    '0 36px 80px rgba(0,0,0,0.22)',
    '0 38px 84px rgba(0,0,0,0.22)',
    '0 40px 88px rgba(0,0,0,0.22)',
    '0 42px 92px rgba(0,0,0,0.24)',
    '0 44px 96px rgba(0,0,0,0.24)',
    '0 46px 100px rgba(0,0,0,0.24)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.11), 0 2px 6px rgba(0,0,0,0.07)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.01em' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 52,
          '&.Mui-selected': { fontWeight: 700 },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      },
    },
  },
});

const TAB_CONFIG = [
  { label: 'Provincial Overview', icon: <MapIcon sx={{ fontSize: 18 }} /> },
  { label: 'Patient Risk Flagging', icon: <PersonSearchIcon sx={{ fontSize: 18 }} /> },
  { label: 'Projected Impact', icon: <TrendingUpIcon sx={{ fontSize: 18 }} /> },
  { label: 'Evidence Base',   icon: <AssessmentIcon sx={{ fontSize: 18 }} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedZone, setSelectedZone] = useState(null);

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone === selectedZone ? null : zone);
  };

  const goToPatients = (zone) => {
    setSelectedZone(zone);
    setActiveTab(1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #0A3560 0%, #0F4C81 60%, #1565C0 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Toolbar sx={{ py: 0.5, gap: 2, minHeight: 64 }}>
            {/* Title block */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ lineHeight: 1.2, letterSpacing: '-0.3px', color: '#fff' }}
              >
                NS Readmission Risk Dashboard
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.75, color: '#fff', fontWeight: 500, letterSpacing: '0.02em' }}
              >
                DataMinds — CGI × Sobey DataJam 2026
              </Typography>
            </Box>

            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Live badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box
                  sx={{
                    width: 8, height: 8, borderRadius: '50%',
                    bgcolor: '#4ADE80',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, opacity: 0.9, letterSpacing: '0.05em' }}>
                  LIVE DEMO
                </Typography>
              </Box>

              {/* Date */}
              <Chip
                label="March 7, 2026"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: { xs: 'none', sm: 'flex' },
                }}
              />

              {/* Attribution */}
              <Typography
                variant="caption"
                sx={{ opacity: 0.55, color: '#fff', display: { xs: 'none', md: 'block' } }}
              >
                Data: CIHI · NSHA · Statistics Canada
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Tab Navigation */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 64,
            zIndex: 100,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{ px: { xs: 1, sm: 3 } }}
            TabIndicatorProps={{ style: { height: 3, borderRadius: '3px 3px 0 0' } }}
          >
            {TAB_CONFIG.map((tab, i) => (
              <Tab
                key={i}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    {tab.icon}
                    <span>{tab.label}</span>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1600, mx: 'auto' }}>
          {activeTab === 0 && (
            <OverviewTab
              selectedZone={selectedZone}
              onZoneSelect={handleZoneSelect}
              onGoToPatients={goToPatients}
            />
          )}
          {activeTab === 1 && (
            <PatientsTab
              selectedZone={selectedZone}
              onZoneSelect={setSelectedZone}
            />
          )}
          {activeTab === 2 && <ImpactTab />}
          {activeTab === 3 && <EvidenceTab />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
