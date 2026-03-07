import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import HospitalIcon from '@mui/icons-material/LocalHospital';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StorageIcon from '@mui/icons-material/Storage';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExtensionIcon from '@mui/icons-material/Extension';
import PublicIcon from '@mui/icons-material/Public';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTip, Cell, LabelList, ReferenceLine,
} from 'recharts';

import { BEFORE_AFTER_DATA, IMPACT_DATA } from '../data/constants';

const CURRENT_DATA = BEFORE_AFTER_DATA.map((d) => ({
  zone: d.zone, rate: d.current, color: d.color,
}));

const PROJECTED_DATA = BEFORE_AFTER_DATA.map((d) => ({
  zone: d.zone, rate: d.projected, color: d.color,
  changed: d.projected < d.current,
}));

const PHASE_CONFIG = [
  {
    phase: 'Phase 1',
    duration: 'Months 1–6',
    zone: 'Northern Zone Pilot',
    icon: <RocketLaunchIcon sx={{ fontSize: 28 }} />,
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    bullets: [
      'Deploy risk scoring engine at Northern hospitals',
      'Train 4 dedicated care coordinators',
      'Establish 48-hr callback protocol',
      'Measure baseline vs. intervention readmission rates',
    ],
    metrics: { avoided: 150, saved: '$4.2M', invest: '~$200K' },
  },
  {
    phase: 'Phase 2',
    duration: 'Months 7–12',
    zone: 'Eastern Zone Expansion',
    icon: <ExtensionIcon sx={{ fontSize: 28 }} />,
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
    bullets: [
      'Refine algorithm using Phase 1 learnings',
      'Expand to Eastern Zone (14 hospitals)',
      'Integrate with existing NSHA discharge workflow',
      'Cross-zone care coordinator collaboration',
    ],
    metrics: { avoided: 112, saved: '$3.1M', invest: '~$150K' },
  },
  {
    phase: 'Phase 3',
    duration: 'Year 2',
    zone: 'Province-wide Rollout',
    icon: <PublicIcon sx={{ fontSize: 28 }} />,
    color: '#10B981',
    bg: '#F0FDF4',
    border: '#A7F3D0',
    bullets: [
      'All 4 zones fully integrated',
      'Real-time CIHI data feed for zone vulnerability updates',
      'Quarterly algorithm retraining with outcomes data',
      'Annual cost-benefit audit for NSHA reporting',
    ],
    metrics: { avoided: '300+', saved: '$8.4M+', invest: '~$100K' },
  },
];

const COST_BENEFIT_ROWS = [
  { phase: 'Phase 1', zone: 'Northern', avoided: '150/yr', saved: '$4.2M', invest: '~$200K', roi: '21×' },
  { phase: 'Phase 2', zone: 'Eastern',  avoided: '112/yr', saved: '$3.1M', invest: '~$150K', roi: '21×' },
  { phase: 'Phase 3', zone: 'All NS',   avoided: '300+/yr', saved: '$8.4M+', invest: '~$100K', roi: '84×' },
];

