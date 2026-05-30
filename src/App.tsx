import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthProvider } from './lib/auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { Login } from './pages/Login'
import { DailyView } from './pages/DailyView'
import { Clients } from './pages/Clients'
import { NewClient } from './pages/NewClient'
import { ClientFile } from './pages/ClientFile'
import { AssessmentForm } from './pages/AssessmentForm'
import { TreatmentForm } from './pages/TreatmentForm'
import { InsuranceReport } from './pages/InsuranceReport'
import { VetLetter } from './pages/VetLetter'
import { HomeExercises } from './pages/HomeExercises'
import { Settings } from './pages/Settings'
import './i18n'

export default function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<DailyView />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/new" element={<NewClient />} />
            <Route path="clients/:id" element={<ClientFile />} />
            <Route path="clients/:id/assessment/new" element={<AssessmentForm />} />
            <Route path="clients/:id/treatment/new" element={<TreatmentForm />} />
            <Route path="clients/:id/reports/insurance" element={<InsuranceReport />} />
            <Route path="clients/:id/reports/vet-letter" element={<VetLetter />} />
            <Route path="clients/:id/reports/home-exercises" element={<HomeExercises />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
