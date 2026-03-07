export const ZONE_DATA = [
  {
    zone: 'Northern', readmissionRate: 9.2, vulnerabilityIndex: 85,
    avgOccupancy: 84.04, pctOver90: 39.88, totalHospitals: 9,
    ltcBeds: 1549, physicianPer100k: 182.45, pct65Plus: 14.05,
    annualDischarges: 12500, annualReadmissions: 1150,
    color: '#DC2626', riskLevel: 'Critical',
  },
  {
    zone: 'Eastern', readmissionRate: 8.8, vulnerabilityIndex: 63,
    avgOccupancy: 68.51, pctOver90: 21.14, totalHospitals: 14,
    ltcBeds: 1906, physicianPer100k: 193.18, pct65Plus: 14.45,
    annualDischarges: 14000, annualReadmissions: 1232,
    color: '#F59E0B', riskLevel: 'High',
  },
  {
    zone: 'Western', readmissionRate: 8.0, vulnerabilityIndex: 55,
    avgOccupancy: 122.05, pctOver90: 98.10, totalHospitals: 12,
    ltcBeds: 2174, physicianPer100k: 209.28, pct65Plus: 14.25,
    annualDischarges: 16000, annualReadmissions: 1280,
    color: '#3B82F6', riskLevel: 'Moderate',
  },
  {
    zone: 'Central', readmissionRate: 8.6, vulnerabilityIndex: 25,
    avgOccupancy: 96.40, pctOver90: 77.62, totalHospitals: 13,
    ltcBeds: 2847, physicianPer100k: 268.31, pct65Plus: 9.06,
    annualDischarges: 28000, annualReadmissions: 2408,
    color: '#10B981', riskLevel: 'Low',
  },
];

// Normalized 0-100 where 100 = highest risk indicator for that metric
export const COMPARISON_DATA = [
  {
    metric: 'Readmission Rate',
    Northern: 85, Eastern: 65, Western: 25, Central: 55,
    description: 'Higher = worse. Normalized from 7.5–9.5 range.',
  },
  {
    metric: 'Bed Occupancy',
    Northern: 37, Eastern: 13, Western: 95, Central: 56,
    description: 'Higher = more overcrowded. Normalized from 60–130%.',
  },
  {
    metric: 'Physician Gap',
    Northern: 98, Eastern: 89, Western: 76, Central: 27,
    description: 'Higher = fewer physicians. Inverted scale (300 = none).',
  },
  {
    metric: 'LTC Shortage',
    Northern: 96, Eastern: 71, Western: 52, Central: 4,
    description: 'Higher = fewer LTC beds. Inverted relative to max (2847).',
  },
];

export const TREND_DATA = [
  { year: '2020-21', novaScotia: 8.7, canada: 8.9, northern: 9.0, eastern: 8.5, western: 7.8, central: 8.5 },
  { year: '2021-22', novaScotia: 8.8, canada: 8.8, northern: 9.1, eastern: 8.6, western: 7.9, central: 8.5 },
  { year: '2022-23', novaScotia: 8.9, canada: 8.7, northern: 9.1, eastern: 8.7, western: 7.9, central: 8.6 },
  { year: '2023-24', novaScotia: 9.0, canada: 8.6, northern: 9.2, eastern: 8.8, western: 8.0, central: 8.6 },
  { year: '2024-25', novaScotia: 9.0, canada: 8.5, northern: 9.2, eastern: 8.8, western: 8.0, central: 8.6 },
];

export const VULNERABILITY_COMPONENTS = [
  { zone: 'Northern', readmission: 25.5, occupancy: 12.8, ltcShortage: 20.0, physicianGap: 15.0, aging: 11.7, total: 85 },
  { zone: 'Eastern',  readmission: 21.0, occupancy: 5.6,  ltcShortage: 14.2, physicianGap: 12.8, aging: 9.4,  total: 63 },
  { zone: 'Western',  readmission: 15.0, occupancy: 18.4, ltcShortage: 8.6,  physicianGap: 7.2,  aging: 5.8,  total: 55 },
  { zone: 'Central',  readmission: 18.0, occupancy: 2.8,  ltcShortage: 0.0,  physicianGap: 0.0,  aging: 4.2,  total: 25 },
];

