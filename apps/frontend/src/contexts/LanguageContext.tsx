// src/contexts/LanguageContext.tsx
'use client';

import { Language } from '@/types/ui';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

    // 待辦事項狀態
    'status.pending': 'Pending',
    'status.inProgress': 'In Progress',
    'status.completed': 'Completed',
    'status.all': 'All',

    // 篩選與視圖
    'filter.clearFilters': 'Clear Filters',
    'view.list': 'List',
    'view.board': 'Board',

    // 按鈕和操作
    'button.addTodo': 'Add Todo',
    'button.createTodo': 'Create Todo',
    'button.updateTodo': 'Update Todo',
    'button.deleteTodo': 'Delete Todo',
    'button.editTodo': 'Edit Todo',
    'button.cancel': 'Cancel',
    'button.save': 'Save Changes',
    'button.back': 'Back',

    // 表單標籤
    'form.title': 'Title',
    'form.titlePlaceholder': 'Enter todo title',
    'form.description': 'Description',
    'form.descriptionPlaceholder': 'Enter todo description',
    'form.status': 'Status',
    'form.selectStatus': 'Select status',

    // 詳情頁面
    'detail.todoDetails': 'Todo Details',
    'detail.created': 'Created',
    'detail.lastUpdated': 'Last Updated',
    'detail.assignedTo': 'Assigned to',

    // 對話框標題
    'dialog.createTitle': 'Create New Todo',
    'dialog.editTitle': 'Edit Todo',

    // 通知訊息
    'toast.createSuccess': 'Todo created successfully',
    'toast.updateSuccess': 'Todo updated successfully',
    'toast.deleteSuccess': 'Todo deleted successfully',
    'toast.undoDelete': 'Undo',
    'toast.restored': 'Todo restored',
    'toast.statusUpdated': 'Status updated',
    'toast.error.create': 'Failed to create todo',
    'toast.error.update': 'Failed to update todo',
    'toast.error.delete': 'Failed to delete todo',
    'toast.error.load': 'Failed to load todos',
    'toast.error.notFound': 'Todo not found',
    'toast.validation.title': 'Title is required',

    // 幫助信息
    'help.title': 'Keyboard Shortcuts',
    'help.shortcut.open': 'Enter/Space - Open a todo',
    'help.shortcut.edit': 'E - Edit a todo',
    'help.shortcut.status': 'S - Toggle status',
    'help.shortcut.delete': 'Delete - Delete a todo',
    'help.tip':
      'Tip: You can view tasks in both List and Board views. Filtered views only show matching tasks.',
    'help.viewHelp': 'View Help',
    'help.hideHelp': 'Hide Help',
    // 按鈕
    'button.creating': 'Creating...',
    'button.updating': 'Updating...',
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
    'footer.copyright': '© {year} Todo App 保留所有權利',
    // Todo 頁面標題
    'todos.title': '我的待辦事項',
    'todos.emptyState': '您還沒有任何待辦事項。建立一個開始吧！',
    'todos.emptyStateFiltered': '沒有符合條件的任務',
    'todos.noTasks': '此狀態沒有任務',

    // 待辦事項狀態
    'status.pending': '待處理',
    'status.inProgress': '進行中',
    'status.completed': '已完成',
    'status.all': '全部',

    // 篩選與視圖
    'filter.clearFilters': '清除篩選',
    'view.list': '列表',
    'view.board': '看板',

    // 按鈕和操作
    'button.addTodo': '新增待辦事項',
    'button.createTodo': '建立待辦事項',
    'button.updateTodo': '更新待辦事項',
    'button.deleteTodo': '刪除待辦事項',
    'button.editTodo': '編輯待辦事項',
    'button.cancel': '取消',
    'button.save': '儲存變更',
    'button.back': '返回',

    // 表單標籤
    'form.title': '標題',
    'form.titlePlaceholder': '輸入待辦事項標題',
    'form.description': '描述',
    'form.descriptionPlaceholder': '輸入待辦事項描述',
    'form.status': '狀態',
    'form.selectStatus': '選擇狀態',

    // 詳情頁面
    'detail.todoDetails': '待辦事項詳情',
    'detail.created': '建立時間',
    'detail.lastUpdated': '最後更新',
    'detail.assignedTo': '指派給',

    // 對話框標題
    'dialog.createTitle': '建立新待辦事項',
    'dialog.editTitle': '編輯待辦事項',

    // 通知訊息
    'toast.createSuccess': '待辦事項建立成功',
    'toast.updateSuccess': '待辦事項更新成功',
    'toast.deleteSuccess': '待辦事項刪除成功',
    'toast.undoDelete': '復原',
    'toast.restored': '待辦事項已復原',
    'toast.statusUpdated': '狀態已更新',
    'toast.error.create': '無法建立待辦事項',
    'toast.error.update': '無法更新待辦事項',
    'toast.error.delete': '無法刪除待辦事項',
    'toast.error.load': '無法載入待辦事項',
    'toast.error.notFound': '找不到待辦事項',
    'toast.validation.title': '標題為必填項',

    // 幫助信息
    'help.title': '鍵盤快捷鍵',
    'help.shortcut.open': 'Enter/Space - 打開待辦事項',
    'help.shortcut.edit': 'E - 編輯待辦事項',
    'help.shortcut.status': 'S - 切換狀態',
    'help.shortcut.delete': 'Delete - 刪除待辦事項',
    'help.tip': '提示：您可以在列表視圖和看板視圖中查看任務。篩選視圖僅顯示匹配的任務。',
    'help.viewHelp': '查看幫助',
    'help.hideHelp': '隱藏幫助',
    // 按鈕
    'button.creating': '建立中...',
    'button.updating': '更新中...',
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
