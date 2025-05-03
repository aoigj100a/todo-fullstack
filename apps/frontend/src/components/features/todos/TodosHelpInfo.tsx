// src/components/features/todos/TodosHelpInfo.tsx
import { Info, Keyboard } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export function TodosHelpInfo() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // 定義快捷鍵分類和列表
  const shortcutCategories = [
    {
      title: 'Navigation',
      shortcuts: [
        { key: '↑/↓', description: 'Navigate todos' },
        { key: 'Enter', description: 'Open selected todo' },
      ],
    },
    {
      title: 'Actions',
      shortcuts: [
        { key: 'N', description: 'Create new todo', highlight: true },
        { key: 'Space', description: 'Toggle status' },
        { key: 'E', description: 'Edit todo' },
        { key: 'Delete', description: 'Delete todo' },
      ],
    },
    {
      title: 'In Dialog',
      shortcuts: [
        { key: 'Ctrl+Enter', description: 'Submit form' },
        { key: 'Esc', description: 'Close dialog' },
        { key: 'Tab', description: 'Navigate fields' },
      ],
    },
  ];

  return (
    <div className="mb-6 mt-8">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        onClick={toggleVisibility}
      >
        {isVisible ? <Info className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />}
        {isVisible ? t('help.hideHelp') : t('help.viewHelp')}
      </Button>

      {isVisible && (
        <Card className="mt-2 bg-muted/30 border-dashed">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-teal-500" />
              {t('help.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shortcutCategories.map((category, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.shortcuts.map((shortcut, shortcutIdx) => (
                      <div
                        key={shortcutIdx}
                        className={`flex items-center gap-2 ${
                          shortcut.highlight ? 'bg-teal-50 p-1 rounded border border-teal-100' : ''
                        }`}
                      >
                        <kbd className="px-2 py-1 bg-white border shadow-sm rounded text-xs font-semibold min-w-[32px] text-center">
                          {shortcut.key}
                        </kbd>
                        <span
                          className={`text-xs ${shortcut.highlight ? 'text-teal-700 font-medium' : 'text-muted-foreground'}`}
                        >
                          {shortcut.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="py-3 border-t border-dashed mt-2">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-xs">
                i
              </span>
              {t('help.tip')}
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