export const PATIENT_DATA = [
  {
    id: 'P-1001', name: 'Margaret T.', age: 78, zone: 'Northern',
    dischargeDate: '2026-03-04', primaryDiagnosis: 'COPD Exacerbation',
    comorbidities: ['Diabetes Type 2', 'Hypertension', 'Heart Failure'],
    hasFamilyPhysician: false, ltcBedAvailable: false,
    riskScore: 92, riskLevel: 'Critical',
    riskFactors: [
      { factor: 'Zone Vulnerability', score: 25.5, detail: 'Northern Zone — highest vulnerability index (85/100)' },
      { factor: 'Age (78 yrs)', score: 18.0, detail: '78 years old — significantly above 65+ threshold' },
      { factor: 'Chronic Conditions', score: 20.0, detail: '3 chronic comorbidities including COPD + HF' },
      { factor: 'No Family Physician', score: 15.0, detail: 'No GP assigned — cannot schedule follow-up' },
      { factor: 'No LTC Bed', score: 13.5, detail: 'No long-term care bed available in Northern Zone' },
    ],
    recommendedAction: 'URGENT: 48-hr callback + arrange community nurse visit',
    status: 'Awaiting Callback',
  },
  {
    id: 'P-1002', name: 'James R.', age: 72, zone: 'Eastern',
    dischargeDate: '2026-03-05', primaryDiagnosis: 'Hip Replacement Recovery',
    comorbidities: ['Osteoarthritis'],
    hasFamilyPhysician: true, ltcBedAvailable: true,
    riskScore: 45, riskLevel: 'Moderate',
    riskFactors: [
      { factor: 'Zone Vulnerability', score: 18.9, detail: 'Eastern Zone — elevated vulnerability (63/100)' },
      { factor: 'Age (72 yrs)', score: 14.0, detail: '72 years old — above 65+ threshold' },
      { factor: 'Chronic Conditions', score: 5.0, detail: '1 chronic condition — low comorbidity load' },
      { factor: 'Has Family Physician', score: 3.0, detail: 'GP assigned — follow-up can be scheduled' },
      { factor: 'LTC Bed Available', score: 4.1, detail: 'Respite bed available if needed' },
    ],
    recommendedAction: 'Schedule 7-day follow-up call',
    status: 'Follow-up Scheduled',
  },
  {
    id: 'P-1003', name: 'Dorothy L.', age: 82, zone: 'Northern',
    dischargeDate: '2026-03-03', primaryDiagnosis: 'Pneumonia',
    comorbidities: ['COPD', 'Atrial Fibrillation', 'Chronic Kidney Disease', 'Diabetes Type 2'],
    hasFamilyPhysician: false, ltcBedAvailable: false,
    riskScore: 96, riskLevel: 'Critical',
    riskFactors: [
      { factor: 'Zone Vulnerability', score: 25.5, detail: 'Northern Zone — highest vulnerability (85/100)' },
      { factor: 'Age (82 yrs)', score: 20.0, detail: '82 years old — very high age risk' },
      { factor: 'Chronic Conditions', score: 20.0, detail: '4 chronic comorbidities — very high complexity' },
      { factor: 'No Family Physician', score: 15.0, detail: 'No GP — critical gap in continuity of care' },
      { factor: 'No LTC Bed', score: 15.0, detail: 'No safe discharge destination available' },
    ],
    recommendedAction: 'URGENT: Immediate community health worker assignment',
    status: 'Escalated',
  },
  {
    id: 'P-1004', name: 'Robert M.', age: 68, zone: 'Central',
    dischargeDate: '2026-03-05', primaryDiagnosis: 'Cardiac Stent Placement',
    comorbidities: ['Coronary Artery Disease', 'Hyperlipidemia'],
    hasFamilyPhysician: true, ltcBedAvailable: true,
    riskScore: 28, riskLevel: 'Low',
    riskFactors: [
      { factor: 'Zone Vulnerability', score: 7.5, detail: 'Central Zone — lowest vulnerability (25/100)' },
      { factor: 'Age (68 yrs)', score: 10.0, detail: '68 years old — slightly above 65+ threshold' },
      { factor: 'Chronic Conditions', score: 8.0, detail: '2 chronic conditions — moderate load' },
      { factor: 'Has Family Physician', score: 1.5, detail: 'GP assigned — strong follow-up pathway' },
      { factor: 'LTC Bed Available', score: 1.0, detail: 'System capacity adequate in Central Zone' },
    ],
    recommendedAction: 'Standard discharge — no additional intervention',
    status: 'Discharged',
  },
  {
    id: 'P-1005', name: 'Helen K.', age: 75, zone: 'Western',
    dischargeDate: '2026-03-04', primaryDiagnosis: 'Stroke Recovery',
    comorbidities: ['Hypertension', 'Diabetes Type 2', 'Atrial Fibrillation'],
    hasFamilyPhysician: true, ltcBedAvailable: false,
    riskScore: 67, riskLevel: 'Moderate',
    riskFactors: [
      { factor: 'Zone Vulnerability', score: 16.5, detail: 'Western Zone — moderate vulnerability (55/100)' },
      { factor: 'Age (75 yrs)', score: 16.0, detail: '75 years old — elevated age risk' },
      { factor: 'Chronic Conditions', score: 15.0, detail: '3 chronic conditions including stroke risk factors' },
      { factor: 'Has Family Physician', score: 4.0, detail: 'GP assigned but Western Zone has limited availability' },
      { factor: 'No LTC Bed', score: 15.5, detail: 'No transitional bed available — must go home' },
    ],
    recommendedAction: 'Schedule 48-hr callback + arrange home care assessment',
    status: 'Awaiting Callback',
  },
  {
    id: 'P-1006', name: 'William B.', age: 85, zone: 'Eastern',
    dischargeDate: '2026-03-03', primaryDiagnosis: 'Heart Failure Decompensation',
    comorbidities: ['Heart Failure', 'COPD', 'Chronic Kidney Disease'],
    hasFamilyPhysician: false, ltcBedAvailable: false,
    riskScore: 88, riskLevel: 'Critical',
    riskFactors: [
      { factor: 'Zone Vulnerability', score: 18.9, detail: 'Eastern Zone — elevated vulnerability (63/100)' },
      { factor: 'Age (85 yrs)', score: 20.0, detail: '85 years old — very high age risk' },
      { factor: 'Chronic Conditions', score: 20.0, detail: '3 serious chronic conditions — high complexity' },
      { factor: 'No Family Physician', score: 15.0, detail: 'No GP in rural Eastern Zone' },
      { factor: 'No LTC Bed', score: 14.1, detail: 'LTC capacity limited in Eastern Zone' },
    ],
    recommendedAction: 'URGENT: 48-hr callback + arrange NP home visit',
    status: 'Awaiting Callback',
  },
  {
    id: 'P-1007', name: 'Anne S.', age: 61, zone: 'Central',
    dischargeDate: '2026-03-06', primaryDiagnosis: 'Appendectomy',
    comorbidities: [],
    hasFamilyPhysician: true, ltcBedAvailable: true,
    riskScore: 12, riskLevel: 'Low',
    riskFactors: [
      { factor: 'Zone Vulnerability', score: 7.5, detail: 'Central Zone — lowest vulnerability' },
      { factor: 'Age (61 yrs)', score: 2.0, detail: '61 years old — below 65 threshold' },
      { factor: 'Chronic Conditions', score: 0.0, detail: 'No chronic conditions' },
      { factor: 'Has Family Physician', score: 1.5, detail: 'GP assigned' },
      { factor: 'LTC Bed Available', score: 1.0, detail: 'Not applicable — routine discharge' },
    ],
    recommendedAction: 'Standard discharge',
    status: 'Discharged',
  },
  {
    id: 'P-1008', name: 'Frank D.', age: 79, zone: 'Northern',
    dischargeDate: '2026-03-05', primaryDiagnosis: 'Diabetic Ketoacidosis',
    comorbidities: ['Diabetes Type 1', 'Peripheral Neuropathy', 'Chronic Kidney Disease'],
    hasFamilyPhysician: false, ltcBedAvailable: false,
    riskScore: 91, riskLevel: 'Critical',
    riskFactors: [
      { factor: 'Zone Vulnerability', score: 25.5, detail: 'Northern Zone — highest vulnerability' },
      { factor: 'Age (79 yrs)', score: 17.0, detail: '79 years old — high age risk' },
      { factor: 'Chronic Conditions', score: 18.0, detail: '3 chronic conditions — insulin-dependent DM is high-risk' },
      { factor: 'No Family Physician', score: 15.0, detail: 'No GP — insulin management requires close follow-up' },
      { factor: 'No LTC Bed', score: 15.5, detail: 'Northern Zone LTC severely constrained' },
    ],
    recommendedAction: 'URGENT: Immediate 48-hr callback + pharmacy outreach for insulin management',
    status: 'Awaiting Callback',
  },
];

