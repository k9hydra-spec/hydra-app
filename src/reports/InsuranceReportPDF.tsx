import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer'
import type { Client, Assessment, Treatment } from '@/lib/supabase'

// Register Hebrew-compatible font (using built-in Helvetica for now, Hebrew via Unicode)
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 45,
    backgroundColor: '#ffffff',
    direction: 'rtl',
  },
  // Header
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#5BB8C5',
  },
  clinicName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#5BB8C5',
    textAlign: 'right',
  },
  clinicDetails: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'right',
    lineHeight: 1.5,
    marginTop: 3,
  },
  reportTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    textAlign: 'left',
    marginTop: 4,
  },
  reportDate: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'left',
  },
  // Sections
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#5BB8C5',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  // Info grid
  infoGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 4,
  },
  infoItem: {
    width: '48%',
    flexDirection: 'row-reverse',
    gap: 4,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 8.5,
    color: '#64748b',
    width: 80,
    textAlign: 'right',
  },
  infoValue: {
    fontSize: 8.5,
    color: '#1e293b',
    fontFamily: 'Helvetica-Bold',
    flex: 1,
    textAlign: 'right',
  },
  // Table
  table: {
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: '#f8fafc',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row-reverse',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    fontSize: 8.5,
    color: '#1e293b',
    textAlign: 'right',
  },
  tableCellHeader: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    textAlign: 'right',
  },
  col1: { width: '12%' },
  col2: { width: '28%' },
  col3: { width: '20%' },
  col4: { width: '40%' },
  // Summary box
  summaryBox: {
    backgroundColor: '#f0fdf9',
    borderWidth: 0.5,
    borderColor: '#5BB8C5',
    borderRadius: 4,
    padding: 10,
    marginTop: 6,
  },
  summaryText: {
    fontSize: 9,
    color: '#1e293b',
    lineHeight: 1.6,
    textAlign: 'right',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 45,
    right: 45,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: '#94a3b8',
  },
  pageNumber: {
    fontSize: 7.5,
    color: '#94a3b8',
  },
  // Signature area
  signatureArea: {
    marginTop: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    gap: 40,
  },
  signatureLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#1e293b',
    width: 120,
    marginBottom: 3,
  },
  signatureLabel: {
    fontSize: 7.5,
    color: '#64748b',
    textAlign: 'right',
  },
})

type Props = {
  client: Client
  assessment?: Assessment
  treatments: Treatment[]
  clinicName?: string
  clinicPhone?: string
  clinicAddress?: string
  therapistName?: string
  dateFrom?: string
  dateTo?: string
  includeRecommendations?: boolean
  language?: 'he' | 'en'
}

function InfoRow({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (!value && value !== 0) return null
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoValue}>
        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
      </Text>
      <Text style={styles.infoLabel}>{label}:</Text>
    </View>
  )
}

