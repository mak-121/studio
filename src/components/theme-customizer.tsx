
'use client';

import { useTheme } from 'next-themes';
import { Check, Moon, Sun } from 'lucide-react';
import { useConfig } from '@/hooks/use-config';
import { Button } from '@/components/ui/button';
import { themes } from '@/lib/themes';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function ThemeCustomizer() {
  const [config, setConfig] = useConfig();
  const { setTheme: setMode, resolvedTheme: mode } = useTheme();

  const handleFontChange = (font: string) => {
    document.body.style.setProperty('--font-body', `var(--font-${font})`);
    setConfig({ ...config, font });
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Customize Theme</h3>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Color Palette</Label>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => {
            const isActive = config.theme === theme.name;
            return (
              <Button
                variant={'outline'}
                size="sm"
                key={theme.name}
                onClick={() => {
                  setConfig({ ...config, theme: theme.name });
                }}
                className={cn(
                  'justify-start h-12',
                  isActive && 'border-2 border-primary'
                )}
                style={
                  {
                    '--theme-primary': `hsl(${
                      theme?.activeColor[mode === 'dark' ? 'dark' : 'light']
                    })`,
                  } as React.CSSProperties
                }
              >
                <span
                  className={cn(
                    'mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[--theme-primary]'
                  )}
                >
                  {isActive && <Check className="h-4 w-4 text-white" />}
                </span>
                {theme.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Font</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={config.font === 'inter' ? 'default' : 'outline'}
            onClick={() => handleFontChange('inter')}
          >
            Inter
          </Button>
           <Button
            variant={config.font === 'poppins' ? 'default' : 'outline'}
            onClick={() => handleFontChange('poppins')}
          >
            Poppins
          </Button>
          <Button
            variant={config.font === 'literata' ? 'default' : 'outline'}
            onClick={() => handleFontChange('literata')}
          >
            Literata
          </Button>
           <Button
            variant={config.font === 'source-serif' ? 'default' : 'outline'}
            onClick={() => handleFontChange('source-serif')}
          >
            Source Serif
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === 'light' ? 'default' : 'outline'}
            onClick={() => setMode('light')}
          >
            <Sun className="mr-2" /> Light
          </Button>
          <Button
            variant={mode === 'dark' ? 'default' : 'outline'}
            onClick={() => setMode('dark')}
          >
            <Moon className="mr-2" /> Dark
          </Button>
        </div>
      </div>
    </div>
  );
}