function ImpactMetricCard({ icon, value, label, sub, color, bg }) {
  return (
    <Card
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${bg} 0%, #fff 100%)`,
        border: `1px solid ${color}33`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute', top: -12, right: -12,
          width: 80, height: 80, borderRadius: '50%',
          bgcolor: `${color}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Box sx={{ color, opacity: 0.4, fontSize: 40 }}>{icon}</Box>
      </Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
        {label}
      </Typography>
      <Typography variant="h4" fontWeight={800} sx={{ color, lineHeight: 1.1, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {sub}
      </Typography>
    </Card>
  );
}

function BeforeAfterChart({ data, title, highlightProjected }) {
  return (
    <Card sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: -15, bottom: 5 }} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="zone" tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }} />
          <YAxis domain={[7.0, 10.0]} tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={(v) => v.toFixed(1)} />
          <ReferenceLine y={8.5} stroke="#9CA3AF" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: 'NS Avg 9.0', position: 'right', fontSize: 9, fill: '#9CA3AF' }} />
          <RechartsTip
            formatter={(v) => [`${v.toFixed(1)} / 100`, 'Readmission Rate']}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e0e0e0' }}
          />
          <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.zone}
                fill={entry.color}
                opacity={highlightProjected && !entry.changed ? 0.5 : 1}
              />
            ))}
            <LabelList
              dataKey="rate"
              position="top"
              formatter={(v) => v.toFixed(1)}
              style={{ fontSize: 11, fontWeight: 800, fill: '#374151' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function PhaseCard({ config, index }) {
  return (
    <Card
      sx={{
        position: 'relative',
        border: `1px solid ${config.border}`,
        borderTop: `4px solid ${config.color}`,
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Chip
              label={config.phase}
              size="small"
              sx={{
                bgcolor: config.bg,
                color: config.color,
                fontWeight: 800,
                fontSize: '0.7rem',
                border: `1px solid ${config.border}`,
                mb: 0.75,
              }}
            />
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              {config.zone}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {config.duration}
            </Typography>
          </Box>
          <Box sx={{ color: config.color }}>{config.icon}</Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Bullets */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
          {config.bullets.map((b) => (
            <Box key={b} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
              <CheckCircleIcon sx={{ fontSize: 14, color: config.color, flexShrink: 0, mt: 0.2 }} />
              <Typography variant="caption" color="text.secondary">{b}</Typography>
            </Box>
          ))}
        </Box>

        {/* Mini metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, mt: 'auto' }}>
          {[
            { label: 'Avoided', value: config.metrics.avoided, color: config.color },
            { label: 'Saved', value: config.metrics.saved, color: '#0F4C81' },
            { label: 'Invest', value: config.metrics.invest, color: '#6B7280' },
          ].map((m) => (
            <Box key={m.label} sx={{ p: 1, bgcolor: '#F9FAFB', borderRadius: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1} mb={0.25}>
                {m.label}
              </Typography>
              <Typography variant="body2" fontWeight={800} sx={{ color: m.color, fontSize: '0.78rem' }}>
                {m.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>

      {/* Arrow connector (not for last card) */}
      {index < 2 && (
        <Box
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: { xs: 'none', md: 'flex' },
            bgcolor: 'background.paper',
            borderRadius: '50%',
            p: 0.5,
            boxShadow: 2,
          }}
        >
          <ArrowForwardIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
        </Box>
      )}
    </Card>
  );
}

export default function ImpactTab() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Projected Impact
        </Typography>
        <Typography variant="body2" color="text.secondary">
          If Northern Zone drops from 9.2 → 8.0 readmissions per 100 discharges, the math is clear.
          No new hospitals. No new infrastructure. Just smarter use of data we already collect.
        </Typography>
      </Box>

      {/* Top impact cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <ImpactMetricCard
            icon={<HospitalIcon />}
            value="150"
            label="Fewer Readmissions / Year"
            sub="Northern Zone: 9.2 → 8.0 per 100 discharges × 12,500 annual discharges"
            color="#DC2626"
            bg="#FEF2F2"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ImpactMetricCard
            icon={<AttachMoneyIcon />}
            value="$4.2M"
            label="Annual Cost Savings"
            sub="150 readmissions × $28,000 avg cost per readmission = $4,200,000"
            color="#10B981"
            bg="#F0FDF4"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ImpactMetricCard
            icon={<StorageIcon />}
            value="Zero"
            label="New Infrastructure Needed"
            sub="Uses existing NSHA discharge data + CIHI readmission tracking + Statistics Canada"
            color="#0F4C81"
            bg="#EFF6FF"
          />
        </Grid>
      </Grid>

      {/* Before / After Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <BeforeAfterChart data={CURRENT_DATA} title="Current State — Readmission Rates by Zone" />
        </Grid>
        <Grid item xs={12} md={6}>
          <BeforeAfterChart
            data={PROJECTED_DATA}
            title="Projected (Post-Intervention) — Northern + Eastern Drop to 8.0"
            highlightProjected
          />
        </Grid>
      </Grid>

      {/* Math transparency box */}
      <Card sx={{ p: 2.5, bgcolor: '#F8FAFC', border: '1px dashed #CBD5E1' }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          The Math — Fully Transparent
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, bgcolor: '#FEF2F2', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Northern Current</Typography>
              <Typography variant="body2" fontWeight={700}>12,500 discharges/yr × 9.2% = <strong>1,150 readmissions</strong></Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Northern Projected</Typography>
              <Typography variant="body2" fontWeight={700}>12,500 discharges/yr × 8.0% = <strong>1,000 readmissions</strong></Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, bgcolor: '#EFF6FF', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Savings Calculation</Typography>
              <Typography variant="body2" fontWeight={700}>150 avoided × $28,000 = <strong>$4,200,000/yr</strong></Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Implementation Roadmap */}
      <Box>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Implementation Roadmap
        </Typography>
        <Grid container spacing={3} sx={{ position: 'relative' }}>
          {PHASE_CONFIG.map((phase, i) => (
            <Grid item xs={12} md={4} key={phase.phase} sx={{ position: 'relative' }}>
              <PhaseCard config={phase} index={i} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Cost-Benefit Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #F3F4F6' }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Cost-Benefit Summary by Phase
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                {['Phase', 'Zone', 'Readmissions Avoided', 'Cost Saved (Annual)', 'Investment', 'ROI Multiple'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem', color: '#6B7280', py: 1.5, borderBottom: '2px solid #E5E7EB' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {COST_BENEFIT_ROWS.map((row, i) => (
                <TableRow key={row.phase} sx={{ '&:hover': { bgcolor: '#F9FAFB' }, bgcolor: i % 2 === 0 ? '#FAFAFA' : '#fff' }}>
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip label={row.phase} size="small" sx={{ fontWeight: 700, fontSize: '0.68rem', bgcolor: PHASE_CONFIG[i].bg, color: PHASE_CONFIG[i].color, border: `1px solid ${PHASE_CONFIG[i].border}` }} />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" fontWeight={600}>{row.zone}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" fontWeight={700} color="error.main">{row.avoided}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" fontWeight={700} color="success.main">{row.saved}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">{row.invest}</Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip
                      label={row.roi}
                      size="small"
                      color="success"
                      sx={{ fontWeight: 800, fontSize: '0.72rem' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {/* Total row */}
              <TableRow sx={{ bgcolor: '#F0F4F8' }}>
                <TableCell colSpan={2} sx={{ py: 1.5 }}>
                  <Typography variant="body2" fontWeight={800}>Province-wide Total</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" fontWeight={800} color="error.main">300+ / yr</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" fontWeight={800} color="success.main">$8.4M+ / yr</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">~$450K total</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Chip label="18× avg" size="small" color="success" sx={{ fontWeight: 800 }} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