export const IMPACT_DATA = {
  northern: {
    currentRate: 9.2, targetRate: 8.0,
    annualDischarges: 12500, currentReadmissions: 1150,
    projectedReadmissions: 1000, readmissionsAvoided: 150,
    costPerReadmission: 28000, annualSaving: 4200000,
    pilotPhase: 'Phase 1 — Months 1–6',
  },
  eastern: {
    currentRate: 8.8, targetRate: 8.0,
    annualDischarges: 14000, currentReadmissions: 1232,
    projectedReadmissions: 1120, readmissionsAvoided: 112,
    costPerReadmission: 28000, annualSaving: 3136000,
    pilotPhase: 'Phase 2 — Months 7–12',
  },
  provinceWide: {
    totalReadmissionsAvoided: 300,
    totalAnnualSaving: 8400000,
    fullRollout: 'Phase 3 — Year 2',
  },
};

export const BEFORE_AFTER_DATA = [
  { zone: 'Northern', current: 9.2, projected: 8.0, color: '#DC2626' },
  { zone: 'Eastern',  current: 8.8, projected: 8.0, color: '#F59E0B' },
  { zone: 'Western',  current: 8.0, projected: 8.0, color: '#3B82F6' },
  { zone: 'Central',  current: 8.6, projected: 8.6, color: '#10B981' },
];