export function InsuranceReportPDF({
  client,
  assessment,
  treatments,
  clinicName = 'HYDRA',
  clinicPhone = '',
  clinicAddress = '',
  therapistName = '',
  dateFrom,
  dateTo,
  includeRecommendations = true,
}: Props) {
  const filtered = treatments.filter(t => {
    if (dateFrom && t.date < dateFrom) return false
    if (dateTo && t.date > dateTo) return false
    return true
  }).sort((a, b) => a.date.localeCompare(b.date))

  const today = new Date().toLocaleDateString('he-IL')
  const subtitleLine = [clinicPhone, clinicAddress].filter(Boolean).join(' | ')

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.clinicName}>{clinicName}</Text>
            <Text style={styles.clinicDetails}>מרכז הידרותרפיה ופיזיותרפיה לבעלי חיים</Text>
            {subtitleLine ? <Text style={styles.clinicDetails}>{subtitleLine}</Text> : null}
          </View>
          <View>
            <Text style={styles.reportTitle}>דוח טיפולים לביטוח</Text>
            <Text style={styles.reportTitle}>Insurance Treatment Report</Text>
            <Text style={styles.reportDate}>תאריך הפקה: {today}</Text>
          </View>
        </View>

        {/* Patient info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>פרטי המטופל / Patient Details</Text>
          <View style={styles.infoGrid}>
            <InfoRow label="שם החיה / Pet Name" value={client.pet_name} />
            <InfoRow label="גזע / Breed" value={client.pet_breed} />
            <InfoRow label="תאריך לידה / DOB" value={client.pet_dob} />
            <InfoRow label="מין / Sex" value={client.pet_sex} />
            <InfoRow label="שם הבעלים / Owner" value={client.owner_name} />
            <InfoRow label="טלפון / Phone" value={client.owner_phone} />
            <InfoRow label="וטרינר / Vet" value={client.vet_name} />
            <InfoRow label="מפנה / Referrer" value={client.referrer} />
            <InfoRow label="ביטוח / Insurance" value={client.insurance_company} />
          </View>
        </View>

        {/* Diagnosis */}
        {assessment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>אבחנה / Diagnosis</Text>
            <View style={styles.infoGrid}>
              <InfoRow label="תאריך אבחון / Date" value={assessment.date} />
              <InfoRow label="סיבת הגעה / Reason" value={assessment.reason} />
              <InfoRow label="תלונה עיקרית / Chief Complaint" value={assessment.chief_complaint} />
              <InfoRow label="גף מושפע / Affected Limb" value={assessment.affected_limb} />
              <InfoRow label="דפוס הליכה / Gait" value={assessment.gait_pattern} />
              <InfoRow label="דרגת כאב / Pain" value={assessment.pain_score ? `${assessment.pain_score}/5` : undefined} />
              {assessment.had_surgery && (
                <InfoRow label="ניתוח / Surgery" value={assessment.surgery_type} />
              )}
              {assessment.existing_diagnosis && (
                <InfoRow label="אבחון / Diagnosis" value={assessment.diagnosis_details} />
              )}
            </View>
            {assessment.treatment_plan && (
              <View style={{ marginTop: 6 }}>
                <Text style={[styles.infoLabel, { marginBottom: 3 }]}>תוכנית טיפול / Treatment Plan:</Text>
                <Text style={[styles.summaryText, { backgroundColor: '#f8fafc', padding: 6, borderRadius: 3 }]}>
                  {assessment.treatment_plan}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Treatments table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            היסטוריית טיפולים / Treatment History
            {dateFrom && dateTo ? `  (${dateFrom} – ${dateTo})` : ''}
          </Text>
          <Text style={[styles.infoLabel, { marginBottom: 6 }]}>
            סה"כ טיפולים / Total Treatments: {filtered.length}
          </Text>

          {filtered.length > 0 && (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCellHeader, styles.col1]}>#</Text>
                <Text style={[styles.tableCellHeader, styles.col1]}>תאריך</Text>
                <Text style={[styles.tableCellHeader, styles.col2]}>סוג טיפול</Text>
                <Text style={[styles.tableCellHeader, styles.col3]}>התקדמות</Text>
                <Text style={[styles.tableCellHeader, styles.col4]}>המלצות</Text>
              </View>
              {filtered.map((t, i) => (
                <View key={t.id} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.tableCell, styles.col1]}>{t.treatment_number ?? i + 1}</Text>
                  <Text style={[styles.tableCell, styles.col1]}>{t.date}</Text>
                  <Text style={[styles.tableCell, styles.col2]}>{t.treatment_type ?? ''}</Text>
                  <Text style={[styles.tableCell, styles.col3]}>{t.progress ?? ''}</Text>
                  <Text style={[styles.tableCell, styles.col4]}>{t.recommendations ?? ''}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Recommendations summary */}
        {includeRecommendations && filtered.length > 0 && filtered[filtered.length - 1].recommendations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>סיכום והמלצות / Summary & Recommendations</Text>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                {filtered[filtered.length - 1].therapist_notes ?? ''}
                {filtered[filtered.length - 1].therapist_notes ? '\n' : ''}
                {filtered[filtered.length - 1].recommendations}
              </Text>
            </View>
          </View>
        )}

        {/* Signature */}
        <View style={styles.signatureArea}>
          <View>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>חתימה / Signature</Text>
          </View>
          <View>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>
              {therapistName || 'שם המטפלת / Therapist Name'}
            </Text>
          </View>
          <View>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>תאריך / Date</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{clinicName} | {subtitleLine}</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          } />
        </View>

      </Page>
    </Document>
  )
}
