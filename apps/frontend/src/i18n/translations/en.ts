import { TranslationsObject } from '@/i18n/types';

export const en: TranslationsObject = {
  'hero.title': "Easily Manage Everyone's Tasks",
  'hero.subtitle':
    'A simple, intuitive task management app that helps you stay organized and productive.',
  'hero.taskComplete': 'Complete landing page design',
  'hero.taskInProgress': 'Implement user authentication',
  'hero.taskPending': 'Design dashboard UI components',
  'login.title': 'Quick Login',
  'login.button': 'Get Started',
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

  // Dashboard 頁面
  'dashboard.title': 'Dashboard',
  'dashboard.backToTodos': 'Back to Todos',
  'dashboard.loading': 'Loading dashboard data...',

  // 統計卡片 (StatsCards)
  'dashboard.stats.totalTasks': 'Total Tasks',
  'dashboard.stats.totalTasks.desc': 'All tasks in the system',
  'dashboard.stats.completionRate': 'Completion Rate',
  'dashboard.stats.completionRate.desc': '{completed} of {total} tasks completed',
  'dashboard.stats.inProgress': 'In Progress',
  'dashboard.stats.inProgress.desc': '{percentage}% of all tasks',
  'dashboard.stats.completedToday': 'Completed Today',
  'dashboard.stats.completedToday.desc': 'Tasks completed today',

  // 狀態分佈圖表 (StatusDistributionChart)
  'dashboard.statusChart.title': 'Task Status Distribution',
  'dashboard.statusChart.noData': 'No data available',
  'dashboard.statusChart.pending': 'Pending',
  'dashboard.statusChart.inProgress': 'In Progress',
  'dashboard.statusChart.completed': 'Completed',

  // 最近活動 (Recent Activity)
  'dashboard.activity.title': 'Recent Activity',
  'dashboard.activity.noTasks': 'No tasks yet. Create your first todo to get started!',
  'dashboard.activity.viewAll': 'View all todos →',

  // 任務趨勢圖表 (TaskTrendsChart)
  'dashboard.trends.title': 'Task Trends',
  'dashboard.trends.period.week': 'Week',
  'dashboard.trends.period.month': 'Month',
  'dashboard.trends.completed': 'Completed',
  'dashboard.trends.created': 'Created',
  'dashboard.trends.rate': 'Rate',
  'dashboard.trends.completion': 'Completion',
  'dashboard.trends.insight': '💡 Insight:',
  'dashboard.trends.insight.high': "Great productivity! You're completing most of your tasks.",
  'dashboard.trends.insight.medium': 'Good progress! Consider focusing on task completion.',
  'dashboard.trends.insight.low':
    "You're creating more tasks than completing. Try to focus on finishing existing ones.",

  // 時間範圍翻譯
  'timeRange.7days': '7 Days',
  'timeRange.30days': '30 Days',
  'timeRange.thisMonth': 'This Month',

  'button.refresh': 'Refresh',
  'toast.error': 'Error',
  'toast.warning': 'Warning',
  'toast.success': 'Success',
  'error.loadStats': 'Failed to load statistics',
  'error.loadTodos': 'Failed to load todos',
  'error.advancedStats': 'Unable to load advanced statistics. Showing basic data.',

  // Dashboard 統計洞察
  'dashboard.insight.productiveHour': 'Most Productive Hour',
  'dashboard.insight.tasksCompleted': 'tasks completed',
  'dashboard.insight.avgCompletion': 'Avg Completion Time',
  'dashboard.insight.daysAverage': 'days average',
  'dashboard.insight.weeklyRate': 'Weekly Completion Rate',
  'dashboard.insight.tasksThisWeek': 'tasks this week',

  // Dashboard 其他
  'dashboard.refreshSuccess': 'Dashboard data refreshed',
  'dashboard.refreshError': 'Failed to refresh some data',
  'dashboard.chartLabel.completedTasks': 'Completed Tasks',
  'dashboard.activity.viewAllLink': 'View all todos →',
  'dashboard.activity.statusReplaceHyphen': ' ',
};
