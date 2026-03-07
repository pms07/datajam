import { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

import { PATIENT_DATA, ZONE_DATA } from '../data/constants';

const RISK_META = {
  Critical: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: <ErrorIcon sx={{ fontSize: 14 }} />, muiColor: 'error' },
  Moderate: { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', icon: <WarningIcon sx={{ fontSize: 14 }} />, muiColor: 'warning' },
  Low:      { color: '#10B981', bg: '#F0FDF4', border: '#A7F3D0', icon: <CheckCircleIcon sx={{ fontSize: 14 }} />, muiColor: 'success' },
};

const ZONE_COLORS = {
  Northern: '#DC2626',
  Eastern:  '#F59E0B',
  Western:  '#3B82F6',
  Central:  '#10B981',
};

const STATUS_META = {
  'Awaiting Callback':    { color: '#DC2626', bg: '#FEF2F2' },
  'Follow-up Scheduled':  { color: '#F59E0B', bg: '#FFFBEB' },
  'Escalated':            { color: '#8B5CF6', bg: '#F5F3FF' },
  'Discharged':           { color: '#10B981', bg: '#F0FDF4' },
};

function RiskScorePill({ score, level }) {
  const rm = RISK_META[level] || RISK_META.Low;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 0.5,
        borderRadius: 99,
        bgcolor: rm.bg,
        border: `1px solid ${rm.border}`,
        minWidth: 56,
        justifyContent: 'center',
      }}
    >
      {rm.icon}
      <Typography variant="caption" fontWeight={800} sx={{ color: rm.color }}>
        {score}
      </Typography>
    </Box>
  );
}

function ExpandedPatient({ patient, onAction }) {
  const rm = RISK_META[patient.riskLevel] || RISK_META.Low;
  const maxScore = 30;

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: '#FAFAFA',
        borderTop: `3px solid ${rm.color}`,
        borderBottom: `1px solid #E5E7EB`,
      }}
    >
      <Grid container spacing={3}>
        {/* Risk Factor Breakdown */}
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: 'text.primary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Risk Factor Breakdown
            <Tooltip title="Each factor's contribution to the total risk score (max 100)" arrow>
              <Typography variant="caption" sx={{ color: 'text.disabled', cursor: 'help' }}>ⓘ</Typography>
            </Tooltip>
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
            {patient.riskFactors.map((rf) => (
              <Box key={rf.factor}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ color: '#374151' }}>
                    {rf.factor}
                  </Typography>
                  <Typography variant="body2" fontWeight={800} sx={{ color: rm.color }}>
                    {rf.score.toFixed(1)} pts
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((rf.score / maxScore) * 100, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#E5E7EB',
                    mb: 0.5,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: rm.color,
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {rf.detail}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Action Panel */}
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Patient Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ width: 80 }}>Zone</Typography>
              <Typography variant="caption" fontWeight={600} sx={{ color: ZONE_COLORS[patient.zone] }}>
                ● {patient.zone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ width: 80 }}>Diagnosis</Typography>
              <Typography variant="caption" fontWeight={600}>{patient.primaryDiagnosis}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ width: 80 }}>Comorbidities</Typography>
              <Typography variant="caption" fontWeight={600}>
                {patient.comorbidities.length > 0 ? patient.comorbidities.join(', ') : 'None'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ width: 80 }}>Family GP</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: patient.hasFamilyPhysician ? '#10B981' : '#DC2626' }}>
                {patient.hasFamilyPhysician ? '✓ Assigned' : '✗ None'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ width: 80 }}>LTC Bed</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: patient.ltcBedAvailable ? '#10B981' : '#DC2626' }}>
                {patient.ltcBedAvailable ? '✓ Available' : '✗ None'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ width: 80 }}>Discharge</Typography>
              <Typography variant="caption" fontWeight={600}>{patient.dischargeDate}</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              p: 1.5, bgcolor: rm.bg,
              borderRadius: 2, border: `1px solid ${rm.border}`,
              mb: 2,
            }}
          >
            <Typography variant="caption" fontWeight={700} sx={{ color: rm.color }} display="block" gutterBottom>
              Recommended Action
            </Typography>
            <Typography variant="caption" sx={{ color: '#374151' }}>
              {patient.recommendedAction}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<PhoneCallbackIcon />}
              color="error"
              onClick={() => onAction('callback', patient)}
              sx={{ fontSize: '0.72rem', flex: 1 }}
            >
              Schedule 48-hr Callback
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LocalHospitalIcon />}
              color="primary"
              onClick={() => onAction('escalate', patient)}
              sx={{ fontSize: '0.72rem', flex: 1 }}
            >
              Escalate to GP
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

