// src/components/todos/TodosHelpInfo.tsx (簡化版本)
import { Info } from 'lucide-react';
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

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        onClick={toggleVisibility}
      >
        <Info className="h-4 w-4" />
        {isVisible ? t('help.hideHelp') : t('help.viewHelp')}
      </Button>

      {isVisible && (
        <Card className="mt-2 bg-muted/30 border-dashed">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">使用指南</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <p className="text-xs text-muted-foreground">
              您可以通過點擊待辦事項卡片查看詳情，使用狀態圖標切換任務狀態，
              或者使用編輯和刪除按鈕管理您的任務。
            </p>
          </CardContent>
          <CardFooter className="py-3">
            <p className="text-xs text-muted-foreground">{t('help.tip')}</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
