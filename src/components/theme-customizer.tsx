
'use client';

import { useTheme } from 'next-themes';
import { Check, Palette, FontText, Monitor, Moon, Sun } from 'lucide-react';
import { useConfig } from '@/hooks/use-config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { themes } from '@/lib/themes';
import { cn } from '@/lib/utils';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from './ui/sidebar';
import { Label } from './ui/label';

export function ThemeCustomizer() {
  const [config, setConfig] = useConfig();
  const { setTheme: setMode, resolvedTheme: mode } = useTheme();

  const handleFontChange = (font: string) => {
    document.body.style.setProperty('--font-body', `var(--font-${font})`);
    setConfig({ ...config, font });
  };

  return (
    <SidebarContent>
      <SidebarHeader>
        <h2 className="text-lg font-bold">Theme Settings</h2>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarGroupLabel>Color Palette</SidebarGroupLabel>
        <div className="flex flex-wrap gap-2">
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
                  'justify-start',
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
                    'mr-1.5 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]'
                  )}
                >
                  {isActive && <Check className="h-4 w-4 text-white" />}
                </span>
                {theme.label}
              </Button>
            );
          })}
        </div>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Font</SidebarGroupLabel>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={config.font === 'inter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFontChange('inter')}
          >
            Inter
          </Button>
           <Button
            variant={config.font === 'poppins' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFontChange('poppins')}
          >
            Poppins
          </Button>
          <Button
            variant={config.font === 'literata' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFontChange('literata')}
          >
            Literata
          </Button>
           <Button
            variant={config.font === 'source-serif' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFontChange('source-serif')}
          >
            Source Serif
          </Button>
        </div>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Mode</SidebarGroupLabel>
        <div className="flex gap-2">
          <Button
            variant={mode === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('light')}
          >
            <Sun className="mr-2" /> Light
          </Button>
          <Button
            variant={mode === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('dark')}
          >
            <Moon className="mr-2" /> Dark
          </Button>
        </div>
      </SidebarGroup>
    </SidebarContent>
  );
}
