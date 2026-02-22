import { TranslationsObject } from '@/i18n/types';

export const zhTW: TranslationsObject = {
  'hero.title': '輕鬆地管理大家的任務',
  'hero.subtitle': '簡單直覺的任務管理應用程式，幫助您保持組織和高效率。',
  'hero.taskComplete': '完成 landing page 設計',
  'hero.taskInProgress': '實作使用者認證',
  'hero.taskPending': '設計儀表板介面元件',
  'login.title': '快速登入',
  'login.button': '開始使用',
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

  // Dashboard 頁面
  'dashboard.title': '儀表板',
  'dashboard.backToTodos': '返回待辦事項',
  'dashboard.loading': '載入儀表板資料中...',

  // 統計卡片 (StatsCards)
  'dashboard.stats.totalTasks': '總任務數',
  'dashboard.stats.totalTasks.desc': '系統中的所有任務',
  'dashboard.stats.completionRate': '完成率',
  'dashboard.stats.completionRate.desc': '{total} 個任務中已完成 {completed} 個',
  'dashboard.stats.inProgress': '進行中',
  'dashboard.stats.inProgress.desc': '佔所有任務的 {percentage}%',
  'dashboard.stats.completedToday': '今日完成',
  'dashboard.stats.completedToday.desc': '今天完成的任務',

  // 狀態分佈圖表 (StatusDistributionChart)
  'dashboard.statusChart.title': '任務狀態分佈',
  'dashboard.statusChart.noData': '無可用資料',
  'dashboard.statusChart.pending': '待處理',
  'dashboard.statusChart.inProgress': '進行中',
  'dashboard.statusChart.completed': '已完成',

  // 最近活動 (Recent Activity)
  'dashboard.activity.title': '最近活動',
  'dashboard.activity.noTasks': '還沒有任務。建立您的第一個待辦事項開始吧！',
  'dashboard.activity.viewAll': '查看所有待辦事項 →',

  // 任務趨勢圖表 (TaskTrendsChart)
  'dashboard.trends.title': '任務趨勢',
  'dashboard.trends.period.week': '週',
  'dashboard.trends.period.month': '月',
  'dashboard.trends.completed': '已完成',
  'dashboard.trends.created': '已建立',
  'dashboard.trends.rate': '比率',
  'dashboard.trends.completion': '完成',
  'dashboard.trends.insight': '💡 洞察：',
  'dashboard.trends.insight.high': '生產力很棒！您正在完成大部分任務。',
  'dashboard.trends.insight.medium': '進度良好！考慮專注於任務完成。',
  'dashboard.trends.insight.low': '您建立的任務比完成的多。試著專注於完成現有任務。',

  // 時間範圍翻譯
  'timeRange.7days': '7天',
  'timeRange.30days': '30天',
  'timeRange.thisMonth': '本月',

  'button.refresh': '重新整理',
  'toast.error': '錯誤',
  'toast.warning': '警告',
  'toast.success': '成功',
  'error.loadStats': '無法載入統計資料',
  'error.loadTodos': '無法載入待辦事項',
  'error.advancedStats': '無法載入進階統計資料。顯示基本資料。',

  // Dashboard 統計洞察
  'dashboard.insight.productiveHour': '最高效時段',
  'dashboard.insight.tasksCompleted': '個任務已完成',
  'dashboard.insight.avgCompletion': '平均完成時間',
  'dashboard.insight.daysAverage': '天平均',
  'dashboard.insight.weeklyRate': '週完成率',
  'dashboard.insight.tasksThisWeek': '本週任務',

  // Dashboard 其他
  'dashboard.refreshSuccess': '儀表板資料已重新整理',
  'dashboard.refreshError': '部分資料重新整理失敗',
  'dashboard.chartLabel.completedTasks': '已完成任務',
  'dashboard.activity.viewAllLink': '查看所有待辦事項 →',
  'dashboard.activity.statusReplaceHyphen': ' ',
};
