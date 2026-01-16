export interface Translations {
  [key: string]: string;
}

export interface LocaleData {
  [locale: string]: Translations;
}

export const defaultTranslations: LocaleData = {
  en: {
    placeholder: "Message...",
    poweredBy: "Powered by",
    send: "Send",
    retry: "Retry",
    error: "Something went wrong",
    errorRetry: "Failed to send message. Please try again.",
    welcomeBack: "Welcome back!",
    newChat: "New chat",
    clearHistory: "Clear history",
    typing: "Typing...",
    today: "Today",
    yesterday: "Yesterday",
    lastWeek: "Last week",
  },
  es: {
    placeholder: "Mensaje...",
    poweredBy: "Desarrollado por",
    send: "Enviar",
    retry: "Reintentar",
    error: "Algo salió mal",
    errorRetry: "Error al enviar el mensaje. Por favor, intenta de nuevo.",
    welcomeBack: "¡Bienvenido de nuevo!",
    newChat: "Nuevo chat",
    clearHistory: "Limpiar historial",
    typing: "Escribiendo...",
    today: "Hoy",
    yesterday: "Ayer",
    lastWeek: "Última semana",
  },
  fr: {
    placeholder: "Message...",
    poweredBy: "Propulsé par",
    send: "Envoyer",
    retry: "Réessayer",
    error: "Quelque chose s'est mal passé",
    errorRetry: "Échec de l'envoi du message. Veuillez réessayer.",
    welcomeBack: "Bon retour!",
    newChat: "Nouveau chat",
    clearHistory: "Effacer l'historique",
    typing: "En train d'écrire...",
    today: "Aujourd'hui",
    yesterday: "Hier",
    lastWeek: "La semaine dernière",
  },
  de: {
    placeholder: "Nachricht...",
    poweredBy: "Unterstützt von",
    send: "Senden",
    retry: "Wiederholen",
    error: "Etwas ist schief gelaufen",
    errorRetry: "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    welcomeBack: "Willkommen zurück!",
    newChat: "Neuer Chat",
    clearHistory: "Verlauf löschen",
    typing: "Tippen...",
    today: "Heute",
    yesterday: "Gestern",
    lastWeek: "Letzte Woche",
  },
  pt: {
    placeholder: "Mensagem...",
    poweredBy: "Desenvolvido por",
    send: "Enviar",
    retry: "Tentar novamente",
    error: "Algo deu errado",
    errorRetry: "Falha ao enviar mensagem. Por favor, tente novamente.",
    welcomeBack: "Bem-vindo de volta!",
    newChat: "Novo chat",
    clearHistory: "Limpar histórico",
    typing: "Digitando...",
    today: "Hoje",
    yesterday: "Ontem",
    lastWeek: "Semana passada",
  },
};

export function getTranslation(
  locale: string,
  key: string,
  customTranslations?: LocaleData
): string {
  // Check custom translations first
  if (customTranslations?.[locale]?.[key]) {
    return customTranslations[locale][key];
  }
  
  // Check default translations
  if (defaultTranslations[locale]?.[key]) {
    return defaultTranslations[locale][key];
  }
  
  // Fallback to English
  if (defaultTranslations.en[key]) {
    return defaultTranslations.en[key];
  }
  
  // Return the key itself as last resort
  return key;
}
