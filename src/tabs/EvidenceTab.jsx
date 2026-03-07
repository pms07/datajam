import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';

import {
  ResponsiveContainer,
  ScatterChart, Scatter, ZAxis,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTip,
  Legend, Cell, LabelList, ReferenceLine,
} from 'recharts';

import {
  ZONE_DATA,
  MONTHLY_OCCUPANCY_DATA,
  OCCUPANCY_PRESSURE_DATA,
  LTC_DETAIL_DATA,
  PHYSICIAN_RURAL_DATA,
  HOSPITAL_TYPE_DATA,
  CORRELATION_DATA,
} from '../data/constants';

// ─── helpers ──────────────────────────────────────────────────────────────────

const ZONE_COLORS = {
  Northern: '#DC2626', Eastern: '#F59E0B', Western: '#3B82F6', Central: '#10B981',
};

function SectionTitle({ title, subtitle, source }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
          {subtitle}
        </Typography>
      )}
      {source && (
        <Typography variant="caption" color="text.disabled" display="block">
          Source: {source}
        </Typography>
      )}
    </Box>
  );
}

const CustomTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, boxShadow: 4, border: '1px solid #E5E7EB', fontSize: 12 }}>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="caption" sx={{ color: p.color || p.fill || '#374151' }}>{p.name}</Typography>
          <Typography variant="caption" fontWeight={700}>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

// ─── Section 1: What Drives Readmission? (3 scatter plots) ───────────────────

const SCATTER_CONFIGS = [
  {
    xKey: 'occupancy', xLabel: 'Avg Occupancy (%)', xDomain: [60, 130],
    title: 'vs Avg Hospital Occupancy',
    insight: 'Western outlier: highest occupancy but lowest readmission — bed-blocking effect',
  },
  {
    xKey: 'ltcBeds', xLabel: 'Total LTC Beds', xDomain: [1400, 3000],
    title: 'vs Total LTC Beds',
    insight: 'Northern: fewest LTC beds (1,549) → highest readmission (9.2)',
  },
  {
    xKey: 'physicians', xLabel: 'Physicians per 100k', xDomain: [170, 280],
    title: 'vs Physicians per 100k',
    insight: 'Northern: fewest physicians (182) → highest readmission — access gap',
  },
];

const scatterPoints = ZONE_DATA.map((z) => ({
  zone: z.zone, readmission: z.readmissionRate,
  occupancy: z.avgOccupancy, ltcBeds: z.ltcBeds,
  physicians: z.physicianPer100k, color: z.color,
}));

// Simple linear regression for trend line
function trendLine(points, xKey) {
  const n = points.length;
  const xs = points.map((p) => p[xKey]);
  const ys = points.map((p) => p.readmission);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;
  const slope = xs.map((x, i) => (x - xMean) * (ys[i] - yMean)).reduce((a, b) => a + b, 0) /
    xs.map((x) => (x - xMean) ** 2).reduce((a, b) => a + b, 0);
  const intercept = yMean - slope * xMean;
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  return [
    { x: xMin, y: +(slope * xMin + intercept).toFixed(3) },
    { x: xMax, y: +(slope * xMax + intercept).toFixed(3) },
  ];
}

