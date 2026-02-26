'use client'

import { useEffect } from 'react'

interface LanguageSetterProps {
  language: string
}

export function LanguageSetter({ language }: LanguageSetterProps) {
  useEffect(() => {
    // Update the HTML lang attribute based on the selected language
    const htmlElement = document.documentElement
    
    // Map language codes to proper HTML lang values
    const langMap: Record<string, string> = {
      'en': 'en',
      'hi': 'hi',
      'ta': 'ta', // Tamil
    }
    
    const langCode = langMap[language] || 'en'
    htmlElement.lang = langCode
    htmlElement.dir = language === 'ta' ? 'ltr' : 'ltr' // Tamil is LTR like English
  }, [language])

  return null
}
