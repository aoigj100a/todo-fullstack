// src/contexts/LanguageContext.tsx
'use client';

import { Language } from '@/types/ui';
import { translations } from '@/i18n';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定義 LanguageContextType
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // 嘗試從 localStorage 獲取語言偏好，默認為英文
  const [language, setLanguage] = useState<Language>('en');

  // 在客戶端首次加載時從 localStorage 獲取語言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh-TW')) {
      setLanguage(savedLanguage);
    } else {
      // 可選：檢測瀏覽器語言
      const browserLang = navigator.language;
      if (browserLang.startsWith('zh')) {
        setLanguage('zh-TW');
      }
    }
  }, []);

  // 翻譯函數
  const t = (key: string, vars?: Record<string, string | number>): string => {
    const text = translations[language][key];
    if (text) {
      // 處理變數替換，如 {year}
      return text.replace(/{year}/g, new Date().getFullYear().toString());
    }
    return key; // 如果找不到翻譯，返回原始 key
  };

  // 更新語言並保存到 localStorage
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 自定義 hook 讓組件可以使用語言上下文
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
