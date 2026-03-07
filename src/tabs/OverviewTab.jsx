import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import BedIcon from '@mui/icons-material/Bed';
import PersonIcon from '@mui/icons-material/Person';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTip,
  Legend, Cell, LabelList,
} from 'recharts';

import {
  ZONE_DATA, COMPARISON_DATA, TREND_DATA, VULNERABILITY_COMPONENTS,
} from '../data/constants';

const RISK_CONFIG = {
  Critical: { color: '#DC2626', bg: '#FEF2F2', label: 'Critical' },
  High:     { color: '#F59E0B', bg: '#FFFBEB', label: 'High' },
  Moderate: { color: '#3B82F6', bg: '#EFF6FF', label: 'Moderate' },
  Low:      { color: '#10B981', bg: '#F0FDF4', label: 'Low' },
};

const VULN_COLORS = {
  readmission: '#EF4444',
  occupancy:   '#F59E0B',
  ltcShortage: '#8B5CF6',
  physicianGap:'#3B82F6',
  aging:       '#10B981',
};

function CircularVulnerabilityIndex({ value, color, size = 80 }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={5}
        sx={{ color: 'grey.100', position: 'absolute' }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={5}
        sx={{ color }}
      />
      <Box
        sx={{
          top: 0, left: 0, bottom: 0, right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" fontWeight={800} sx={{ color, lineHeight: 1, fontSize: '1rem' }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.55rem', lineHeight: 1 }}>
          /100
        </Typography>
      </Box>
    </Box>
  );
}

function ZoneCard({ zone, selected, onSelect, onGoToPatients }) {
  const rc = RISK_CONFIG[zone.riskLevel];
  return (
    <Card
      onClick={() => onSelect(zone.zone)}
      sx={{
        cursor: 'pointer',
        border: selected ? `2px solid ${zone.color}` : '2px solid transparent',
        borderTop: `4px solid ${zone.color}`,
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'visible',
        '&:hover': { transform: 'translateY(-2px)' },
        ...(selected && {
          boxShadow: `0 0 0 3px ${zone.color}33, 0 8px 24px rgba(0,0,0,0.12)`,
        }),
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: zone.color, lineHeight: 1.2 }}>
              {zone.zone}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {zone.totalHospitals} hospitals
            </Typography>
          </Box>
          <Chip
            label={rc.label}
            size="small"
            sx={{
              bgcolor: rc.bg,
              color: rc.color,
              fontWeight: 700,
              fontSize: '0.68rem',
              border: `1px solid ${rc.color}44`,
            }}
          />
        </Box>

        {/* Circular index */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CircularVulnerabilityIndex value={zone.vulnerabilityIndex} color={zone.color} />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Vulnerability Index
            </Typography>
            <Typography variant="h5" fontWeight={800} sx={{ color: zone.color, lineHeight: 1.1 }}>
              {zone.readmissionRate}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              per 100 readmissions
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Stats grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <Tooltip title="Physicians per 100,000 population" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>
                  Physicians/100k
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {zone.physicianPer100k}
                </Typography>
              </Box>
            </Box>
          </Tooltip>

          <Tooltip title="Long-term care beds available in zone" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <BedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>
                  LTC Beds
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {zone.ltcBeds.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Tooltip>

          <Tooltip title="Average bed occupancy %" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocalHospitalIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>
                  Avg Occupancy
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ color: zone.avgOccupancy > 100 ? '#DC2626' : 'text.primary' }}
                >
                  {zone.avgOccupancy}%
                </Typography>
              </Box>
            </Box>
          </Tooltip>

          <Tooltip title="Population aged 65+" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PeopleIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" lineHeight={1}>
                  65+ Population
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {zone.pct65Plus}%
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Box>

        {/* View patients CTA */}
        <Button
          size="small"
          variant="outlined"
          endIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
          onClick={(e) => { e.stopPropagation(); onGoToPatients(zone.zone); }}
          sx={{
            mt: 1.5, width: '100%', fontSize: '0.72rem',
            borderColor: `${zone.color}55`,
            color: zone.color,
            '&:hover': { borderColor: zone.color, bgcolor: `${zone.color}0A` },
          }}
        >
          View Zone Patients
        </Button>
      </CardContent>
    </Card>
  );
}

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, boxShadow: 4, border: '1px solid #e0e0e0', minWidth: 160 }}>
      <Typography variant="caption" fontWeight={700} display="block" mb={0.5}>{label}</Typography>
      {payload.map((p) => (
        <Box key={p.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="caption" sx={{ color: p.fill }}>{p.dataKey}</Typography>
          <Typography variant="caption" fontWeight={700}>{p.value}</Typography>
        </Box>
      ))}
      <Typography variant="caption" color="text.disabled" display="block" mt={0.5}>
        Normalized to 0–100 risk scale
      </Typography>
    </Box>
  );
};

const CustomLineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, boxShadow: 4, border: '1px solid #e0e0e0', minWidth: 180 }}>
      <Typography variant="caption" fontWeight={700} display="block" mb={0.5}>{label}</Typography>
      {payload.map((p) => (
        <Box key={p.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="caption" sx={{ color: p.stroke }}>{p.name}</Typography>
          <Typography variant="caption" fontWeight={700}>{p.value} / 100</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function OverviewTab({ selectedZone, onZoneSelect, onGoToPatients }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Section label */}
      <Box>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Provincial Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          1 in 11 Nova Scotia hospital patients returns within 30 days — a rate that is rising while the Canadian average declines.
        </Typography>
      </Box>

      {/* Row 1 — Zone Cards */}
      <Grid container spacing={2}>
        {ZONE_DATA.map((zone) => (
          <Grid item xs={12} sm={6} md={3} key={zone.zone}>
            <ZoneCard
              zone={zone}
              selected={selectedZone === zone.zone}
              onSelect={onZoneSelect}
              onGoToPatients={onGoToPatients}
            />
          </Grid>
        ))}
      </Grid>

      {/* Row 2 — Charts */}
      <Grid container spacing={2}>
        {/* Zone Comparison Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Zone Comparison — Risk Indicators
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              Normalized 0–100 scale (100 = highest risk). Higher = more at-risk for that metric.
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={COMPARISON_DATA}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                barCategoryGap="25%"
                barGap={2}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="metric"
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  interval={0}
                  width={80}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  tickFormatter={(v) => `${v}`}
                />
                <RechartsTip content={<CustomBarTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="Northern" fill="#DC2626" radius={[3, 3, 0, 0]} maxBarSize={18} />
                <Bar dataKey="Eastern"  fill="#F59E0B" radius={[3, 3, 0, 0]} maxBarSize={18} />
                <Bar dataKey="Western"  fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={18} />
                <Bar dataKey="Central"  fill="#10B981" radius={[3, 3, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Trend Line Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              30-Day Readmission Rate Trend (CIHI)
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              NS diverges above the national average while Canada improves. Northern Zone is worst and worsening.
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={TREND_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis
                  domain={[7.4, 9.5]}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  tickFormatter={(v) => v.toFixed(1)}
                />
                <RechartsTip content={<CustomLineTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Line dataKey="northern" stroke="#DC2626" strokeWidth={2.5} name="Northern" dot={{ r: 3 }} />
                <Line dataKey="eastern"  stroke="#F59E0B" strokeWidth={2}   name="Eastern"  dot={{ r: 3 }} />
                <Line dataKey="western"  stroke="#3B82F6" strokeWidth={2}   name="Western"  dot={{ r: 3 }} />
                <Line dataKey="central"  stroke="#10B981" strokeWidth={2}   name="Central"  dot={{ r: 3 }} />
                <Line
                  dataKey="canada"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  name="Canada Avg"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3 — Key Insight / Western Zone Anomaly */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LightbulbIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Key Analytical Findings
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, bgcolor: '#FEF2F2', borderRadius: 2, borderLeft: '4px solid #DC2626', height: '100%' }}>
                  <Typography variant="body2" fontWeight={700} color="#DC2626" gutterBottom>
                    Northern: Worst Post-Discharge Ecosystem
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fewest physicians (182/100k), fewest LTC beds (1,549), and highest readmission rate (9.2). Every community resource gap is amplified here.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, bgcolor: '#EFF6FF', borderRadius: 2, borderLeft: '4px solid #3B82F6', height: '100%' }}>
                  <Typography variant="body2" fontWeight={700} color="#1565C0" gutterBottom>
                    Western Zone Anomaly — Key Insight
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Highest occupancy (122%) yet <em>lowest</em> readmission rate (8.0). Overcrowding causes bed-blocking, meaning longer stays. The real driver is <strong>post-discharge support</strong>, not overcrowding.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: 2, borderLeft: '4px solid #10B981', height: '100%' }}>
                  <Typography variant="body2" fontWeight={700} color="#065F46" gutterBottom>
                    Consistent Pattern Across All 4 Zones
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    While n=4 is too small for inferential statistics, every zone with fewer community resources shows higher readmission. We treat this as a directional hypothesis supported by descriptive evidence.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Alert
            severity="warning"
            icon={<InfoOutlinedIcon />}
            sx={{ height: '100%', alignItems: 'flex-start', borderRadius: 3 }}
          >
            <AlertTitle sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Statistical Honesty Note</AlertTitle>
            <Typography variant="caption">
              With n=4 zones, r=−0.95 lacks statistical power — any 4 points produce a high r-value.
              We present this as consistent directional evidence only, not a causal claim.
              A Northern pilot will generate n large enough for inference.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Row 4 — Vulnerability Index Stacked Bar */}
      <Card sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Vulnerability Index Decomposition by Zone
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
          Each bar shows how much each structural factor contributes to the zone's overall vulnerability score (out of 100).
          Source: Composite index derived from CIHI, NSHA, and Statistics Canada data.
        </Typography>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={VULNERABILITY_COMPONENTS}
            layout="vertical"
            margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} />
            <YAxis dataKey="zone" type="category" tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} width={70} />
            <RechartsTip
              formatter={(val, name) => [`${val}`, name]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e0e0e0' }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Bar dataKey="readmission"  name="Readmission (30%)"   stackId="a" fill={VULN_COLORS.readmission}   radius={0}>
              <LabelList dataKey="readmission" position="center" style={{ fontSize: 9, fill: '#fff', fontWeight: 700 }} formatter={v => v > 5 ? v : ''} />
            </Bar>
            <Bar dataKey="occupancy"    name="Occupancy (20%)"     stackId="a" fill={VULN_COLORS.occupancy}     radius={0}>
              <LabelList dataKey="occupancy" position="center" style={{ fontSize: 9, fill: '#fff', fontWeight: 700 }} formatter={v => v > 5 ? v : ''} />
            </Bar>
            <Bar dataKey="ltcShortage"  name="LTC Shortage (20%)"  stackId="a" fill={VULN_COLORS.ltcShortage}  radius={0}>
              <LabelList dataKey="ltcShortage" position="center" style={{ fontSize: 9, fill: '#fff', fontWeight: 700 }} formatter={v => v > 5 ? v : ''} />
            </Bar>
            <Bar dataKey="physicianGap" name="Physician Gap (15%)" stackId="a" fill={VULN_COLORS.physicianGap} radius={0}>
              <LabelList dataKey="physicianGap" position="center" style={{ fontSize: 9, fill: '#fff', fontWeight: 700 }} formatter={v => v > 5 ? v : ''} />
            </Bar>
            <Bar dataKey="aging"        name="Aging Pop (15%)"     stackId="a" fill={VULN_COLORS.aging}         radius={[0, 4, 4, 0]}>
              <LabelList dataKey="total" position="right" style={{ fontSize: 11, fill: '#374151', fontWeight: 800 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

    </Box>
  );
}
