import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Client, Assessment, Treatment } from '@/lib/supabase'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 45,
    paddingBottom: 55,
    paddingHorizontal: 50,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#1D9E75',
  },
  clinicName: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#1D9E75', textAlign: 'right' },
  clinicSub: { fontSize: 8, color: '#64748b', textAlign: 'right', lineHeight: 1.6, marginTop: 2 },
  dateBlock: { textAlign: 'left' },
  dateText: { fontSize: 9, color: '#64748b' },
  // Letter body
  addressBlock: { marginBottom: 16 },
  addressLine: { fontSize: 10, color: '#1e293b', textAlign: 'right', lineHeight: 1.7 },
  subject: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    textAlign: 'right',
    marginBottom: 14,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  paragraph: {
    fontSize: 10,
    color: '#1e293b',
    textAlign: 'right',
    lineHeight: 1.8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1D9E75',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  infoLabel: { fontSize: 9, color: '#64748b', width: 90, textAlign: 'right' },
  infoValue: { fontSize: 9, color: '#1e293b', fontFamily: 'Helvetica-Bold', textAlign: 'right', flex: 1 },
  editableBox: {
    borderWidth: 0.5,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    padding: 10,
    minHeight: 60,
    marginBottom: 10,
    backgroundColor: '#f8fafc',
  },
  editableText: { fontSize: 9.5, color: '#1e293b', textAlign: 'right', lineHeight: 1.7 },
  signatureArea: {
    marginTop: 24,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    gap: 40,
  },
  signatureLine: { borderBottomWidth: 0.5, borderBottomColor: '#1e293b', width: 130, marginBottom: 4 },
  signatureLabel: { fontSize: 8, color: '#64748b', textAlign: 'right' },
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 50,
    right: 50,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 7,
  },
  footerText: { fontSize: 7.5, color: '#94a3b8' },
})

type Props = {
  client: Client
  assessment?: Assessment
  treatments: Treatment[]
  clinicName?: string
  clinicPhone?: string
  clinicAddress?: string
  therapistName?: string
  progress?: string
  recommendations?: string
}

export function VetLetterPDF({
  client,
  assessment,
  treatments,
  clinicName = 'HYDRA',
  clinicPhone = '',
  clinicAddress = '',
  therapistName = '',
  progress = '',
  recommendations = '',
}: Props) {
  const today = new Date().toLocaleDateString('he-IL')
  const subtitleLine = [clinicPhone, clinicAddress].filter(Boolean).join(' | ')

  const treatmentTypes = [...new Set(treatments.map(t => t.treatment_type).filter(Boolean))].join(', ')
  const firstDate = treatments.length > 0 ? treatments[treatments.length - 1].date : ''
  const lastDate = treatments.length > 0 ? treatments[0].date : ''

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.clinicName}>{clinicName}</Text>
            <Text style={styles.clinicSub}>מרכז הידרותרפיה ופיזיותרפיה לבעלי חיים</Text>
            {subtitleLine ? <Text style={styles.clinicSub}>{subtitleLine}</Text> : null}
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateText}>{today}</Text>
          </View>
        </View>

        {/* Address to vet */}
        <View style={styles.addressBlock}>
          {client.vet_name ? (
            <Text style={styles.addressLine}>לכבוד: {client.vet_name}</Text>
          ) : (
            <Text style={styles.addressLine}>לכבוד הוטרינר המפנה</Text>
          )}
        </View>

        {/* Subject */}
        <Text style={styles.subject}>
          הנדון: דוח טיפול — {client.pet_name} ({client.pet_breed ?? ''}) / {client.owner_name}
        </Text>

        {/* Opening */}
        <Text style={styles.paragraph}>
          {client.vet_name ? `ד"ר ${client.vet_name} שלום,` : 'שלום,'}
        </Text>
        <Text style={styles.paragraph}>
          {`ברצוני לעדכנך בנוגע לטיפול ב${client.pet_name}, ${client.pet_breed ?? ''}, ${client.pet_sex ?? ''}, המטופל/ת אצלנו במרכז ${clinicName}.`}
        </Text>

        {/* Patient summary */}
        <Text style={styles.sectionTitle}>פרטי המטופל / Patient Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoValue}>{client.pet_name}</Text>
          <Text style={styles.infoLabel}>שם:</Text>
        </View>
        {client.pet_breed && (
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{client.pet_breed}</Text>
            <Text style={styles.infoLabel}>גזע:</Text>
          </View>
        )}
        {client.pet_dob && (
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{client.pet_dob}</Text>
            <Text style={styles.infoLabel}>תאריך לידה:</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoValue}>{client.owner_name}</Text>
          <Text style={styles.infoLabel}>בעלים:</Text>
        </View>

        {/* Diagnosis summary */}
        {assessment && (
          <>
            <Text style={styles.sectionTitle}>אבחנה / Diagnosis</Text>
            {assessment.chief_complaint && (
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>{assessment.chief_complaint}</Text>
                <Text style={styles.infoLabel}>תלונה עיקרית:</Text>
              </View>
            )}
            {assessment.affected_limb && (
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>{assessment.affected_limb}</Text>
                <Text style={styles.infoLabel}>גף מושפע:</Text>
              </View>
            )}
            {assessment.gait_pattern && (
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>{assessment.gait_pattern}</Text>
                <Text style={styles.infoLabel}>דפוס הליכה:</Text>
              </View>
            )}
          </>
        )}

        {/* Treatment summary */}
        {treatments.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>סיכום טיפולים / Treatment Summary</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{treatments.length}</Text>
              <Text style={styles.infoLabel}>מספר טיפולים:</Text>
            </View>
            {firstDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>{firstDate} – {lastDate}</Text>
                <Text style={styles.infoLabel}>תקופה:</Text>
              </View>
            )}
            {treatmentTypes && (
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>{treatmentTypes}</Text>
                <Text style={styles.infoLabel}>סוגי טיפול:</Text>
              </View>
            )}
          </>
        )}

        {/* Progress */}
        {progress ? (
          <>
            <Text style={styles.sectionTitle}>התקדמות / Progress</Text>
            <View style={styles.editableBox}>
              <Text style={styles.editableText}>{progress}</Text>
            </View>
          </>
        ) : null}

        {/* Recommendations */}
        {recommendations ? (
          <>
            <Text style={styles.sectionTitle}>המלצות / Recommendations</Text>
            <View style={styles.editableBox}>
              <Text style={styles.editableText}>{recommendations}</Text>
            </View>
          </>
        ) : null}

        {/* Closing */}
        <Text style={[styles.paragraph, { marginTop: 10 }]}>
          לשאלות נוספות ניתן לפנות אלינו בכל עת.
        </Text>
        <Text style={styles.paragraph}>בברכה,</Text>

        {/* Signature */}
        <View style={styles.signatureArea}>
          <View>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>{therapistName || 'שם המטפלת'}</Text>
          </View>
          <View>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>תאריך</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{clinicName} | {subtitleLine}</Text>
          <Text style={styles.footerText}>{today}</Text>
        </View>

      </Page>
    </Document>
  )
}