// ─── Evidence Base Tab Data ────────────────────────────────────────────────

// Image 3 (top): Monthly acute occupancy by zone — quarterly approx. 2021–2024
export const MONTHLY_OCCUPANCY_DATA = [
  { month: 'Jan 21', central: 92, eastern: 68, northern: 76, western: 118 },
  { month: 'Apr 21', central: 88, eastern: 62, northern: 72, western: 112 },
  { month: 'Jul 21', central: 85, eastern: 60, northern: 70, western: 108 },
  { month: 'Oct 21', central: 94, eastern: 65, northern: 78, western: 122 },
  { month: 'Jan 22', central: 96, eastern: 70, northern: 80, western: 128 },
  { month: 'Apr 22', central: 90, eastern: 64, northern: 75, western: 119 },
  { month: 'Jul 22', central: 87, eastern: 61, northern: 72, western: 115 },
  { month: 'Oct 22', central: 98, eastern: 67, northern: 82, western: 130 },
  { month: 'Jan 23', central: 100, eastern: 72, northern: 85, western: 134 },
  { month: 'Apr 23', central: 93, eastern: 66, northern: 79, western: 120 },
  { month: 'Jul 23', central: 89, eastern: 63, northern: 74, western: 116 },
  { month: 'Oct 23', central: 102, eastern: 70, northern: 86, western: 131 },
  { month: 'Jan 24', central: 104, eastern: 74, northern: 88, western: 135 },
];