function ScatterSection() {
  return (
    <Card sx={{ p: 2.5 }}>
      <SectionTitle
        title="What Drives Readmission Rates? — Zone-Level Scatter Analysis"
        subtitle="Each dot = one NS health zone. Dashed line = linear trend. Source: CIHI · NSHA · Statistics Canada 2024–25"
      />
      <Grid container spacing={2}>
        {SCATTER_CONFIGS.map((cfg) => {
          const trend = trendLine(scatterPoints, cfg.xKey);
          return (
            <Grid item xs={12} md={4} key={cfg.xKey}>
              <Box sx={{ p: 1.5, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                <Typography variant="caption" fontWeight={700} display="block" mb={1} textAlign="center">
                  Readmission Rate {cfg.title}
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      type="number" dataKey="x" name={cfg.xLabel}
                      domain={cfg.xDomain}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      label={{ value: cfg.xLabel, position: 'insideBottom', offset: -12, fontSize: 10, fill: '#6B7280' }}
                    />
                    <YAxis
                      type="number" dataKey="y" name="Readmission Rate"
                      domain={[7.8, 9.4]}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      tickFormatter={(v) => v.toFixed(1)}
                      label={{ value: 'Rate / 100', angle: -90, position: 'insideLeft', fontSize: 9, fill: '#6B7280' }}
                    />
                    <ZAxis range={[80, 80]} />
                    <RechartsTip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0]?.payload;
                        if (!d) return null;
                        return (
                          <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, boxShadow: 4, border: '1px solid #E5E7EB' }}>
                            <Typography variant="caption" fontWeight={700} display="block" sx={{ color: d.fill }}>{d.zone}</Typography>
                            <Typography variant="caption" display="block">Readmission: {d.y?.toFixed(1) ?? d.readmission}</Typography>
                            <Typography variant="caption" display="block">{cfg.xLabel}: {d.x?.toFixed(1) ?? d[cfg.xKey]}</Typography>
                          </Box>
                        );
                      }}
                    />
                    {/* Trend line as a Scatter with line */}
                    <Scatter
                      data={trend}
                      line={{ stroke: '#9CA3AF', strokeDasharray: '5 3', strokeWidth: 1.5 }}
                      shape={() => null}
                      legendType="none"
                    />
                    {/* Zone dots */}
                    <Scatter
                      data={scatterPoints.map((p) => ({ x: p[cfg.xKey], y: p.readmission, zone: p.zone, fill: p.color }))}
                      shape={(props) => {
                        const { cx, cy, fill, payload } = props;
                        return (
                          <g>
                            <circle cx={cx} cy={cy} r={8} fill={fill} stroke="#fff" strokeWidth={2} />
                            <text x={cx + 10} y={cy + 4} fontSize={9} fill="#374151" fontWeight={600}>{payload.zone}</text>
                          </g>
                        );
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
                <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mt: 0.5, fontStyle: 'italic', fontSize: '0.65rem' }}>
                  {cfg.insight}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
}

// ─── Section 2: Acute Occupancy Pressure ─────────────────────────────────────

function OccupancySection() {
  return (
    <Card sx={{ p: 2.5 }}>
      <SectionTitle
        title="Acute Occupancy Pressure by Zone"
        subtitle="Monthly occupancy 2021–2024 (quarterly approx.) + system pressure summary"
        source="NSHA Bed Management Reports"
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography variant="caption" fontWeight={600} display="block" mb={1} textAlign="center">
            Monthly Acute Occupancy Rate by Zone (%)
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MONTHLY_OCCUPANCY_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#6B7280' }} interval={2} />
              <YAxis domain={[50, 145]} tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={(v) => `${v}%`} />
              <ReferenceLine y={90}  stroke="#F59E0B" strokeDasharray="5 3" strokeWidth={1.5}
                label={{ value: '90% threshold', position: 'right', fontSize: 9, fill: '#F59E0B' }} />
              <ReferenceLine y={100} stroke="#DC2626" strokeDasharray="5 3" strokeWidth={1.5}
                label={{ value: '100% (over-capacity)', position: 'right', fontSize: 9, fill: '#DC2626' }} />
              <RechartsTip content={<CustomTip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Line dataKey="western"  stroke={ZONE_COLORS.Western}  strokeWidth={2} name="Western"  dot={false} />
              <Line dataKey="central"  stroke={ZONE_COLORS.Central}  strokeWidth={2} name="Central"  dot={false} />
              <Line dataKey="northern" stroke={ZONE_COLORS.Northern} strokeWidth={2} name="Northern" dot={false} />
              <Line dataKey="eastern"  stroke={ZONE_COLORS.Eastern}  strokeWidth={2} name="Eastern"  dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography variant="caption" fontWeight={600} display="block" mb={1} textAlign="center">
            % of Months Where Occupancy Exceeded 90% (System Pressure)
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={OCCUPANCY_PRESSURE_DATA} margin={{ top: 20, right: 20, left: -10, bottom: 5 }} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="zone" tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
              <RechartsTip formatter={(v) => [`${v}%`, '% Months > 90%']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="pctMonthsOver90" name="% Months > 90%" radius={[6, 6, 0, 0]}>
                {OCCUPANCY_PRESSURE_DATA.map((d) => <Cell key={d.zone} fill={d.color} />)}
                <LabelList dataKey="pctMonthsOver90" position="top" formatter={(v) => `${v}%`}
                  style={{ fontSize: 12, fontWeight: 800, fill: '#374151' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Card>
  );
}

// ─── Section 3: LTC Infrastructure ───────────────────────────────────────────

function LtcSection() {
  return (
    <Card sx={{ p: 2.5 }}>
      <SectionTitle
        title="Long-Term Care Infrastructure — Nova Scotia"
        subtitle="Northern Zone has the fewest total LTC beds AND the fewest facilities — a critical discharge bottleneck"
        source="NSHA Long-Term Care Registry 2024"
      />
      <Grid container spacing={2}>
        {/* Total beds */}
        <Grid item xs={12} md={4}>
          <Typography variant="caption" fontWeight={700} display="block" mb={1} textAlign="center">Total LTC Beds by Zone</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={LTC_DETAIL_DATA} margin={{ top: 20, right: 10, left: -10, bottom: 5 }} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="zone" tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <RechartsTip formatter={(v) => [v.toLocaleString(), 'LTC Beds']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="totalBeds" name="Total LTC Beds" radius={[5, 5, 0, 0]}>
                {LTC_DETAIL_DATA.map((d) => <Cell key={d.zone} fill={d.color} />)}
                <LabelList dataKey="totalBeds" position="top" formatter={(v) => v.toLocaleString()}
                  style={{ fontSize: 10, fontWeight: 800, fill: '#374151' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        {/* NH vs RCF */}
        <Grid item xs={12} md={4}>
          <Typography variant="caption" fontWeight={700} display="block" mb={1} textAlign="center">Nursing Home vs Residential Care Beds</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={LTC_DETAIL_DATA} margin={{ top: 20, right: 10, left: -10, bottom: 5 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="zone" tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <RechartsTip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="nursingHome"     name="Nursing Home"     fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="residentialCare" name="Residential Care" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        {/* Facility count */}
        <Grid item xs={12} md={4}>
          <Typography variant="caption" fontWeight={700} display="block" mb={1} textAlign="center">Number of LTC Facilities by Zone</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={LTC_DETAIL_DATA} margin={{ top: 20, right: 10, left: -10, bottom: 5 }} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="zone" tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }} />
              <YAxis domain={[0, 50]} tick={{ fontSize: 10 }} />
              <RechartsTip formatter={(v) => [v, 'Facilities']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="facilities" name="LTC Facilities" radius={[5, 5, 0, 0]}>
                {LTC_DETAIL_DATA.map((d) => <Cell key={d.zone} fill={d.color} />)}
                <LabelList dataKey="facilities" position="top" style={{ fontSize: 12, fontWeight: 800, fill: '#374151' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Card>
  );
}

// ─── Section 4: Physician Access Gap ─────────────────────────────────────────

const physicianZoneData = [...ZONE_DATA]
  .sort((a, b) => a.physicianPer100k - b.physicianPer100k)
  .map((z) => ({ zone: z.zone, physicians: z.physicianPer100k, color: z.color }));

function PhysicianSection() {
  return (
    <Card sx={{ p: 2.5 }}>
      <SectionTitle
        title="Nova Scotia Physician Supply — Access Gap by Zone"
        subtitle="Family medicine supply is declining province-wide. Only ~17% of NS physicians work in rural areas — a critical coverage gap."
        source="CIHI Physician Workforce Database · CPSNS 2024"
      />
      <Grid container spacing={3}>
        {/* Trend line */}
        <Grid item xs={12} md={6}>
          <Typography variant="caption" fontWeight={700} display="block" mb={1} textAlign="center">
            NS Physician-to-Population Ratio (Declining since 2020)
          </Typography>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={PHYSICIAN_RURAL_DATA} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#6B7280' }} />
              <YAxis yAxisId="left" domain={[90, 290]} tick={{ fontSize: 10, fill: '#6B7280' }}
                label={{ value: 'Per 100k pop', angle: -90, position: 'insideLeft', fontSize: 9, fill: '#6B7280' }} />
              <YAxis yAxisId="right" orientation="right" domain={[12, 22]} tick={{ fontSize: 10, fill: '#6B7280' }}
                tickFormatter={(v) => `${v}%`}
                label={{ value: '% Rural', angle: 90, position: 'insideRight', fontSize: 9, fill: '#6B7280' }} />
              <RechartsTip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
              <Line yAxisId="left"  dataKey="allPhysicians"  stroke="#0F4C81" strokeWidth={2.5} name="All Physicians (per 100k)"    dot={{ r: 3 }} />
              <Line yAxisId="left"  dataKey="familyMedicine" stroke="#3B82F6" strokeWidth={2}   name="Family Medicine (per 100k)"  dot={{ r: 3 }} strokeDasharray="4 3" />
              <Line yAxisId="right" dataKey="ruralPct"       stroke="#F59E0B" strokeWidth={2}   name="% in Rural Areas (right axis)" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        {/* Zone bar */}
        <Grid item xs={12} md={6}>
          <Typography variant="caption" fontWeight={700} display="block" mb={1} textAlign="center">
            Estimated Physicians per 100k — by Zone (Northern = most underserved)
          </Typography>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={physicianZoneData} layout="vertical" margin={{ top: 5, right: 60, left: 20, bottom: 5 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
              <XAxis type="number" domain={[150, 290]} tick={{ fontSize: 10, fill: '#6B7280' }} />
              <YAxis type="category" dataKey="zone" tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} width={70} />
              <ReferenceLine x={248} stroke="#9CA3AF" strokeDasharray="4 3"
                label={{ value: 'NS avg (248)', position: 'top', fontSize: 9, fill: '#9CA3AF' }} />
              <RechartsTip formatter={(v) => [`${v}`, 'Physicians per 100k']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="physicians" name="Physicians per 100k" radius={[0, 5, 5, 0]}>
                {physicianZoneData.map((d) => <Cell key={d.zone} fill={d.color} />)}
                <LabelList dataKey="physicians" position="right" style={{ fontSize: 11, fontWeight: 800, fill: '#374151' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Card>
  );
}

// ─── Section 5: Community Vulnerability Factors (4-panel) ────────────────────

const VULN_PANELS = [
  {
    key: 'avgOccupancy', label: 'Avg Hospital Occupancy (%)',
    caption: 'Higher = more system pressure',
    sortDir: 'desc', domain: [0, 140],
    fmt: (v) => `${v}%`,
  },
  {
    key: 'ltcBeds', label: 'Total LTC Beds',
    caption: 'Lower = discharge bottleneck',
    sortDir: 'asc', domain: [0, 3200],
    fmt: (v) => v.toLocaleString(),
  },
  {
    key: 'physicianPer100k', label: 'Physicians per 100k Population',
    caption: 'Lower = less follow-up care',
    sortDir: 'asc', domain: [0, 300],
    fmt: (v) => v,
  },
  {
    key: 'pct65Plus', label: 'Population Aged 65+ (%)',
    caption: 'Higher = more complex patients',
    sortDir: 'desc', domain: [0, 17],
    fmt: (v) => `${v}%`,
  },
];

function VulnerabilityFactorsSection() {
  return (
    <Card sx={{ p: 2.5 }}>
      <SectionTitle
        title="Community Vulnerability Factors by NS Health Zone"
        subtitle="Four structural factors that together explain zone-level readmission risk"
        source="NSHA · Statistics Canada Census 2021 · CIHI 2024"
      />
      <Grid container spacing={2}>
        {VULN_PANELS.map((panel) => {
          const sorted = [...ZONE_DATA].sort((a, b) =>
            panel.sortDir === 'desc' ? b[panel.key] - a[panel.key] : a[panel.key] - b[panel.key]
          );
          return (
            <Grid item xs={12} sm={6} key={panel.key}>
              <Box sx={{ bgcolor: '#F9FAFB', borderRadius: 2, p: 1.5 }}>
                <Typography variant="caption" fontWeight={700} display="block" mb={0.25} textAlign="center">
                  {panel.label}
                </Typography>
                <Typography variant="caption" color="text.disabled" display="block" mb={1} textAlign="center" sx={{ fontStyle: 'italic', fontSize: '0.65rem' }}>
                  {panel.caption}
                </Typography>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={sorted} margin={{ top: 16, right: 10, left: -15, bottom: 5 }} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="zone" tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }} />
                    <YAxis domain={panel.domain} tick={{ fontSize: 9, fill: '#6B7280' }} />
                    <RechartsTip
                      formatter={(v) => [panel.fmt(v), panel.label]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar dataKey={panel.key} radius={[4, 4, 0, 0]}>
                      {sorted.map((z) => <Cell key={z.zone} fill={ZONE_COLORS[z.zone]} />)}
                      <LabelList dataKey={panel.key} position="top" formatter={panel.fmt}
                        style={{ fontSize: 9, fontWeight: 800, fill: '#374151' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
}

// ─── Section 6: Correlation Evidence (heatmap-style grid) ────────────────────

function corrColor(r) {
  const abs = Math.abs(r);
  if (r > 0) {
    // green scale
    const alpha = 0.15 + abs * 0.7;
    return { bg: `rgba(16,185,129,${alpha})`, fg: abs > 0.5 ? '#fff' : '#065F46' };
  }
  const alpha = 0.15 + abs * 0.7;
  return { bg: `rgba(220,38,38,${alpha})`, fg: abs > 0.5 ? '#fff' : '#7F1D1D' };
}

function CorrelationSection() {
  return (
    <Card sx={{ p: 2.5 }}>
      <SectionTitle
        title="Correlation Evidence — Zone-Level Features vs Readmission Rate"
        subtitle="Pearson r values (n=4 zones). Higher absolute value = stronger directional association. Green = positive, Red = negative (inverse)."
        source="Derived from CIHI · NSHA · Statistics Canada zone-level data"
      />
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 400 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', gap: 1, px: 1, py: 0.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">Feature</Typography>
            </Box>
            <Box sx={{ width: 80, textAlign: 'center' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">r value</Typography>
            </Box>
            <Box sx={{ flex: 2 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">Strength</Typography>
            </Box>
          </Box>
          <Divider />
          {CORRELATION_DATA.map((d) => {
            const { bg, fg } = corrColor(d.correlation);
            const strength = Math.abs(d.correlation);
            return (
              <Tooltip
                key={d.feature}
                title={`Pearson r = ${d.correlation} — ${strength > 0.8 ? 'Very strong' : strength > 0.6 ? 'Strong' : strength > 0.4 ? 'Moderate' : 'Weak'} association with 30-day readmission rate`}
                arrow
                placement="right"
              >
                <Box
                  sx={{
                    display: 'flex', gap: 1, px: 1.5, py: 0.75,
                    borderRadius: 1.5, alignItems: 'center',
                    bgcolor: bg,
                    cursor: 'default',
                    transition: 'opacity 0.15s',
                    '&:hover': { opacity: 0.85 },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight={600} sx={{ color: fg }}>{d.label}</Typography>
                  </Box>
                  <Box sx={{ width: 80, textAlign: 'center' }}>
                    <Typography variant="caption" fontWeight={800} sx={{ color: fg, fontSize: '0.8rem' }}>
                      {d.correlation > 0 ? '+' : ''}{d.correlation.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                      <Box sx={{ width: `${Math.abs(d.correlation) * 100}%`, height: '100%', bgcolor: fg, borderRadius: 3 }} />
                    </Box>
                    <Chip
                      label={strength > 0.8 ? 'Very Strong' : strength > 0.6 ? 'Strong' : strength > 0.4 ? 'Moderate' : 'Weak'}
                      size="small"
                      sx={{ fontSize: '0.6rem', fontWeight: 700, height: 18, bgcolor: 'rgba(255,255,255,0.3)', color: fg }}
                    />
                  </Box>
                </Box>
              </Tooltip>
            );
          })}
          <Box sx={{ mt: 1, p: 1.5, bgcolor: '#FFF7ED', borderRadius: 2, border: '1px dashed #FED7AA' }}>
            <Typography variant="caption" color="text.secondary">
              ⚠️ <strong>Statistical note:</strong> With n=4 zones, any correlation &gt; |0.8| should be treated as directional evidence only.
              The pattern is consistent — Northern Zone underperforms on every resource metric — but causal inference requires larger n from the proposed pilot study.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

// ─── Section 7: Hospital Type Distribution ────────────────────────────────────

function HospitalTypeSection() {
  return (
    <Card sx={{ p: 2.5 }}>
      <SectionTitle
        title="Hospital Count by Zone & Type"
        subtitle="Central and Eastern zones have more diverse hospital types; Northern is predominantly community hospitals with no tertiary centre"
        source="NSHA Facility Registry 2024"
      />
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={HOSPITAL_TYPE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 5 }} barGap={2} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
          <XAxis dataKey="type" tick={{ fontSize: 9, fill: '#6B7280' }} interval={0} />
          <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} allowDecimals={false} />
          <RechartsTip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="Central"  fill={ZONE_COLORS.Central}  radius={[3, 3, 0, 0]} maxBarSize={18} />
          <Bar dataKey="Eastern"  fill={ZONE_COLORS.Eastern}  radius={[3, 3, 0, 0]} maxBarSize={18} />
          <Bar dataKey="Northern" fill={ZONE_COLORS.Northern} radius={[3, 3, 0, 0]} maxBarSize={18} />
          <Bar dataKey="Western"  fill={ZONE_COLORS.Western}  radius={[3, 3, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function EvidenceTab() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Evidence Base
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Deep-dive analytical visualizations from the DataJam research dataset.
          Each chart traces a specific structural factor back to its contribution to the 30-day readmission rate.
        </Typography>
      </Box>

      <ScatterSection />
      <OccupancySection />
      <LtcSection />
      <PhysicianSection />
      <VulnerabilityFactorsSection />
      <HospitalTypeSection />
      <CorrelationSection />
    </Box>
  );
}
