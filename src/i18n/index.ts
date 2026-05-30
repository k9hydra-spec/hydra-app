import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const he = {
  nav: {
    daily: 'יום עבודה',
    clients: 'לקוחות',
    newClient: 'לקוח חדש',
    settings: 'הגדרות',
  },
  app: {
    name: 'HYDRA',
    subtitle: 'מרכז הידרותרפיה ופיזיותרפיה לבעלי חיים',
  },
  daily: {
    title: 'יום עבודה',
    today: 'היום',
    addClient: 'הוספת לקוח ליום',
    noClients: 'אין לקוחות מתוכננים להיום',
  },
  clients: {
    title: 'לקוחות',
    search: 'חיפוש לפי שם לקוח או בעל חיים...',
    newClient: 'לקוח חדש',
    noResults: 'לא נמצאו לקוחות',
    active: 'פעיל',
    inactive: 'לא פעיל',
  },
  newClient: {
    title: 'לקוח חדש',
    petName: 'שם בעל החיים',
    ownerName: 'שם הבעלים',
    phone: 'טלפון',
    save: 'שמירה',
    cancel: 'ביטול',
  },
  settings: {
    title: 'הגדרות',
    clinic: 'פרטי הקליניקה',
    language: 'שפה',
    users: 'משתמשים',
  },
}

const en = {
  nav: {
    daily: 'Work Day',
    clients: 'Clients',
    newClient: 'New Client',
    settings: 'Settings',
  },
  app: {
    name: 'HYDRA',
    subtitle: 'Animal Rehabilitation Center',
  },
  daily: {
    title: 'Work Day',
    today: 'Today',
    addClient: 'Add Client to Day',
    noClients: 'No clients scheduled for today',
  },
  clients: {
    title: 'Clients',
    search: 'Search by client or pet name...',
    newClient: 'New Client',
    noResults: 'No clients found',
    active: 'Active',
    inactive: 'Inactive',
  },
  newClient: {
    title: 'New Client',
    petName: 'Pet Name',
    ownerName: 'Owner Name',
    phone: 'Phone',
    save: 'Save',
    cancel: 'Cancel',
  },
  settings: {
    title: 'Settings',
    clinic: 'Clinic Details',
    language: 'Language',
    users: 'Users',
  },
}

i18n.use(initReactI18next).init({
  resources: {
    he: { translation: he },
    en: { translation: en },
  },
  lng: 'he',
  fallbackLng: 'he',
  interpolation: { escapeValue: false },
})

export default i18n
