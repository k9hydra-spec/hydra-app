import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Client } from '@/lib/supabase'

const PRIMARY = '#1D9E75'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 45,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY,
  },
  clinicName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: PRIMARY, textAlign: 'right' },
  clinicSub: { fontSize: 8, color: '#64748b', textAlign: 'right', lineHeight: 1.5, marginTop: 2 },
  titleBlock: { textAlign: 'left' },
  title: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#1e293b' },
  subtitle: { fontSize: 8.5, color: '#64748b', marginTop: 3 },
  petInfo: {
    flexDirection: 'row-reverse',
    gap: 16,
    backgroundColor: '#f0fdf9',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: PRIMARY,
  },
  petInfoItem: { flexDirection: 'row-reverse', gap: 4, alignItems: 'center' },
  petInfoLabel: { fontSize: 8, color: '#64748b' },
  petInfoValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e293b' },
  exerciseCard: {
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  exerciseName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#1e293b', textAlign: 'right' },
  exerciseBadge: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  exerciseBadgeText: { fontSize: 8, color: '#ffffff', fontFamily: 'Helvetica-Bold' },
  exerciseBody: { paddingHorizontal: 10, paddingVertical: 8 },
  exerciseDesc: { fontSize: 8.5, color: '#475569', textAlign: 'right', lineHeight: 1.6 },
  noteText: { fontSize: 8.5, color: '#1e293b', textAlign: 'right', lineHeight: 1.6, fontFamily: 'Helvetica-Oblique' },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 45,
    right: 45,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 7,
  },
  footerText: { fontSize: 7.5, color: '#94a3b8' },
})

const EXERCISE_DESCRIPTIONS: Record<string, string> = {
  'Down to stand': 'שכיבה לעמידה — הכלב מתבקש לשכב ולקום מספר פעמים. חיזוק שרירי הגפיים האחוריות והקדמיות.',
  'Sit to stand': 'ישיבה לעמידה — מישיבה לעמידה מלאה. חיזוק שרירי הירכיים.',
  'Weight shift': 'העברת משקל — העברת משקל הגוף בין הגפיים, לשיפור יציבות וכוח.',
  'Orbit+donut': 'הקפה סביב חפץ — הליכה עיגולית סביב חרוט / דוגנאט לשיפור תנועה צידית.',
  'Elevated front': 'גפיים קדמיות מורמות — עמידה עם הגפיים הקדמיות על משטח גבוה, חיזוק אחורי.',
  'Cavalleti': 'מעבר מעל מוטות — הליכה מעל סדרת מוטות לשיפור תיאום וצעד.',
  'Infinity': 'מסלול אינסוף — הליכה בצורת 8 לשיפור גמישות ותיאום.',
  'Obstacle course': 'מסלול מכשולים — הליכה דרך מכשולים לשיפור מודעות גפיים.',
  'Over and back': 'מעל ובחזרה — קפיצה / מעבר מעל מכשול נמוך בשני הכיוונים.',
  'Wobble board': 'לוח איזון — עמידה על משטח לא יציב לחיזוק שרירי הגב ויציבה.',
  'Cookie stretch': 'מתיחת עוגייה — מתיחה צידית ואחורית של הצוואר, גמישות עמוד שדרה.',
  'Stretch': 'מתיחה — מתיחת שרירים כלליים לפני/אחרי פעילות.',
  'Land treadmill': 'הליכון יבשתי — הליכה קצבית על הליכון לשיפור קצב ואנדורנס.',
  '3 leg stance': 'עמידה על 3 רגליים — הרמת גף אחת לעמידה על 3, לחיזוק ויציבה.',
  'Give paw': 'תן יד — הרמת גף קדמית מבוקרת, לחיזוק שרירי הכתף.',
  'B.disc front': 'דיסק גפיים קדמיות — גפיים קדמיות על דיסק תנודה, חיזוק ליבה.',
  'Massage': 'עיסוי — עיסוי עדין לשיפור זרימת דם והרפיית שרירים.',
  'B.disc all 4': 'דיסק 4 גפיים — כל 4 הגפיים על דיסקים, אתגר יציבה מתקדם.',
  'B.disc back': 'דיסק גפיים אחוריות — גפיים אחוריות על דיסק, חיזוק אחורי.',
  'Side stepping': 'צעדה צידית — הליכה הצידה לשיפור חוזק שרירים ותנועה לטרלית.',
}

export type ExerciseEntry = { name: string; reps: string; sets: string; note?: string }

type Props = {
  client: Client
  exercises: ExerciseEntry[]
  clinicName?: string
  clinicPhone?: string
  therapistName?: string
  generalNote?: string
}

export function HomeExercisesPDF({
  client,
  exercises,
  clinicName = 'HYDRA',
  clinicPhone = '',
  therapistName = '',
  generalNote = '',
}: Props) {
  const today = new Date().toLocaleDateString('he-IL')

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.clinicName}>{clinicName}</Text>
            <Text style={styles.clinicSub}>מרכז הידרותרפיה ופיזיותרפיה לבעלי חיים</Text>
            {clinicPhone ? <Text style={styles.clinicSub}>{clinicPhone}</Text> : null}
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>תרגילים ביתיים</Text>
            <Text style={styles.title}>Home Exercises</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </View>

        {/* Pet info */}
        <View style={styles.petInfo}>
          <View style={styles.petInfoItem}>
            <Text style={styles.petInfoValue}>{client.pet_name}</Text>
            <Text style={styles.petInfoLabel}>שם: </Text>
          </View>
          {client.pet_breed && (
            <View style={styles.petInfoItem}>
              <Text style={styles.petInfoValue}>{client.pet_breed}</Text>
              <Text style={styles.petInfoLabel}>גזע: </Text>
            </View>
          )}
          <View style={styles.petInfoItem}>
            <Text style={styles.petInfoValue}>{client.owner_name}</Text>
            <Text style={styles.petInfoLabel}>בעלים: </Text>
          </View>
          {therapistName && (
            <View style={styles.petInfoItem}>
              <Text style={styles.petInfoValue}>{therapistName}</Text>
              <Text style={styles.petInfoLabel}>מטפלת: </Text>
            </View>
          )}
        </View>

        {/* General note */}
        {generalNote ? (
          <View style={{ marginBottom: 12, backgroundColor: '#fffbeb', borderRadius: 4, padding: 8, borderWidth: 0.5, borderColor: '#fcd34d' }}>
            <Text style={[styles.noteText, { color: '#92400e' }]}>{generalNote}</Text>
          </View>
        ) : null}

        {/* Exercises */}
        <Text style={styles.sectionTitle}>רשימת תרגילים ({exercises.length})</Text>
        {exercises.map((ex, i) => (
          <View key={i} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{i + 1}. {ex.name}</Text>
              {(ex.reps || ex.sets) && (
                <View style={styles.exerciseBadge}>
                  <Text style={styles.exerciseBadgeText}>
                    {[ex.reps && `${ex.reps} חזרות`, ex.sets && `${ex.sets} סטים`].filter(Boolean).join(' × ')}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.exerciseBody}>
              <Text style={styles.exerciseDesc}>
                {EXERCISE_DESCRIPTIONS[ex.name] ?? ex.name}
              </Text>
              {ex.note ? (
                <Text style={[styles.noteText, { marginTop: 4, color: '#6b21a8' }]}>
                  הערה: {ex.note}
                </Text>
              ) : null}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{clinicName}{clinicPhone ? ` | ${clinicPhone}` : ''}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>

      </Page>
    </Document>
  )
}