// Build zone/risk distribution data for sidebar charts
const zoneDist = ZONE_DATA.map((z) => ({
  name: z.zone,
  value: PATIENT_DATA.filter((p) => p.zone === z.zone).length,
  color: z.color,
})).filter((z) => z.value > 0);

const avgRiskByZone = ZONE_DATA.map((z) => {
  const pts = PATIENT_DATA.filter((p) => p.zone === z.zone);
  return {
    zone: z.zone,
    avgRisk: pts.length > 0 ? Math.round(pts.reduce((s, p) => s + p.riskScore, 0) / pts.length) : 0,
    color: z.color,
  };
}).filter((z) => z.avgRisk > 0);

const FILTER_OPTIONS = ['All', 'Critical', 'Moderate', 'Low'];

export default function PatientsTab({ selectedZone, onZoneSelect }) {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState(selectedZone || 'All');
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState(null);
  const [statuses, setStatuses] = useState({});

  const handleAction = useCallback((type, patient) => {
    const msg = type === 'callback'
      ? `Callback scheduled for ${patient.name} (${patient.id})`
      : `Case escalated to GP for ${patient.name} (${patient.id})`;
    setSnackbar(msg);
    setStatuses((prev) => ({
      ...prev,
      [patient.id]: type === 'callback' ? 'Follow-up Scheduled' : 'Escalated',
    }));
  }, []);

  const patients = useMemo(() => {
    return PATIENT_DATA
      .filter((p) => {
        if (filter !== 'All' && p.riskLevel !== filter) return false;
        if (zoneFilter !== 'All' && p.zone !== zoneFilter) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
            !p.primaryDiagnosis.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [filter, zoneFilter, search]);

  const summary = useMemo(() => ({
    total: PATIENT_DATA.length,
    critical: PATIENT_DATA.filter((p) => p.riskLevel === 'Critical').length,
    moderate: PATIENT_DATA.filter((p) => p.riskLevel === 'Moderate').length,
    low: PATIENT_DATA.filter((p) => p.riskLevel === 'Low').length,
  }), []);

  const SUMMARY_CARDS = [
    { label: 'Total Flagged Today', value: summary.total, color: '#0F4C81', bg: '#EFF6FF' },
    { label: 'Critical (Score >70)', value: summary.critical, color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Moderate (40–70)', value: summary.moderate, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Low (Score <40)', value: summary.low, color: '#10B981', bg: '#F0FDF4' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Patient Risk Flagging
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Patients flagged at discharge using the 5-factor composite risk score. Click a row to see full breakdown and take action.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2}>
        {SUMMARY_CARDS.map((c) => (
          <Grid item xs={6} sm={3} key={c.label}>
            <Card sx={{ p: 2, bgcolor: c.bg, border: `1px solid ${c.color}22` }}>
              <Typography variant="h4" fontWeight={800} sx={{ color: c.color, lineHeight: 1 }}>
                {c.value}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.3 }}>
                {c.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main content grid */}
      <Grid container spacing={3}>
        {/* Table panel */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ overflow: 'hidden' }}>
            {/* Filters */}
            <Box sx={{ p: 2, borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search patient or diagnosis…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 0.5 }} />,
                }}
                sx={{ width: 220, '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
              />
              {/* Risk level filter */}
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {FILTER_OPTIONS.map((f) => (
                  <Chip
                    key={f}
                    label={f}
                    size="small"
                    onClick={() => setFilter(f)}
                    variant={filter === f ? 'filled' : 'outlined'}
                    color={filter === f ? 'primary' : 'default'}
                    sx={{ fontSize: '0.72rem', cursor: 'pointer' }}
                  />
                ))}
              </Box>
              {/* Zone filter */}
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {['All', ...ZONE_DATA.map(z => z.zone)].map((z) => (
                  <Chip
                    key={z}
                    label={z === 'All' ? 'All Zones' : z}
                    size="small"
                    onClick={() => setZoneFilter(z)}
                    variant={zoneFilter === z ? 'filled' : 'outlined'}
                    sx={{
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      bgcolor: zoneFilter === z ? (ZONE_COLORS[z] || '#0F4C81') : 'transparent',
                      color: zoneFilter === z ? '#fff' : 'text.secondary',
                      borderColor: ZONE_COLORS[z] || '#D1D5DB',
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SortIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">Sorted: Risk Score ↓</Typography>
              </Box>
            </Box>

            {/* Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                    {['', 'ID', 'Patient', 'Age', 'Zone', 'Diagnosis', 'Risk Score', 'Status'].map((h) => (
                      <TableCell
                        key={h}
                        sx={{ fontWeight: 700, fontSize: '0.72rem', color: '#6B7280', py: 1.25, borderBottom: '2px solid #E5E7EB' }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient) => {
                    const isExpanded = expanded === patient.id;
                    const status = statuses[patient.id] || patient.status;
                    const sm = STATUS_META[status] || STATUS_META['Discharged'];
                    return (
                      <>
                        <TableRow
                          key={patient.id}
                          onClick={() => setExpanded(isExpanded ? null : patient.id)}
                          sx={{
                            cursor: 'pointer',
                            bgcolor: isExpanded ? `${ZONE_COLORS[patient.zone]}08` : 'transparent',
                            '&:hover': { bgcolor: '#F9FAFB' },
                            borderLeft: isExpanded ? `4px solid ${ZONE_COLORS[patient.zone]}` : '4px solid transparent',
                            transition: 'all 0.15s',
                          }}
                        >
                          <TableCell sx={{ py: 1, pr: 0 }}>
                            <IconButton size="small">
                              {isExpanded ? <KeyboardArrowUpIcon sx={{ fontSize: 16 }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
                            </IconButton>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">{patient.id}</Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: `${ZONE_COLORS[patient.zone]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PersonIcon sx={{ fontSize: 14, color: ZONE_COLORS[patient.zone] }} />
                              </Box>
                              <Typography variant="body2" fontWeight={700}>{patient.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2">{patient.age}</Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: ZONE_COLORS[patient.zone] }} />
                              <Typography variant="caption" fontWeight={600}>{patient.zone}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="caption">{patient.primaryDiagnosis}</Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <RiskScorePill score={patient.riskScore} level={patient.riskLevel} />
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Chip
                              label={status}
                              size="small"
                              sx={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                bgcolor: sm.bg,
                                color: sm.color,
                                border: `1px solid ${sm.color}33`,
                              }}
                            />
                          </TableCell>
                        </TableRow>

                        {/* Expanded detail row */}
                        <TableRow key={`${patient.id}-detail`}>
                          <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <ExpandedPatient patient={patient} onAction={handleAction} />
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}

                  {patients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No patients match the current filters.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Sidebar charts */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Pie: patients by zone */}
            <Card sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Flagged Patients by Zone
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={zoneDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {zoneDist.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTip
                    formatter={(v, n) => [`${v} patients`, n]}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Bar: avg risk by zone */}
            <Card sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Avg Risk Score by Zone
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                Northern patients carry the highest average risk score.
              </Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={avgRiskByZone} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="zone" tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <RechartsTip
                    formatter={(v) => [`${v}`, 'Avg Risk Score']}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Bar dataKey="avgRisk" name="Avg Risk Score" radius={[4, 4, 0, 0]}>
                    {avgRiskByZone.map((entry) => (
                      <Cell key={entry.zone} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Risk Score Formula */}
            <Card sx={{ p: 2.5, bgcolor: '#F8FAFC' }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Risk Score Formula
              </Typography>
              {[
                { label: 'Zone Vulnerability Index', weight: '30%', color: '#DC2626' },
                { label: 'Patient Age (65+=high, 75+=very high)', weight: '20%', color: '#F59E0B' },
                { label: 'Number of Chronic Conditions', weight: '20%', color: '#8B5CF6' },
                { label: 'Has Family Physician (yes/no)', weight: '15%', color: '#3B82F6' },
                { label: 'LTC Bed Available (yes/no)', weight: '15%', color: '#10B981' },
              ].map((f) => (
                <Box key={f.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: f.color, flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{f.label}</Typography>
                  </Box>
                  <Chip label={f.weight} size="small" sx={{ fontSize: '0.65rem', fontWeight: 700, bgcolor: `${f.color}15`, color: f.color }} />
                </Box>
              ))}
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Score &gt; 70 → 48-hr callback</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Score 40–70 → 7-day check-in</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Score &lt; 40 → standard discharge</Typography>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar feedback */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar(null)} severity="success" sx={{ fontWeight: 600 }}>
          {snackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
}
