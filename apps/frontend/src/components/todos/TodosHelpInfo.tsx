// src/components/todos/TodosHelpInfo.tsx
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
            <CardTitle className="text-sm font-medium">{t('help.title')}</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>
                <span className="font-semibold">Enter/Space</span> - {t('help.shortcut.open')}
              </li>
              <li>
                <span className="font-semibold">E</span> - {t('help.shortcut.edit')}
              </li>
              <li>
                <span className="font-semibold">S</span> - {t('help.shortcut.status')}
              </li>
              <li>
                <span className="font-semibold">Delete</span> - {t('help.shortcut.delete')}
              </li>
            </ul>
          </CardContent>
          <CardFooter className="py-3">
            <p className="text-xs text-muted-foreground">{t('help.tip')}</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