// Image 3 (bottom): % of months where acute occupancy exceeded 90%
export const OCCUPANCY_PRESSURE_DATA = [
  { zone: 'Western',  pctMonthsOver90: 98, color: '#3B82F6' },
  { zone: 'Central',  pctMonthsOver90: 78, color: '#10B981' },
  { zone: 'Northern', pctMonthsOver90: 40, color: '#DC2626' },
  { zone: 'Eastern',  pctMonthsOver90: 21, color: '#F59E0B' },
];

// Image 6: LTC infrastructure detail by zone
export const LTC_DETAIL_DATA = [
  { zone: 'Central',  totalBeds: 2847, nursingHome: 2650, residentialCare: 197, facilities: 35, color: '#10B981' },
  { zone: 'Western',  totalBeds: 2174, nursingHome: 1950, residentialCare: 224, facilities: 43, color: '#3B82F6' },
  { zone: 'Eastern',  totalBeds: 1906, nursingHome: 1751, residentialCare: 155, facilities: 33, color: '#F59E0B' },
  { zone: 'Northern', totalBeds: 1549, nursingHome: 1349, residentialCare: 200, facilities: 32, color: '#DC2626' },
];

// Image 8 (left + middle): Physician supply trends 2020–2024
export const PHYSICIAN_RURAL_DATA = [
  { year: '2020', allPhysicians: 272, familyMedicine: 118, ruralPct: 19.2, familyRuralPct: 16.8 },
  { year: '2021', allPhysicians: 268, familyMedicine: 114, ruralPct: 18.8, familyRuralPct: 16.1 },
  { year: '2022', allPhysicians: 261, familyMedicine: 110, ruralPct: 18.3, familyRuralPct: 15.4 },
  { year: '2023', allPhysicians: 255, familyMedicine: 105, ruralPct: 17.9, familyRuralPct: 14.8 },
  { year: '2024', allPhysicians: 248, familyMedicine: 100, ruralPct: 17.4, familyRuralPct: 14.1 },
];

// Image 5 (left): Hospital count by zone and type
export const HOSPITAL_TYPE_DATA = [
  { type: 'Community',          Central: 4, Eastern: 9, Northern: 4, Western: 5 },
  { type: 'Community Health',   Central: 0, Eastern: 2, Northern: 2, Western: 3 },
  { type: 'Env. Health',        Central: 1, Eastern: 0, Northern: 0, Western: 0 },
  { type: 'Outpatient / NH',    Central: 0, Eastern: 1, Northern: 0, Western: 0 },
  { type: 'Regional',           Central: 0, Eastern: 2, Northern: 3, Western: 3 },
  { type: 'Rehabilitation',     Central: 2, Eastern: 0, Northern: 0, Western: 1 },
  { type: 'Tertiary',           Central: 4, Eastern: 0, Northern: 0, Western: 0 },
];

// Image 9: Correlation matrix — readmission_rate row only (vs all features)
export const CORRELATION_DATA = [
  { feature: 'pct_over_90',        label: '% Months > 90% Occupancy', correlation: 0.97 },
  { feature: 'num_ltc_facilities',  label: 'Number of LTC Facilities',  correlation: 0.95 },
  { feature: 'avg_occupancy',       label: 'Avg Hospital Occupancy (%)', correlation: 0.81 },
  { feature: 'total_beds',          label: 'Total Hospital Beds',        correlation: 0.51 },
  { feature: 'fm_per_100k',         label: 'Family Medicine per 100k',   correlation: 0.46 },
  { feature: 'total_hospitals',     label: 'Total Hospitals',            correlation: 0.43 },
  { feature: 'physician_per_100k',  label: 'All Physicians per 100k',   correlation: 0.40 },
  { feature: 'ltc_beds_per_1000',   label: 'LTC Beds per 1,000 pop',    correlation: 0.34 },
  { feature: 'rural_physician_pct', label: '% Physicians in Rural Areas', correlation: 0.25 },
  { feature: 'hospitals_per_100k',  label: 'Hospitals per 100k pop',    correlation: 0.26 },
  { feature: 'pct_65plus',          label: 'Population Aged 65+ (%)',   correlation: 0.12 },
];
