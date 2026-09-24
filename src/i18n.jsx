import { useState, useEffect, createContext, useContext } from 'react'

const STRINGS = {
  en: {
    tagline: "Know what's going out.",
    // Navigation
    navSchedule: 'Schedule',
    navAlerts: 'Alerts',
    navReport: 'Report',
    navSettings: 'Settings',
    // Schedule
    yourAddress: 'Your service address',
    addressPlaceholder: 'Street address, city, state ZIP',
    findSchedule: 'Find my schedule',
    lookingUp: 'Looking up…',
    nextPickup: 'Next pickup',
    nextPickups: 'Next pickups',
    comingUp: 'Coming up',
    seeMore: (n) => `See ${n} more pickup ${n === 1 ? 'day' : 'days'}`,
    today: 'Today',
    tomorrow: 'Tomorrow',
    inDays: (n) => `In ${n} days`,
    // Errors
    notFound: "We couldn't find that address. You can place a pin on the map instead.",
    outsideArea: 'That location is outside our service area.',
    // Map
    mapHelp: 'Tap the map to move the pin onto your house, then confirm.',
    useLocation: 'Use this location',
    checking: 'Checking…',
    enterAgain: 'Enter address again',
    pinnedLocation: 'Pinned location',
    // Settings
    openOnPhone: 'Open Kurbly on your phone to turn on reminders.',
    pickupReminders: 'Pickup reminders',
    reminderSubtitle: 'Get notified before each collection',
    when: 'When',
    nightBefore: 'Night before',
    morningOf: 'Morning of',
    time: 'Time',
    remindMeAbout: 'Remind me about',
    trash: 'Trash',
    recycling: 'Recycling',
    bulk: 'Bulk pickup',
    language: 'Language',
    saved: 'Saved',
    loading: 'Loading…',
    // Placeholders
    noAlerts: 'No service alerts right now.',
    reportSoon: 'Report an issue — coming next.',
	change: 'Change',
    cancel: 'Cancel',
    alertsTitle: 'Service alerts',
    noAlertsYet: 'No alerts right now. Holiday changes, weather closures and service notices will appear here.',
    catHoliday: 'Holiday',
    catWeather: 'Weather',
    catMaintenance: 'Maintenance',
    catNotice: 'Notice',
  },
  es: {
    tagline: 'Sepa qué sacar a la acera.',
    navSchedule: 'Horario',
    navAlerts: 'Avisos',
    navReport: 'Reportar',
    navSettings: 'Ajustes',
    yourAddress: 'Su dirección de servicio',
    addressPlaceholder: 'Dirección, ciudad, estado, código postal',
    findSchedule: 'Buscar mi horario',
    lookingUp: 'Buscando…',
    nextPickup: 'Próxima recolección',
    nextPickups: 'Próximas recolecciones',
    comingUp: 'Próximamente',
    seeMore: (n) => `Ver ${n} día${n === 1 ? '' : 's'} más`,
    today: 'Hoy',
    tomorrow: 'Mañana',
    inDays: (n) => `En ${n} días`,
    notFound: 'No encontramos esa dirección. Puede marcar su ubicación en el mapa.',
    outsideArea: 'Esa ubicación está fuera de nuestra área de servicio.',
    mapHelp: 'Toque el mapa para mover el marcador a su casa y confirme.',
    useLocation: 'Usar esta ubicación',
    checking: 'Verificando…',
    enterAgain: 'Ingresar dirección otra vez',
    pinnedLocation: 'Ubicación marcada',
    openOnPhone: 'Abra Kurbly en su teléfono para activar los recordatorios.',
    pickupReminders: 'Recordatorios de recolección',
    reminderSubtitle: 'Reciba un aviso antes de cada recolección',
    when: 'Cuándo',
    nightBefore: 'La noche anterior',
    morningOf: 'La mañana del día',
    time: 'Hora',
    remindMeAbout: 'Recordarme sobre',
    trash: 'Basura',
    recycling: 'Reciclaje',
    bulk: 'Recolección de voluminosos',
    language: 'Idioma',
    saved: 'Guardado',
    loading: 'Cargando…',
    noAlerts: 'No hay avisos de servicio en este momento.',
    reportSoon: 'Reportar un problema — próximamente.',
    change: 'Cambiar',
    cancel: 'Cancelar',
    alertsTitle: 'Avisos de servicio',
    noAlertsYet: 'No hay avisos por ahora. Los cambios por días festivos, cierres por clima y avisos de servicio aparecerán aquí.',
    catHoliday: 'Día festivo',
    catWeather: 'Clima',
    catMaintenance: 'Mantenimiento',
    catNotice: 'Aviso',
  },
}

// Category labels, since service names come from the database in English
export const CATEGORY_LABELS = {
  en: { trash: 'Trash', recycling: 'Recycling', bulk: 'Bulk Pickup', yard_waste: 'Yard Waste' },
  es: { trash: 'Basura', recycling: 'Reciclaje', bulk: 'Voluminosos', yard_waste: 'Desechos de jardín' },
}

export function detectLanguage() {
  const saved = localStorage.getItem('language')
  if (saved === 'en' || saved === 'es') return saved
  const device = (navigator.language || 'en').slice(0, 2).toLowerCase()
  return device === 'es' ? 'es' : 'en'
}

const LangContext = createContext({ lang: 'en', t: STRINGS.en, setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage)

  useEffect(() => {
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
  }, [lang])

  const value = {
    lang,
    t: STRINGS[lang],
    locale: lang === 'es' ? 'es-US' : 'en-US',
    setLang: setLangState,
  }
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}