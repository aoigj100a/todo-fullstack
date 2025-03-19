// src/contexts/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh-TW';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 定義翻譯內容
const translations = {
  en: {
    'hero.title': "Easily Manage Everyone's Tasks",
    'hero.subtitle':
      'A simple, intuitive task management app that helps you stay organized and productive.',
    'login.title': 'Quick Login',
    'login.button': 'Login & Go to Dashboard',
    'login.demo': 'Using demo account: demo@example.com / demo1234',
    'button.createAccount': 'Create Account',
    'button.viewGuide': 'View Guide',
    'features.title': 'Key Features',
    'features.taskManagement': 'Task Management',
    'features.taskManagement.desc': 'Create, organize, and track your tasks with ease',
    'features.progressTracking': 'Progress Tracking',
    'features.progressTracking.desc': 'Monitor your progress and stay on top of deadlines',
    'features.multipleViews': 'Multiple Views',
    'features.multipleViews.desc': 'Switch between list and board views for different perspectives',
    'footer.copyright': '© {year} Todo App. All rights reserved.',
    // Todo 頁面標題
    'todos.title': 'My Todos',
    'todos.emptyState': "You don't have any todos yet. Create one to get started!",
    'todos.emptyStateFiltered': 'No matching tasks',
    'todos.noTasks': 'No tasks in this status',
  },
  'zh-TW': {
    'hero.title': '輕鬆地管理大家的任務',
    'hero.subtitle': '簡單直覺的任務管理應用程式，幫助您保持組織和高效率。',
    'login.title': '快速登入',
    'login.button': '登入並前往儀表板',
    'login.demo': '使用示範帳號: demo@example.com / demo1234',
    'button.createAccount': '建立帳號',
    'button.viewGuide': '查看指南',
    'features.title': '主要功能',
    'features.taskManagement': '任務管理',
    'features.taskManagement.desc': '輕鬆創建、組織和追蹤您的任務',
    'features.progressTracking': '進度追蹤',
    'features.progressTracking.desc': '監控您的進度並掌握截止日期',
    'features.multipleViews': '多種視圖',
    'features.multipleViews.desc': '在列表和看板視圖之間切換，獲得不同的視角',
    'footer.copyright': '© {year} Todo 應用程式。保留所有權利。',
    // Todo 頁面標題
    'todos.title': '我的待辦事項',
    'todos.emptyState': '您還沒有任何待辦事項。建立一個開始吧！',
    'todos.emptyStateFiltered': '沒有符合條件的任務',
    'todos.noTasks': '此狀態沒有任務',
  },
};

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
  const t = (key: string): string => {
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
